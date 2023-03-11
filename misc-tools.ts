/**
 * Nutze diese Datei fuer benutzerdefinierte Funktionen und Bloecke.
 * Weitere Informationen unter https://makecode.calliope.cc/blocks/custom
 */
/**
 * Benutzerdefinierte Bloecke
 */
//% weight=80 color=#DF4600 icon="\uf6e3"
//% advanced=true
namespace diverseTools {
    /**
    * TODO: Zeit in Millisekunden seit Boot
    */
    //% block
    export function timeStamp(): number {
        return input.runningTime();
    }
}
//% weight=100 color=#8169E6 icon="\uf080"
//% advanced=true
namespace squareDisplay {
    //
    function plotBarGraph(value: number, high: number): void {
        let v = (value * 15) / high;
        let k = 0;
        for (let y = 4; y >= 0; --y) {
            for (let x = 0; x < 3; ++x) {
                if (k > v) {
                    led.unplot(2 - x, y);
                    led.unplot(2 + x, y);
                } else {
                    led.plot(2 - x, y);
                    led.plot(2 + x, y);
                }
                ++k;
            }
        }
    }
    /**
    * Displays a vertical bar graph based on the `value` and `high` value.
    * If `high` is 0, the chart gets adjusted automatically.
    * @param value current value to plot
    * @param high maximum value
    */
    //% block
    export function barGraph(value: number, high: number): void {
        //
        plotBarGraph(Math.abs(value), Math.max(high, 16));
    }
    /**
     * Displays a vertical bar graph based on the `valone`, `valtwo` and `high` value.
     * 
     * @param valone first value to plot
     * @param valtwo second value to plot
     * @param high maximum value
     * @param rate time slice [ms] default is 50
     */
    //% block
    export function barGraphInterlaced(valone: number, valtwo: number, high: number, rate: number = 50): void {
        //
        control.inBackground(() => {
            while (true) {
                plotBarGraph(Math.abs(valone), Math.max(high, 16));
                basic.pause(50);
                plotBarGraph(Math.abs(valtwo), Math.max(high, 16));
                basic.pause(50);
            }
        })
    }
}

