const START_DISPLAY = "Hello, \
              I'm a Crash Sensor!!!";
const CRASH_DISPLAY = "Crash Sensor Impact!!";
OLED.init(128, 95);
radio.setGroup(1);

screenDisplay(null, START_DISPLAY);
tinkercademy.crashSensorSetup(DigitalPin.P8);

/**
 * Function that controls the message that the OLED is displaying.
 * Parameters: message (string)
 * Default is set to the START_MESSAGE constant.
 * If the message changes the screen is cleared before displaying the message.
 * void function 
 */
function screenDisplay(default_display = START_DISPLAY, current_display: string): void {
    if (current_display == default_display) {
        OLED.writeString(current_display);
    }
    else {
        if (default_display == START_DISPLAY) {
            return;
        }
        else {
            OLED.clear();
            OLED.writeString(current_display);
        }
    }
}

/**
 * Function that controls the crash sensor
 * returns true: if the crash sensor is hit the display changes showing that there was some impact and the function
 * default: return false
 */
function sensorControl(): boolean {
    let ret = false
    if (tinkercademy.crashSensor()) {
        screenDisplay(null, CRASH_DISPLAY);
        ret = sendRadioSignal(true);
    }
    return ret
}

/**
 * Function that sends radio signal if the crash sensor is invoked
 * parameter: signal (boolean)
 * return true: if a message is successfully sent
 * default: return false
 */
function sendRadioSignal(signal: boolean): boolean {
    let ret = false;
    if (signal) {
        radio.sendString("HELP!!!");
        let display = CRASH_DISPLAY + "\Calling for Help!!"
        screenDisplay(CRASH_DISPLAY, display)
        ret = true;
    }
    return ret;
}

/**
 * Function that listens for a radio signal from another microbit on the same channel
 * parametrs: the current OLED display status (string)
 * return true: if a message is successfully recieved
 * default: return false
 */
function recieveRadioSignal(current_status: string): boolean {
    let ret = false;
    radio.onReceivedString(function (receivedString: string) {
        if (receivedString != null) {
            screenDisplay(current_status, "On our way!!!");
            ret = true;
        }
        else {
            screenDisplay(current_status, "Calling for Help!!");
        }
    })
    return ret;
}

basic.forever(function () {
    // initialize the sensorControl
    let sensor_control = sensorControl();

    // initialize the radio recieve
    let message_recieved = recieveRadioSignal(CRASH_DISPLAY)

    if (message_recieved == false && sensor_control == true) {
        sendRadioSignal(true);
    }

    input.onButtonPressed(Button.AB, function () {
        screenDisplay(null, START_DISPLAY);
    })
})