#include "flash_storage.h"
#include "pico/stdlib.h"
#include "hardware/flash.h"
#include "hardware/sync.h"
#include <string.h>

// Definições de Hardware
#define FLASH_TARGET_OFFSET (PICO_FLASH_SIZE_BYTES - FLASH_SECTOR_SIZE)
#define FLASH_READ_START (XIP_BASE + FLASH_TARGET_OFFSET)
#define MAGIC_ID 0xCAFEBABE // Mudei o Magic para garantir que ele ignore dados antigos bugados

// O RP2040 exige escrita em páginas de 256 bytes
#define PAGE_SIZE FLASH_PAGE_SIZE 

// Cálculo de quantos registros cabem (4096 / 256 = 16 registros)
static const uint16_t max_records = FLASH_SECTOR_SIZE / PAGE_SIZE;

static uint16_t write_index = 0;
static uint16_t read_index = 0;

void storage_init(void) {
    write_index = 0;
    read_index = 0;

    const uint8_t *flash_mem = (const uint8_t *)FLASH_READ_START;
    
    // Varre a flash pulando de 256 em 256 bytes
    for (int i = 0; i < max_records; i++) {
        // Lê o cabeçalho de cada página
        const stored_data_t *record = (const stored_data_t *)(flash_mem + (i * PAGE_SIZE));
        
        if (record->magic == MAGIC_ID) {
            write_index = i + 1;
        } else {
            // Se encontrou algo que não é nosso Magic (ex: 0xFF ou lixo), paramos aqui
            break; 
        }
    }
    
    // Se o write_index estiver muito alto ou inconsistente, reseta tudo
    if (write_index >= max_records) {
        printf("Flash cheia ou inconsistente. Resetando setor...\n");
        uint32_t ints = save_and_disable_interrupts();
        flash_range_erase(FLASH_TARGET_OFFSET, FLASH_SECTOR_SIZE);
        restore_interrupts(ints);
        write_index = 0;
    }

    printf("Storage iniciado. Pendentes: %d\n", write_index);
}

bool storage_save(stored_data_t *data) {
    if (write_index >= max_records) {
        return false; // Flash cheia
    }

    data->magic = MAGIC_ID;

    // Buffer temporário de 256 bytes (1 página)
    uint8_t page_buffer[PAGE_SIZE];
    
    // 1. Preenche com 0xFF (estado "apagado" da flash)
    memset(page_buffer, 0xFF, PAGE_SIZE);
    
    // 2. Copia nossa struct para o inicio do buffer
    memcpy(page_buffer, data, sizeof(stored_data_t));

    uint32_t offset = FLASH_TARGET_OFFSET + (write_index * PAGE_SIZE);

    // 3. Grava a página inteira (CRÍTICO: Interrupções desativadas)
    uint32_t ints = save_and_disable_interrupts();
    flash_range_program(offset, page_buffer, PAGE_SIZE);
    restore_interrupts(ints);

    write_index++;
    return true;
}

bool storage_get_next(stored_data_t *data) {
    if (read_index >= write_index) {
        return false;
    }

    const uint8_t *flash_mem = (const uint8_t *)FLASH_READ_START;
    
    // Lê do endereço correto (salto de 256 bytes)
    const stored_data_t *stored = (const stored_data_t *)(flash_mem + (read_index * PAGE_SIZE));

    memcpy(data, stored, sizeof(stored_data_t));
    return true;
}

void storage_ack(void) {
    read_index++;

    // Se lemos tudo, apaga o setor para liberar espaço
    if (read_index >= write_index) {
        printf("Todos dados enviados. Limpando Flash...\n");
        uint32_t ints = save_and_disable_interrupts();
        flash_range_erase(FLASH_TARGET_OFFSET, FLASH_SECTOR_SIZE);
        restore_interrupts(ints);
        
        write_index = 0;
        read_index = 0;
    }
}

bool storage_has_data(void) {
    return read_index < write_index;
}