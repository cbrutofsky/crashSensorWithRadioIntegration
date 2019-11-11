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
    else if (default_display != current_display) {
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
        sendRadioSignal(true);
        ret = true;
    }
    return ret
}

function sendRadioSignal(signal: boolean): void {
    if (signal) {
        radio.sendString("HELP!!!");
    }
}

function recieveRadioSignal(current_status: string): boolean {
    let ret = false;
    radio.onReceivedString(function (receivedString: string) {
        ret = true;
        screenDisplay(current_status, receivedString);
    })
    return ret;
}

basic.forever(function () {
    // initialize the sensorControl
    let sensor_control = sensorControl();
    let message_recieved = false;
    if (sensor_control) {
        while (message_recieved == false) {
            if (recieveRadioSignal(CRASH_DISPLAY)){
                break;
            }
            else
            {
                basic.pause(100);
                sendRadioSignal(!message_recieved);
            }  
        }
    }

    input.onButtonPressed(Button.AB, function () {
        screenDisplay(null, START_DISPLAY);
    })
})