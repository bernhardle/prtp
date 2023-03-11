input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    pins.digitalWritePin(DigitalPin.P0, 1)
    basic.setLedColor(0x0000ff)
})
pins.onPulsed(DigitalPin.P3, PulseValue.Low, function () {
    counter += 1
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    pins.digitalWritePin(DigitalPin.P0, 0)
    basic.setLedColor(0x000000)
})
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
let counter = 0
pins.setPull(DigitalPin.P3, PinPullMode.PullUp)
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
serial.writeLine("Initialized.")
basic.forever(function () {
    basic.pause(1000)
    basic.showNumber(counter)
    serial.writeValue("counts", counter)
    serial.writeValue("P1", pins.analogReadPin(AnalogPin.P1))
    serial.writeValue("P2", pins.analogReadPin(AnalogPin.P2))
    counter = 0
})
