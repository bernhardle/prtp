//% weight=95 color=#0fbc11 icon="\uf039"
//% advanced=true
namespace grooveLedbar {
    //
    export enum Pattern {
        //% block="Punkt"
        Spot,
        //% block="Welle"
        Wave,
        //% block="Gradient"
        Ramp,
        //% block="Balken"
        Block,
        //% block="Zufall"
        Random,
        //% block="Kerze"
        Candle
    }
    //
    export enum UpdateMode {
        //% block="Sprung"
        Jumping,
        //% block="Gleitend"
        Sliding
    }
    //
    const seq01: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const seq02: number[] = [255, 127, 64, 32, 16, 8, 16, 32, 64, 127, 255, 127, 64, 32, 16, 8, 16, 32, 64, 127]
    const seq03: number[] = [0, 25, 50, 75, 100, 125, 150, 175, 200, 255, 0, 25, 50, 75, 100, 125, 150, 175, 200, 255]
    const seq04: number[] = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const seq05: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 127, 127, 127, 127, 127, 127, 127, 127, 127]
    //
    export class ledbar {
        //
        dataPin: DigitalPin;
        clockPin: DigitalPin;
        timescale: number;
        sequence: number[];
        lastOffset: number;
        dataClock: number;
        latchStartWait: number;
        latchHigh: number;
        latchLow: number;
        latchEndWait: number;
        //
        constructor(seq: number[], dip: DigitalPin, clp: DigitalPin) {
            let tmp: Array<number> = [];
            for (let i of seq) tmp.push(i);
            for (let j: number = tmp.length; j < 20; j++) tmp.push(0);
            this.timescale = 1;
            this.lastOffset = 0;
            this.sequence = tmp;
            this.dataPin = dip;
            this.clockPin = clp;
            this.dataClock = 5 * this.timescale
            this.latchStartWait = 400 * this.timescale
            this.latchHigh = 70 * this.timescale
            this.latchLow = 220 * this.timescale
            this.latchEndWait = 5 * this.timescale
        }
        /**
         * Funktion schreibt das Header mit den
         * Defaults fuer 8-Bit Intensitaet
        */
        private writeHeader(): void {
            pins.digitalWritePin(this.dataPin, 0)
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(this.clockPin, 1)
                control.waitMicros(this.dataClock)
                pins.digitalWritePin(this.clockPin, 0)
                control.waitMicros(this.dataClock)
            }
        }
        /**
    * Funktion schreibt ein Byte mit Nullen
    */
        private writeZero(): void {
            pins.digitalWritePin(this.dataPin, 0)
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(this.clockPin, 1)
                control.waitMicros(this.dataClock)
                pins.digitalWritePin(this.clockPin, 0)
                control.waitMicros(this.dataClock)
            }
        }
        /**
         * 
         */
        private writeData8(val: number): void {
            pins.digitalWritePin(this.dataPin, 0)
            for (let i = 0; i < 4; i++) {
                pins.digitalWritePin(this.clockPin, 1)
                control.waitMicros(this.dataClock)
                pins.digitalWritePin(this.clockPin, 0)
                control.waitMicros(this.dataClock)
            }
            if (127 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 128
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 1)
            control.waitMicros(this.dataClock)
            if (63 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 64
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 0)
            control.waitMicros(this.dataClock)
            if (31 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 32
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 1)
            control.waitMicros(this.dataClock)
            if (15 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 16
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 0)
            control.waitMicros(this.dataClock)
            if (7 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 8
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 1)
            control.waitMicros(this.dataClock)
            if (3 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 4
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 0)
            control.waitMicros(this.dataClock)
            if (1 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 2
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 1)
            control.waitMicros(this.dataClock)
            if (0 < val) {
                pins.digitalWritePin(this.dataPin, 1)
                val -= 1
            } else {
                pins.digitalWritePin(this.dataPin, 0)
            }
            pins.digitalWritePin(this.clockPin, 0)
            control.waitMicros(this.dataClock)
        }
        /**
         * Funktion latch () ohne Argumente und Rueckgabe
     * veranlasst die Uebernahme der Daten aus dem
     * Schieberegister in die Anzeige
        */
        private latch(): void {
            pins.digitalWritePin(this.clockPin, 0)
            control.waitMicros(this.latchStartWait)
            pins.digitalWritePin(this.dataPin, 1)
            control.waitMicros(this.latchHigh)
            pins.digitalWritePin(this.dataPin, 0)
            control.waitMicros(this.latchLow)
            pins.digitalWritePin(this.dataPin, 1)
            control.waitMicros(this.latchHigh)
            pins.digitalWritePin(this.dataPin, 0)
            control.waitMicros(this.latchLow)
            pins.digitalWritePin(this.dataPin, 1)
            control.waitMicros(this.latchHigh)
            pins.digitalWritePin(this.dataPin, 0)
            control.waitMicros(this.latchLow)
            pins.digitalWritePin(this.dataPin, 1)
            control.waitMicros(this.latchHigh)
            pins.digitalWritePin(this.dataPin, 0)
            control.waitMicros(this.latchEndWait)
        }
        //
        public display(offset: number, brightness: number): void {
            let k: number = Math.max(0, Math.min(255, brightness));
            let l: number = (10 * offset) / 255;
            let m: number = (10 * offset) % 255;
            this.writeHeader();
            for (let i = 0; i < 10; i++) {
                this.writeData8((k * this.sequence.get((i + l) % 20)) / 255);
            }
            for (let i = 0; i < 2; i++) {
                this.writeZero();
            }
            this.latch();
        }
        //
        public rotate(pos: number): void {
            for (let i = 0; i < (20 + pos % 20) % 20; i++) this.sequence.push(this.sequence.shift());
        }
    }
    /**
      * Testet in der Zahl [val] das Bit an der Position [pos]
      * @param val Ganzzahliger Wert, eg: 5
      * @param pos Ganzzahliger nicht-negativer Wert, eg: 0
      */
    //% block
    export function testBit(val: number, pos: number): boolean {
        return (val & (0x1 << pos)) == 0 ? false : true;
    }
    /**
    * Setzt in der Zahl [val] das Bit an der Position [pos]
    * @param val Ganzzahliger Wert, eg: 5
    * @param pos Ganzzahliger nicht-negativer Wert, eg: 0
    */
    //% block
    export function setBit(val: number, pos: number): number {
        return val |= (0x1 << pos);
    }
    /**
    * L�scht in der Zahl [val] das Bit an der Position [pos]
    * @param val Ganzzahliger Wert, eg: 5
    * @param pos Ganzzahliger nicht-negativer Wert, eg: 0
    */
    //% block
    export function clearBit(val: number, pos: number): number {
        return val &= (val ^ (0x1 << pos));
    }
    /**
    * Flipt in der Zahl [val] das Bit an der Position [pos]
    * @param val Ganzzahliger Wert, eg: 5
    * @param pos Ganzzahliger nicht-negativer Wert, eg: 0
    */
    //% block
    export function toggleBit(val: number, pos: number): number {
        return val ^= (0x1 << pos);
    }
    /**
     * Rotiert das interne Array des LedBar Objekts um einen Platz
     * @param ledbar Zeiger auf ein LedBar Objekt
     * @param offset Offset der Rotation
     */
    //% block
    export function rotate(ledbar: ledbar, offset: number = 0): ledbar {
        if (ledbar != null) ledbar.rotate(offset);
        return ledbar;
    }
    /** 
     * Zeigt die Werte des im Ledbar Objekt gespeicherten Musters an
     * @param ledbar Zeiger auf ein LedBar Objekt
     * @param offset Verschiebung als Zahl [0 ... 255]
     * @param brightness Helligkeit als Zahl [0 ... 255]
     */
    //% block
    export function display(offset: number = 0, brightness: number = 255, ledbar: ledbar): void {
        if (ledbar != null) {
            ledbar.display(offset, brightness);
        }
    }
    /**
     * Funktion aendert die Zeitscala des Datentransports
     * zum Bargraph fuer Debugging
     * @param bar Zeiger auf ein LedBar Objekt
     * @param scl Faktor zur Multiplikation des Zeitrahmens
     */
    //% block
    export function setTimeScale(bar: ledbar, scl: number = 1): ledbar {
        if (bar != null) bar.timescale = scl;
        return bar;
    }
    /**
     * Erzeugt ein neues LedBar Objekt mit den
     * Default Einstellungen
     */
    //% block
    export function getDefaultLedBar(dip: DigitalPin = DigitalPin.P3, clp: DigitalPin = DigitalPin.P0): ledbar {
        return new ledbar(seq01, dip, clp);
    }
    /**
     * Erzeugt ein neues LedBar Objekt mit den
     */
    //% block
    export function getLedBar(pat: Pattern, inp: DigitalPin = DigitalPin.P3, clp: DigitalPin = DigitalPin.P0): ledbar {
        if (pat == Pattern.Spot) return new ledbar(seq01, inp, clp);
        else if (pat == Pattern.Wave) return new ledbar(seq02, inp, clp);
        else if (pat == Pattern.Ramp) return new ledbar(seq03, inp, clp);
        else if (pat == Pattern.Block) return new ledbar(seq04, inp, clp);
        else if (pat == Pattern.Random) {
            let b: Array<number> = [];
            for (let i = 0; i < 20; i++) {
                let x = Math.random();
                serial.writeValue("x= ", x)
                b.push(254 * x);
            }
            return new ledbar(b, inp, clp);
        }
        else if (pat == Pattern.Candle) return new ledbar(seq05, inp, clp);
        else return null;
    }
}
