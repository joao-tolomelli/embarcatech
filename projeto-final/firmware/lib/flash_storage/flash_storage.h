#ifndef FLASH_STORAGE_H
#define FLASH_STORAGE_H

#include <stdint.h>
#include <stdio.h>
#include <stdbool.h>

typedef struct {
    float temperatura;
    float umidade;
    bool caixa_aberta;
    bool colisao;
    uint32_t timestamp; 
    uint32_t magic;     
    // O restante dos bytes até 256 será preenchido com 0xFF pelo nosso código C
} stored_data_t;

void storage_init(void);
bool storage_save(stored_data_t *data);
bool storage_get_next(stored_data_t *data);
void storage_ack(void);
bool storage_has_data(void);

#endif