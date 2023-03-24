control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    if (!(autopulse)) {
        stoppulse()
    }
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_CLICK, function () {
    toggleautopulse()
})
function stoppulse () {
    if (0 != relaystate) {
        swirlstartafterpulse = true
        relaystate = 0
        pins.digitalWritePin(DigitalPin.P0, relaystate)
        music.playTone(131, music.beat(BeatFraction.Sixteenth))
    }
    ledrelay = ledrelayoff
    basic.setLedColor(ledrelay)
}
function ledflash (rgb: number) {
    basic.setLedColor(rgb)
    basic.pause(5)
    basic.setLedColor(ledrelay)
}
function startpulse () {
    if (1 != relaystate) {
        swirlstartafterpulse = false
        relaystate = 1
        pins.digitalWritePin(DigitalPin.P0, relaystate)
        music.playTone(988, music.beat(BeatFraction.Sixteenth))
    }
    ledrelay = ledrelayon
    basic.setLedColor(ledrelay)
}
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    if (!(autopulse)) {
        startpulse()
    }
})
pins.onPulsed(DigitalPin.P3, PulseValue.High, function () {
    tmp = diverseTools.timeStamp()
    swirlcount += 1
    swirlcountlap += 1
    squareDisplay.barGraph(1000 / (1 + (tmp - timestamp)), 30)
    timestamp = tmp
    if (swirlstartafterpulse) {
        swirlstartafterpulse = false
        control.raiseEvent(
        EventBusSource.MICROBIT_ID_IO_P1,
        EventBusValue.MICROBIT_PIN_EVT_RISE
        )
    }
})
control.onEvent(EventBusSource.MICROBIT_ID_IO_P1, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
    ledflash(ledflashfirst)
})
function toggleautopulse () {
    if (autopulse) {
        autopulse = false
        ledrelayoff = basic.rgb(0, 0, 0)
        stoppulse()
    } else {
        autopulse = true
        ledrelayoff = basic.rgb(0, 0, 32)
    }
}
let tmp = 0
let relaystate = 0
let autopulse = false
let ledrelay = 0
let ledflashfirst = 0
let ledrelayoff = 0
let ledrelayon = 0
let swirlstartafterpulse = false
let timestamp = 0
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
timestamp = diverseTools.timeStamp()
// Variable is 'true' after relay has been switched to 'off' until next flow meter pulse is received.
swirlstartafterpulse = false
let blinklatch = false
let flowrate = 0
let flowratepast = 0
ledrelayon = basic.rgb(0, 0, 164)
ledrelayoff = basic.rgb(0, 0, 0)
ledflashfirst = basic.rgb(255, 255, 255)
ledrelay = ledrelayoff
autopulse = false
relaystate = 0
let pulseofftime = 8
let pulseontime = 15
let swirlcount = 0
let swirlcountlap = 0
let swirlcountbargraphreset = 0
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
pins.digitalWritePin(DigitalPin.P0, relaystate)
led.setBrightness(128)
serial.writeLine("" + control.deviceName() + " initialized.")
basic.showString(control.deviceName(), 50)
control.inBackground(function () {
    while (true) {
        if (autopulse) {
            startpulse()
        }
        for (let index = 0; index < pulseontime; index++) {
            if (autopulse) {
                basic.pause(200)
            }
        }
        if (autopulse) {
            stoppulse()
        }
        for (let index = 0; index < pulseofftime; index++) {
            if (autopulse) {
                basic.pause(200)
            }
        }
        if (!(autopulse)) {
            basic.pause(200)
        }
    }
})
loops.everyInterval(200, function () {
    flowratepast = flowrate
    flowrate = 0.1 * Math.round(swirlcountlap * 370 / 49)
    swirlcountlap = 0
    serial.writeLine("" + convertToText(swirlcount) + " " + convertToText(flowrate) + " " + convertToText(pins.analogReadPin(AnalogPin.P1)) + " " + convertToText(pins.analogReadPin(AnalogPin.P2)) + " " + convertToText(input.soundLevel()) + " " + convertToText(relaystate))
    if (800 < diverseTools.timeStamp() - timestamp) {
        squareDisplay.barGraph(0, 10000)
    }
})
