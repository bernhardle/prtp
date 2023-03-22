control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    if (!(autopulse)) {
        stoppulse()
    }
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_CLICK, function () {
    if (autopulse) {
        autopulse = false
        ledrelayoff = basic.rgb(0, 0, 0)
        stoppulse()
    } else {
        autopulse = true
        ledrelayoff = basic.rgb(0, 0, 32)
    }
})
function stoppulse () {
    if (0 != relaystate) {
        pulseoff = true
        relaystate = 0
        pins.digitalWritePin(DigitalPin.P0, relaystate)
        music.playTone(131, music.beat(BeatFraction.Eighth))
    }
    ledrelay = ledrelayoff
    basic.setLedColor(ledrelay)
}
function startpulse () {
    if (1 != relaystate) {
        pulseoff = false
        relaystate = 1
        pins.digitalWritePin(DigitalPin.P0, relaystate)
        music.playTone(988, music.beat(BeatFraction.Eighth))
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
    swirlcount += 1
    swirlcountlap += 1
    tmp = diverseTools.timeStamp()
    serial.writeValue("Time", tmp - timestamp)
    timestamp = tmp
    if (pulseoff) {
        pulseoff = false
        blinklatch = true
    }
})
let flowrate = 0
let tmp = 0
let relaystate = 0
let autopulse = false
let ledrelay = 0
let ledrelayoff = 0
let ledrelayon = 0
let blinklatch = false
let pulseoff = false
let timestamp = 0
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
timestamp = diverseTools.timeStamp()
// Variable is 'true' after relay has been switched to 'off' until next flow meter pulse is received.
pulseoff = false
blinklatch = false
ledrelayon = basic.rgb(0, 0, 164)
ledrelayoff = basic.rgb(0, 0, 0)
let ledflashfirst = basic.rgb(255, 255, 255)
ledrelay = ledrelayoff
autopulse = false
relaystate = 0
let swirlcount = 0
let swirlcountlap = 0
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
pins.digitalWritePin(DigitalPin.P0, relaystate)
led.setBrightness(128)
serial.writeLine("" + control.deviceName() + " initialized.")
basic.showString(control.deviceName(), 50)
loops.everyInterval(1000, function () {
    flowrate = Math.round(swirlcountlap * 37 / 49)
    serial.writeLine("" + diverseTools.timeStamp() + " " + convertToText(swirlcount) + " " + convertToText(flowrate) + " " + convertToText(pins.analogReadPin(AnalogPin.P1)) + " " + convertToText(pins.analogReadPin(AnalogPin.P2)) + " " + convertToText(input.soundLevel()) + " " + convertToText(relaystate))
    swirlcountlap = 0
    basic.showNumber(flowrate)
})
control.inBackground(function () {
    while (true) {
        if (autopulse) {
            startpulse()
            for (let index = 0; index < 15; index++) {
                if (autopulse) {
                    basic.pause(200)
                }
            }
        }
        if (autopulse) {
            stoppulse()
            for (let index = 0; index < 8; index++) {
                if (autopulse) {
                    basic.pause(200)
                }
            }
        }
        if (blinklatch) {
            basic.setLedColor(ledflashfirst)
            blinklatch = false
            basic.pause(40)
        }
        basic.setLedColor(ledrelay)
        basic.pause(80)
    }
})
