#ifndef SNES_H
#define SNES_H

#include <emscripten/emscripten.h>

typedef struct Snes Snes;

struct Snes {
  uint16_t hPos;
  uint16_t vPos;
};

extern uint8_t snes_getOpenBus();

#endif
