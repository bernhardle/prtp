control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    if (!(autopulse)) {
        music.playTone(131, music.beat(BeatFraction.Eighth))
        pins.digitalWritePin(DigitalPin.P0, 0)
        ledrelay = ledrelayoff
        pulseoff = true
    }
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    if (!(autopulse)) {
        music.playTone(988, music.beat(BeatFraction.Eighth))
        pins.digitalWritePin(DigitalPin.P0, 1)
        ledrelay = ledrelayon
        pulseoff = false
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
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (autopulse) {
        autopulse = false
        pulseoff = true
        pins.digitalWritePin(DigitalPin.P0, 0)
        ledrelayoff = basic.rgb(0, 0, 0)
        ledrelay = ledrelayoff
    } else {
        autopulse = true
        pulseoff = false
        ledrelayoff = basic.rgb(0, 32, 12)
        ledrelay = ledrelayon
    }
    basic.setLedColor(ledrelay)
})
let tmp = 0
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
ledrelayon = basic.rgb(0, 0, 128)
ledrelayoff = basic.rgb(0, 0, 0)
let ledflashfirst = basic.rgb(255, 255, 255)
ledrelay = ledrelayoff
autopulse = false
let swirlcount = 0
let swirlcountlap = 0
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
pins.digitalWritePin(DigitalPin.P0, 0)
led.setBrightness(128)
serial.writeLine("Initialized.")
basic.forever(function () {
    basic.pause(1000)
    basic.showNumber(Math.round(swirlcountlap * 37 / 49))
    serial.writeLine("" + convertToText(swirlcount) + " " + convertToText(swirlcountlap) + " " + convertToText(pins.analogReadPin(AnalogPin.P1)) + " " + convertToText(pins.analogReadPin(AnalogPin.P2)) + " " + convertToText(input.soundLevel()) + " " + convertToText(pins.digitalReadPin(DigitalPin.P0)))
    swirlcountlap = 0
})
control.inBackground(function () {
    while (true) {
        if (autopulse) {
            pins.digitalWritePin(DigitalPin.P0, 1)
            ledrelay = ledrelayon
            pulseoff = false
            basic.setLedColor(ledrelay)
            for (let index = 0; index < 25; index++) {
                if (autopulse) {
                    basic.pause(200)
                }
            }
            if (autopulse) {
                pins.digitalWritePin(DigitalPin.P0, 0)
                ledrelay = ledrelayoff
                pulseoff = true
                basic.setLedColor(ledrelay)
                for (let index = 0; index < 10; index++) {
                    if (autopulse) {
                        basic.pause(200)
                    }
                }
            }
        }
        if (blinklatch) {
            basic.setLedColor(ledflashfirst)
            blinklatch = false
            basic.pause(80)
        }
        basic.setLedColor(ledrelay)
        basic.pause(100)
    }
})
