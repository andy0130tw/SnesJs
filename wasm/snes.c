#include "ppu.h"
#include "snes.h"

uint16_t liblakesnes_version[3] = {0, 0, 1};

EMSCRIPTEN_KEEPALIVE
Snes* snes_init(void) {
  Snes* snes = malloc(sizeof(Snes));
  return snes;
}

EMSCRIPTEN_KEEPALIVE
void snes_free(Snes* snes) {
  free(snes);
}

EMSCRIPTEN_KEEPALIVE
void snes_fixByteOrder(uint8_t buf[2048*480]) {
  uint32_t* buf2 = (uint32_t*) buf;

  for (int i = 0; i < 2048 * 120; i++) {
    uint32_t t = buf2[i];
    buf2[i] = 0xff000000 | ((t & 0xff00) << 8) | ((t & 0xff0000) >> 8) | ((t & 0xff000000) >> 24);

    /*buf[i*4] = buf[i*4+3];
    buf[i*4+3] = 255;

    uint8_t tmp = buf[i*4+1];
    buf[i*4+1] = buf[i*4+2];
    buf[i*4+2] = tmp;*/
  }
}

EMSCRIPTEN_KEEPALIVE void snes_setHPos(Snes* s, uint16_t v) { s->hPos = v; }
EMSCRIPTEN_KEEPALIVE void snes_setVPos(Snes* s, uint16_t v) { s->vPos = v; }
// EMSCRIPTEN_KEEPALIVE void snes_setOpenBus(Snes* s, uint8_t v) { s->openBus = v; }

EMSCRIPTEN_KEEPALIVE uint16_t snes_getHPos(Snes* s) { return s->hPos; }
EMSCRIPTEN_KEEPALIVE uint16_t snes_getVPos(Snes* s) { return s->vPos; }
// EMSCRIPTEN_KEEPALIVE uint8_t snes_getOpenBus(Snes* s) { return s->openBus; }
