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
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    if (!(autopulse)) {
        startpulse()
    }
})
function ledflash (rgb: number) {
    basic.setLedColor(rgb)
    basic.pause(5)
    basic.setLedColor(ledrelay)
}
pins.onPulsed(DigitalPin.P3, PulseValue.High, function () {
    tmpintvalue = diverseTools.timeStamp()
    swirlcount += 1
    swirlcountlap += 1
    squareDisplay.barGraph(755 / (1 + (tmpintvalue - timestamp)), bargraphmax)
    timestamp = tmpintvalue
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
serial.onDataReceived(serial.delimiters(Delimiters.CarriageReturn), function () {
    ledflash(basic.rgb(255, 255, 255))
    serialreceived = serial.readString()
    if (serialreceived.includes("=")) {
        tmptextarray = serialreceived.split("=")
        if (0 == "log".compare(tmptextarray[0])) {
            tmpintvalue = Math.constrain(parseFloat(tmptextarray[1]), 0, 20)
            seriallog = tmpintvalue
            storage.putNumber(StorageSlots.s2, tmpintvalue)
            serial.writeValue("log", seriallog)
        } else if (0 == "on".compare(tmptextarray[0])) {
            tmpintvalue = Math.constrain(parseFloat(tmptextarray[1]), 3, 50)
            pulseontime = tmpintvalue
            storage.putNumber(StorageSlots.s3, pulseontime)
            serial.writeValue("on", pulseontime)
        } else if (0 == "off".compare(tmptextarray[0])) {
            tmpintvalue = Math.constrain(parseFloat(tmptextarray[1]), 3, 50)
            pulseofftime = tmpintvalue
            storage.putNumber(StorageSlots.s4, pulseofftime)
            serial.writeValue("off", pulseofftime)
        } else if (0 == "max".compare(tmptextarray[0])) {
            tmpintvalue = Math.constrain(parseFloat(tmptextarray[1]), 20, 100)
            bargraphmax = tmpintvalue
            storage.putNumber(StorageSlots.s5, bargraphmax)
            serial.writeValue("max", bargraphmax)
        }
    }
})
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
let bargraphresetswirlcount = 0
let flowrate = 0
let serialturn = 0
let tmptextarray: string[] = []
let serialreceived = ""
let swirlcountlap = 0
let swirlcount = 0
let tmpintvalue = 0
let swirlstartafterpulse = false
let seriallog = 0
let pulseontime = 0
let pulseofftime = 0
let relaystate = 0
let autopulse = false
let ledrelay = 0
let ledflashfirst = 0
let ledrelayoff = 0
let ledrelayon = 0
let bargraphmax = 0
let timestamp = 0
let blinklatch = false
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
timestamp = diverseTools.timeStamp()
bargraphmax = 30
ledrelayon = basic.rgb(0, 0, 164)
ledrelayoff = basic.rgb(0, 0, 0)
ledflashfirst = basic.rgb(0, 255, 0)
let ledflashlast = basic.rgb(255, 0, 0)
ledrelay = ledrelayoff
autopulse = false
relaystate = 0
pulseofftime = 8
pulseontime = 15
seriallog = 0
// Variable is 'true' after relay has been switched to 'off' until next flow meter pulse is received.
swirlstartafterpulse = false
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
pins.setPull(DigitalPin.P3, PinPullMode.PullNone)
pins.digitalWritePin(DigitalPin.P0, relaystate)
led.setBrightness(255)
serial.writeLine(control.deviceName())
basic.showString(control.deviceName(), 50)
if (1 == storage.getNumber(StorageSlots.s1)) {
    tmpintvalue = storage.getNumber(StorageSlots.s2)
    if (seriallog != tmpintvalue) {
        seriallog = tmpintvalue
        serial.writeValue("log", seriallog)
        basic.showString("log:" + convertToText(seriallog))
    }
    tmpintvalue = storage.getNumber(StorageSlots.s3)
    if (pulseontime != tmpintvalue) {
        pulseontime = tmpintvalue
        serial.writeValue("on", pulseontime)
        basic.showString("on:" + convertToText(pulseontime))
    }
    tmpintvalue = storage.getNumber(StorageSlots.s4)
    if (pulseofftime != tmpintvalue) {
        pulseofftime = tmpintvalue
        serial.writeValue("off", pulseofftime)
        basic.showString("off:" + convertToText(pulseofftime))
    }
    tmpintvalue = storage.getNumber(StorageSlots.s5)
    if (bargraphmax != tmpintvalue) {
        bargraphmax = tmpintvalue
        serial.writeValue("max", bargraphmax)
        basic.showString("max:" + convertToText(bargraphmax))
    }
} else {
    storage.putNumber(StorageSlots.s1, 1)
    storage.putNumber(StorageSlots.s2, seriallog)
    storage.putNumber(StorageSlots.s3, pulseontime)
    storage.putNumber(StorageSlots.s4, pulseofftime)
    storage.putNumber(StorageSlots.s5, bargraphmax)
}
led.setBrightness(90)
squareDisplay.barGraph(0, bargraphmax)
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
loops.everyInterval(100, function () {
    if (0 == serialturn % 10) {
        flowrate = Math.round(swirlcountlap * 3700 / 49)
        swirlcountlap = 0
    }
    if (0 < seriallog && 0 == serialturn % seriallog) {
        serial.writeLine("" + convertToText(swirlcount) + " " + convertToText(flowrate) + " " + convertToText(pins.analogReadPin(AnalogPin.C5)) + " " + convertToText(pins.analogReadPin(AnalogPin.P2)) + " " + convertToText(input.soundLevel()) + " " + convertToText(relaystate))
    }
    if (bargraphresetswirlcount < swirlcount && 800 < diverseTools.timeStamp() - timestamp) {
        squareDisplay.barGraph(0, bargraphmax)
        bargraphresetswirlcount = swirlcount
        if (1 == relaystate) {
            ledflash(ledflashlast)
        }
    }
    serialturn += 1
})
