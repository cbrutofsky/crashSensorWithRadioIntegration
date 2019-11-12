const START_DISPLAY = "Hello, \
              I'm a Crash Sensor!!!";
const CRASH_DISPLAY = "Crash Sensor Impact!!";
OLED.init(128, 95);
radio.setGroup(1);

screenDisplay(null, START_DISPLAY);
tinkercademy.crashSensorSetup(DigitalPin.P8);

/**
 * Function that controls the message that the OLED is displaying.
 * Default is set to the START_MESSAGE constant.
 * If the message changes the screen is cleared before displaying the message.
 * Parameters: String message
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
 * 
 */
function sensorControl(): boolean {
    let ret = false
    if (tinkercademy.crashSensor()) {
        screenDisplay(null, CRASH_DISPLAY);
        ret = sendRadioSignal(true);
    }
    return ret
}

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
    //let message_recieved = false;
    let message_recieved = recieveRadioSignal(CRASH_DISPLAY)

    if (message_recieved == false && sensor_control == true) {
        sendRadioSignal(true);
    }
    // if (sensor_control == true) {
    //     if (message_recieved == false) {
    //         basic.pause(1000)
    //         sendRadioSignal(false)
    //     }
    //     else {
    //         sensor_control = false;
    //     }
    // }

    input.onButtonPressed(Button.AB, function () {
        screenDisplay(null, START_DISPLAY);
    })
})