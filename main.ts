OLED.init(128, 95);
tinkercademy.crashSensorSetup(DigitalPin.P8)
function sensorControl() {
    let display = "Hello, \
              I'm a Crash Sensor!!!";

    if (tinkercademy.crashSensor()) {
        display = "Crash Sensor Impact!!";
    }
    return display;
}

function radioSignal(screen_message: string): void {
    if (screen_message == "Crash Sensor Impact!!") {
        radio.sendString("HELP!!!");
    }
}

function recieveRadioSignal(message_recieved: string): boolean {
    let ret = false;
    if (message_recieved == null) {

    }
    return ret;
}

basic.forever(function () {
    OLED.clear();
    let screen_message = sensorControl();
    radioSignal(screen_message)
    OLED.writeStringNewLine(screen_message);
    basic.pause(2000);
    OLED.clear();
})