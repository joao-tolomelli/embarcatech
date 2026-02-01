#include <stdio.h>
#include <string.h>
#include <math.h>

// Imports do SDK
#include "pico/stdlib.h"
#include "hardware/i2c.h"
#include "pico/cyw43_arch.h"
#include "hardware/rtc.h" 

// FreeRTOS
#include "FreeRTOS.h"
#include "task.h"
#include "semphr.h"

// Imports externos
#include "ssd1306.h"
#include "wifi.h"
#include "mqtt.h"
#include "aht10.h"
#include "bh1750.h"
#include "mpu_wrapper.h"
#include "flash_storage.h"

// Definição do limiar de luz para considerar a caixa aberta
#define LIMIAR_LUX 10.0f
#define LIMIAR_COLISAO 2.5f

// Estrutura global para dados dos sensores
typedef struct
{
    float temperatura;
    float umidade;
    bool caixa_aberta;
    bool colisao;
} sensor_data_t;

volatile sensor_data_t sensor_data;

// Mutex para proteger acesso aos dados dos sensores
SemaphoreHandle_t xSensorMutex;
SemaphoreHandle_t xI2CMutex;

// Configurações do I2C0
#define I2C0_PORT i2c0
#define I2C0_SDA_PIN 0
#define I2C0_SCL_PIN 1

// Prototipos das funções I2C0
int i2c_write(uint8_t addr, const uint8_t *data, uint16_t len);
int i2c_read(uint8_t addr, uint8_t *data, uint16_t len);
void delay_ms(uint32_t ms);

// Configurações do I2C1
#define I2C1_PORT i2c1
#define I2C1_SDA_PIN 14
#define I2C1_SCL_PIN 15

// Protótipos das tasks
void display_task(void *pv);
void mqtt_task(void *pv);
void aht10_task(void *pv);
void bh1750_task(void *pv);
void mpu6050_task(void *pv);

int main()
{
    stdio_init_all();

    if (cyw43_arch_init())
    {
        printf("Erro ao iniciar CYW43\n");
        return -1;
    }

    cyw43_arch_enable_sta_mode();

    // Inicia o WiFi
    wifi_init();

    // Inicia o MQTT
    mqtt_start();

    // Configura I2C0
    i2c_init(I2C0_PORT, 100000);
    gpio_set_function(I2C0_SDA_PIN, GPIO_FUNC_I2C);
    gpio_set_function(I2C0_SCL_PIN, GPIO_FUNC_I2C);
    gpio_pull_up(I2C0_SDA_PIN);
    gpio_pull_up(I2C0_SCL_PIN);

    // Configura I2C1
    i2c_init(I2C1_PORT, 400000);
    gpio_set_function(I2C1_SDA_PIN, GPIO_FUNC_I2C);
    gpio_set_function(I2C1_SCL_PIN, GPIO_FUNC_I2C);
    gpio_pull_up(I2C1_SDA_PIN);
    gpio_pull_up(I2C1_SCL_PIN);

    // Processo de inicialização completo do OLED SSD1306
    ssd1306_t disp;
    disp.external_vcc = false;
    ssd1306_init(&disp, 128, 64, 0x3C, i2c1);
    ssd1306_clear(&disp);

    // Inicializa BH1750
    printf("Inicializando BH1750...\n");
    bh1750_init(I2C0_PORT);
    sleep_ms(1000);

    // Inicializa MPU6050
    printf("Inicializando MPU6050...\n");
    mpu6050_init_c(I2C0_PORT, 0x68);
    sleep_ms(1000);

    // Inicializa o sensor AHT10
    // Define estrutura do sensor
    AHT10_Handle aht10 = {
        .iface = {
            .i2c_write = i2c_write,
            .i2c_read = i2c_read,
            .delay_ms = delay_ms}};

    printf("Inicializando AHT10...\n");
    if (!AHT10_Init(&aht10))
    {
        printf("Falha na inicialização do sensor!\n");
        while (1)
            sleep_ms(1000);
    }

    // INICIALIZA O ARMAZENAMENTO NA FLASH
    storage_init();

    // Cria os Mutex
    xSensorMutex = xSemaphoreCreateMutex();
    xI2CMutex = xSemaphoreCreateMutex();
    if (xSensorMutex == NULL || xI2CMutex == NULL) {
        printf("Erro ao criar Mutexes!\n");
    }

    // Cria tasks
    xTaskCreate(display_task, "display", 3072, &disp, 1, NULL);
    xTaskCreate(mqtt_task, "mqtt", 4096, NULL, 2, NULL);
    xTaskCreate(aht10_task, "AHT10", 2048, &aht10, 3, NULL);
    xTaskCreate(bh1750_task, "BH1750", 2048, NULL, 3, NULL);
    xTaskCreate(mpu6050_task, "MPU6050", 2048, NULL, 3, NULL);

    // inicia FreeRTOS
    vTaskStartScheduler();

    while (true)
    {
        // Nunca deve chegar aqui
    };
}

void aht10_task(void *pv)
{
    AHT10_Handle *sensor = (AHT10_Handle *)pv;
    float temp_lida, hum_lida;

    while (true)
    {
        bool leitura_ok = false;

        // --- PROTEÇÃO DO I2C ---
        if (xSemaphoreTake(xI2CMutex, pdMS_TO_TICKS(200)) == pdTRUE) {
            leitura_ok = AHT10_ReadTemperatureHumidity(sensor, &temp_lida, &hum_lida);
            xSemaphoreGive(xI2CMutex);
        }

        if (leitura_ok)
        {
            if (xSemaphoreTake(xSensorMutex, pdMS_TO_TICKS(100)) == pdTRUE)
            {
                sensor_data.temperatura = temp_lida;
                sensor_data.umidade = hum_lida;
                xSemaphoreGive(xSensorMutex);
            }
        }
        vTaskDelay(pdMS_TO_TICKS(2000)); 
    }
}

// --- TASK DO SENSOR DE LUMINOSIDADE ---
void bh1750_task(void *pv)
{
    float lux_lido = -1.0f; // Inicializa com erro

    while (true)
    {
        // --- PROTEÇÃO DO I2C ---
        if (xSemaphoreTake(xI2CMutex, pdMS_TO_TICKS(100)) == pdTRUE) {
            lux_lido = bh1750_read_lux(I2C0_PORT);
            xSemaphoreGive(xI2CMutex);
        }
        // -----------------------

        if (lux_lido >= 0)
        {
            if (xSemaphoreTake(xSensorMutex, pdMS_TO_TICKS(100)) == pdTRUE)
            {
                sensor_data.caixa_aberta = (lux_lido > LIMIAR_LUX);
                xSemaphoreGive(xSensorMutex);
            }
        }
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}

// --- TASK MPU6050 (COLISÃO) ---
void mpu6050_task(void *pv) {
    float ax, ay, az;
    float magnitude;
    int contador_reset_colisao = 0;

    while(true) {
        // --- PROTEÇÃO DO I2C ---
        if (xSemaphoreTake(xI2CMutex, pdMS_TO_TICKS(100)) == pdTRUE) {
            mpu6050_read_accel_c(&ax, &ay, &az);
            xSemaphoreGive(xI2CMutex);
        // -----------------------

            magnitude = sqrtf((ax * ax) + (ay * ay) + (az * az));
            bool impacto_detectado = (magnitude > LIMIAR_COLISAO);

            if (impacto_detectado) {
                printf("Impacto! Mag: %.2f\n", magnitude);
                contador_reset_colisao = 100; 
            }
        }

        // Atualiza struct global (Mutex de DADOS)
        if (xSemaphoreTake(xSensorMutex, pdMS_TO_TICKS(50)) == pdTRUE) {
             // ... sua lógica de colisão original ...
             if (contador_reset_colisao > 0) {
                sensor_data.colisao = true;
                contador_reset_colisao--;
            } else {
                sensor_data.colisao = false;
            }
            xSemaphoreGive(xSensorMutex);
        }
        vTaskDelay(pdMS_TO_TICKS(100)); 
    }
}

void display_task(void *pv)
{
    ssd1306_t *disp = (ssd1306_t *)pv;
    char buffer[32];

    // Variáveis locais para armazenar cópia dos dados
    float temp_local = 0.0f;
    float hum_local = 0.0f;
    const char *status_caixa;
    const char *status_colisao;

    while (true)
    {
        if (xSemaphoreTake(xSensorMutex, pdMS_TO_TICKS(100)) == pdTRUE)
        {
            temp_local = sensor_data.temperatura;
            hum_local = sensor_data.umidade;
            status_caixa = sensor_data.caixa_aberta ? "Aberta" : "Fechada";
            status_colisao = sensor_data.colisao ? "SIM" : "nao";
            xSemaphoreGive(xSensorMutex);
        }

        ssd1306_clear(disp);

        // Formata e exibe usando as variáveis locais
        sprintf(buffer, "Temp: %.1f C", temp_local);
        ssd1306_draw_string(disp, 10, 10, 1, buffer);

        sprintf(buffer, "Umid: %.1f %%", hum_local);
        ssd1306_draw_string(disp, 10, 25, 1, buffer);

        sprintf(buffer, "Caixa: %s", status_caixa);
        ssd1306_draw_string(disp, 10, 40, 1, buffer);

        sprintf(buffer, "Colisao: %s", status_colisao);
        ssd1306_draw_string(disp, 10, 55, 1, buffer);

        ssd1306_show(disp);
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

void mqtt_task(void *pv)
{
    char payload[256]; // Aumentei um pouco o buffer
    
    // Variáveis locais
    stored_data_t dados_atuais;
    stored_data_t dados_pendentes;

    while (1)
    {
        // 1. Coleta os dados atuais (fazemos isso independente da conexão)
        if (xSemaphoreTake(xSensorMutex, pdMS_TO_TICKS(100)) == pdTRUE)
        {
            dados_atuais.temperatura = sensor_data.temperatura;
            dados_atuais.umidade = sensor_data.umidade;
            dados_atuais.caixa_aberta = sensor_data.caixa_aberta;
            dados_atuais.colisao = sensor_data.colisao;
            // dados_atuais.timestamp = to_ms_since_boot(get_absolute_time()); // Exemplo de timestamp simples
            dados_atuais.timestamp = xTaskGetTickCount(); // Timestamp relativo (ticks do RTOS)
            
            xSemaphoreGive(xSensorMutex);
        }

        bool online = mqtt_is_connected();

        if (online)
        {
            // --- MODO ONLINE: Esvazia a fila depois envia o atual ---

            // 1. Verifica se tem dados antigos na Flash
            while (storage_has_data()) {
                if (storage_get_next(&dados_pendentes)) {
                    printf("Enviando dado historico da Flash...\n");
                    
                    sprintf(payload, "{\"temperatura\": %.1f, \"umidade\": %.1f, \"caixa\": \"%s\", \"colisao\": \"%s\", \"ts\": %u, \"offline\": true}", 
                            dados_pendentes.temperatura, 
                            dados_pendentes.umidade, 
                            dados_pendentes.caixa_aberta ? "aberta" : "fechada", 
                            dados_pendentes.colisao ? "SIM" : "nao",
                            dados_pendentes.timestamp);

                    // Publica síncrono ou com delay para não saturar
                    mqtt_publish_async("pico/dados", payload); 
                    
                    // Confirma envio (Ack) para avançar fila e possivelmente limpar Flash
                    storage_ack(); 
                    
                    vTaskDelay(pdMS_TO_TICKS(500)); // Pequeno delay entre envios em massa
                } else {
                    break;
                }
            }

            // 2. Envia o dado atual (Live)
            sprintf(payload, "{\"temperatura\": %.1f, \"umidade\": %.1f, \"caixa\": \"%s\", \"colisao\": \"%s\", \"ts\": %u, \"offline\": false}", 
                    dados_atuais.temperatura, 
                    dados_atuais.umidade, 
                    dados_atuais.caixa_aberta ? "aberta" : "fechada", 
                    dados_atuais.colisao ? "SIM" : "nao",
                    dados_atuais.timestamp);

            mqtt_publish_async("pico/dados", payload);
            printf("Dado Online enviado.\n");
        }
        else
        {
            // --- MODO OFFLINE: Salva na Flash ---
            printf("MQTT Offline. Salvando na Flash...\n");
            
            if (storage_save(&dados_atuais)) {
                printf("Dado salvo no indice seguro.\n");
            } else {
                printf("ERRO: Flash cheia! Dado perdido.\n");
                // Aqui você poderia decidir apagar tudo para recomeçar (circular)
                // ou simplesmente descartar o novo.
            }
        }

        vTaskDelay(pdMS_TO_TICKS(10000)); // Ciclo de 10 segundos
    }
}

// Função para escrita I2C
int i2c_write(uint8_t addr, const uint8_t *data, uint16_t len)
{
    int result = i2c_write_blocking(I2C0_PORT, addr, data, len, false);
    return result < 0 ? -1 : 0;
}

// Função para leitura I2C
int i2c_read(uint8_t addr, uint8_t *data, uint16_t len)
{
    int result = i2c_read_blocking(I2C0_PORT, addr, data, len, false);
    return result < 0 ? -1 : 0;
}

// Função para delay
void delay_ms(uint32_t ms)
{
    sleep_ms(ms);
}
