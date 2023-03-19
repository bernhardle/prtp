control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    music.playTone(131, music.beat(BeatFraction.Eighth))
    pins.digitalWritePin(DigitalPin.P0, 0)
    relaystate = false
    ledrelay = ledrelayoff
    pulseoff = true
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    music.playTone(988, music.beat(BeatFraction.Eighth))
    pins.digitalWritePin(DigitalPin.P0, 1)
    relaystate = true
    ledrelay = ledrelayon
    pulseoff = false
})
pins.onPulsed(DigitalPin.P3, PulseValue.High, function () {
    pulsecounter += 1
    tmp = diverseTools.timeStamp()
    serial.writeValue("Time", tmp - timestamp)
    timestamp = tmp
    if (pulseoff) {
        pulseoff = false
        blinklatch = true
    }
})
let tmp = 0
let pulsecounter = 0
let ledrelay = 0
let ledrelayoff = 0
let ledrelayon = 0
let blinklatch = false
let pulseoff = false
let timestamp = 0
let relaystate = false
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
// Variable reflects status of relay.
relaystate = false
timestamp = diverseTools.timeStamp()
// Variable is 'true' after relay has been switched to 'off' until next flow meter pulse is received.
pulseoff = false
blinklatch = false
ledrelayon = basic.rgb(0, 0, 128)
ledrelayoff = basic.rgb(0, 0, 0)
let ledflashfirst = basic.rgb(255, 255, 255)
ledrelay = ledrelayoff
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
pins.digitalWritePin(DigitalPin.P0, 0)
led.setBrightness(128)
serial.writeLine("Initialized.")
basic.forever(function () {
    basic.pause(1000)
    basic.showNumber(Math.round(pulsecounter * 37 / 49))
    serial.writeValue("counts", pulsecounter)
    serial.writeValue("P1", pins.analogReadPin(AnalogPin.P1))
    serial.writeValue("P2", pins.analogReadPin(AnalogPin.P2))
    pulsecounter = 0
})
control.inBackground(function () {
    while (true) {
        if (blinklatch) {
            blinklatch = false
            basic.setLedColor(ledflashfirst)
        }
        basic.pause(20)
        basic.setLedColor(ledrelay)
        basic.pause(80)
    }
})
