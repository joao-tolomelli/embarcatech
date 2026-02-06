# 📦 Sistema IoT para Monitoramento de Cargas Sensíveis

![Status](https://img.shields.io/badge/Status-Finalizado-success)
![Platform](https://img.shields.io/badge/Hardware-Raspberry%20Pi%20Pico%20W-red)
![Stack](https://img.shields.io/badge/Stack-C%20%7C%20Node.js%20%7C%20React%20%7C%20Docker-blue)

Este projeto implementa uma solução completa de IoT (Internet das Coisas) para rastreamento de encomendas sensíveis. O sistema monitora variáveis críticas (temperatura, umidade, luminosidade e impactos) e garante a integridade dos dados através de um mecanismo de **persistência offline** na memória Flash, sincronizando automaticamente com a nuvem quando a conexão é restabelecida.

---

## 🚀 Funcionalidades

- **Monitoramento em Tempo Real:** Leitura de sensores a cada ciclo definido.
- **Persistência Offline (Flash Storage):** Armazena dados localmente em um buffer circular quando não há conexão Wi-Fi.
- **Sincronização Automática:** Envia os dados históricos assim que a conexão é retomada.
- **Detecção de Anomalias:**
  - 🚨 **Colisão:** Detecção de impactos via acelerômetro.
  - 🔓 **Violação:** Detecção de abertura de caixa via sensor de luz.
- **Dashboard Web:** Interface gráfica para visualização de gráficos e logs de eventos.
- **Infraestrutura Containerizada:** Todo o backend, banco de dados e broker MQTT rodam em Docker.

---

## 🛠️ Arquitetura de Hardware

O firmware foi desenvolvido em **C** utilizando o **FreeRTOS** para gerenciamento de tarefas no **Raspberry Pi Pico W**.

| Componente | Função | Barramento | Pinos (GPIO) |
|------------|--------|------------|--------------|
| **Raspberry Pi Pico W** | MCU Principal | - | - |
| **AHT10** | Temperatura e Umidade | I2C0 | SDA: 0 / SCL: 1 |
| **BH1750** | Luminosidade (Lux) | I2C0 | SDA: 0 / SCL: 1 |
| **MPU6050** | Acelerômetro | I2C0 | SDA: 0 / SCL: 1 |
| **OLED SSD1306** | Display de Status Local | I2C1 | SDA: 14 / SCL: 15 |

---

## 💻 Arquitetura de Software

O projeto é dividido em duas partes principais:

1.  **Firmware (Embarcado):**
    -   Linguagem C (Pico SDK).
    -   FreeRTOS (Tasks independentes para sensores, rede e display).
    -   Protocolo MQTT (lwIP).
    -   File System direto na Flash (Raw Flash API).

2.  **Servidor (Aplicação):**
    -   **Docker Compose:** Orquestração dos serviços.
    -   **Mosquitto:** Broker MQTT.
    -   **PostgreSQL:** Banco de dados relacional.
    -   **Node.js (Backend):** API REST e worker MQTT.
    -   **React (Frontend):** Dashboard interativo.
    -   **Nginx:** Servidor web e proxy reverso.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados.
- [VS Code](https://code.visualstudio.com/) com a extensão [Raspberry Pi Pico](https://marketplace.visualstudio.com/items?itemName=raspberry-pi.raspberry-pi-pico).
- SDK do Raspberry Pi Pico configurado (ou ambiente de compilação CMake/GCC-ARM).

### Passo 1: Subir o Servidor (Backend/Frontend)

1.  Navegue até a raiz do repositório:
    ```bash
    cd caminho/para/o/projeto
    ```

2.  Inicie os containers:
    ```bash
    docker compose up --build
    ```

3.  Aguarde a finalização do build. O sistema estará disponível em:
    -   **Frontend (Dashboard):** `http://localhost:3000`
    -   **Backend API:** `http://localhost:4000`
    -   **Broker MQTT:** `localhost:1883`

### Passo 2: Configurar e Gravar o Firmware

1.  Abra a pasta do firmware (ex: `firmware/` ou `src/`) no VS Code.
2.  Abra o arquivo `lib/wifi/wifi.c` (ou onde as credenciais estiverem definidas) e altere para sua rede:
    ```c
    #define WIFI_SSID "SUA_REDE_WIFI"
    #define WIFI_PASSWORD "SUA_SENHA"
    ```
3.  Certifique-se de que o IP do Broker MQTT no arquivo `src/config/mqtt_config.h` (ou `main.c`) aponta para o IP da sua máquina onde o Docker está rodando (não use `localhost` no código do Pico, use o IP da sua rede local, ex: `192.168.X.X`).
4.  Clique em **Compile** na barra inferior da extensão do Pico.
5.  Conecte o Raspberry Pi Pico W segurando o botão **BOOTSEL**.
6.  Copie o arquivo `.uf2` gerado na pasta `build/` para a unidade USB do Pico.

---

## 🧪 Como Testar

1.  **Teste Online:** Com o sistema rodando e o Pico conectado ao Wi-Fi, observe os gráficos mudarem no Dashboard (`http://localhost:3000`).
2.  **Teste de Colisão:** Agite o sensor MPU6050 bruscamente. O status "Colisão" deve ficar vermelho no site.
3.  **Teste Offline:**
    -   Desligue o roteador Wi-Fi ou mude a credencial no código para forçar erro.
    -   Aguarde alguns minutos gerando dados.
    -   Restabeleça a conexão.
    -   Observe no Console Serial ou no Dashboard os dados antigos chegando com a flag `offline: true`.

---


## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**Autor:** João Vítor Guttierrez Tolomelli

**Embarcatech - Residência Tecnológica em Sistemas Embarcados**