const START_DISPLAY = "Hello, \
              I'm a Crash Sensor!!!";
screenDisplay(START_DISPLAY);
tinkercademy.crashSensorSetup(DigitalPin.P8);

/**
 * Function that controls the message that the OLED is displaying.
 * Default is set to the START_MESSAGE constant.
 * If the message changes the screen is cleared before displaying the message.
 * Parameters: String message
 */
function screenDisplay(display: string): void {
    OLED.init(128, 95);
    if (display != START_DISPLAY) {
        OLED.clear();
    }
    OLED.writeString(display);
}

/**
 * 
 */
function sensorControl(): string {
    let display = START_DISPLAY;
    if (tinkercademy.crashSensor()) {
        display = "Crash Sensor Impact!!"
        sendRadioSignal(true);
    }
    return display
}

function sendRadioSignal(signal: boolean): void {
    if (signal) {
        radio.sendString("HELP!!!");
    }
    return
}

function recieveRadioSignal(): boolean {
    let ret = false
    radio.onReceivedString(function (receivedString: string) {
        ret = true
        screenDisplay(receivedString);
    })
    return ret
}

basic.forever(function () {
    // initialize the sensorControl
    let screen_message = sensorControl();
    screenDisplay(screen_message);

    if (screen_message == "Crash Sensor Impact!!") {
        let message_recieved = false;
        while (message_recieved == false) {
            message_recieved = recieveRadioSignal();

            basic.pause(100)
            sendRadioSignal(!message_recieved)
        }
    }
    
    input.onButtonPressed(Button.AB, function () {
        screenDisplay(START_DISPLAY);
    })
})