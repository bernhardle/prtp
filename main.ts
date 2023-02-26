input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    pins.digitalWritePin(DigitalPin.P0, 1)
})
pins.onPulsed(DigitalPin.P3, PulseValue.Low, function () {
    counter += 1
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    pins.digitalWritePin(DigitalPin.P0, 0)
})
let counter = 0
pins.setPull(DigitalPin.P3, PinPullMode.PullUp)
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
basic.forever(function () {
    basic.pause(1000)
    basic.showNumber(counter)
    counter = 0
})
