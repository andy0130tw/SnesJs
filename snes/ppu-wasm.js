
// createModule().then(Module => {
//   console.warn(Module)
//   const ptrSnes = Module
//   const ptrPpu = Module._ppu_init(ptrSnes)
//   Module._ppu_reset(ptrPpu)

//   const ptrFrameBuf = Module._malloc(2048 * 480)

//   Module._ppu_write(ptrPpu, 0x05, 1)
//   Module._ppu_runLine(ptrPpu, 0)
//   Module._ppu_putPixels(ptrPpu, ptrFrameBuf)

//   console.log(Module.getValue(ptrFrameBuf + 2048 * 480 - 1, 'i8'))

//   // console.log(Module.getValue(ptrPpu, "*"))
// })

class Ppu {
  constructor(snes) {
    this.snes = snes

    this._reset()

    this.wasmModule = null
    this.ptrSnes = 0
    this.ptrPpu = 0
    this.ptrFrameBuf = 0
    this.ptrOverscan = 0
    this.ptrFrameOverscan = 0
  }

  async initialize() {
    if (this.wasmModule == null) {
      const M = await createModule()
      M._snes_getOpenBus = () => this.snes.openBus

      this.ptrSnes = M._snes_init()
      this.ptrPpu = M._ppu_init(this.ptrSnes)
      this.ptrFrameBuf = M._malloc(2048 * 480)
      M._ppu_reset(this.ptrPpu)

      this.ptrOverscan = M._ppu_getOverscan()
      this.ptrFrameOverscan = M._ppu_getFrameOverscan()

      console.log(M, this.ptrSnes, this.ptrPpu)
      this.wasmModule = M
    }

    return this.wasmModule
  }

  reset() {
    this._reset()
    if (this.wasmModule) {
      this.wasmModule._ppu_reset(this.ptrPpu)
    }
  }

  get frameOverscan() {
    return !!this.wasmModule.HEAPU8[this.ptrFrameOverscan]
    // return this.wasmModule._ppu_getFrameOverscan(this.ptrPpu)
  }

  _reset() {
    this.latchedHpos = 0
    this.latchedVpos = 0
    this.countersLatched = false
  }

  checkOverscan(line) {
    if (line === 225 && this.wasmModule.HEAPU8[this.ptrOverscan]) {
      // this.wasmModule._ppu_checkOverscan(this.ptrPpu)
      this.wasmModule.HEAPU8[this.ptrFrameOverscan] = true
    }
  }

  renderLine(y) {
    this.wasmModule._ppu_runLine(this.ptrPpu, y)
  }

  read(addr) {
    return this.wasmModule._ppu_read(this.ptrPpu, addr)
  }

  write(addr, value) {
    this.wasmModule._ppu_write(this.ptrPpu, addr, value)
  }

  setPixels(buf) {
    this.wasmModule._ppu_putPixels(this.ptrPpu, this.ptrFrameBuf)
    this.wasmModule._snes_fixByteOrder(this.ptrFrameBuf)

    const memView = this.wasmModule.HEAPU8.subarray(this.ptrFrameBuf, this.ptrFrameBuf + 2048 * 480)
    buf.set(memView)
  }
}
