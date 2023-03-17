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
let blinklatch = false
let pulseoff = false
let timestamp = 0
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
let relaystate = false
timestamp = diverseTools.timeStamp()
pulseoff = false
blinklatch = false
let ledrelayon = basic.rgb(0, 0, 255)
let ledrelayoff = basic.rgb(0, 0, 0)
let ledflashfirst = basic.rgb(255, 255, 255)
let ledrelay = ledrelayoff
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
pins.digitalWritePin(DigitalPin.P0, 0)
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
        if (input.buttonIsPressed(Button.A)) {
            if (!(relaystate)) {
                music.playTone(988, music.beat(BeatFraction.Eighth))
                pins.digitalWritePin(DigitalPin.P0, 1)
                relaystate = true
                ledrelay = ledrelayon
                pulseoff = false
            }
        } else {
            if (relaystate) {
                music.playTone(131, music.beat(BeatFraction.Eighth))
                pins.digitalWritePin(DigitalPin.P0, 0)
                relaystate = false
                ledrelay = ledrelayoff
                pulseoff = true
            }
        }
        if (blinklatch) {
            blinklatch = false
            basic.setLedColor(ledflashfirst)
        }
        basic.pause(20)
        basic.setLedColor(ledrelay)
        basic.pause(80)
    }
})
