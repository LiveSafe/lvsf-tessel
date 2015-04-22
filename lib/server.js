var ws = require('nodejs-websocket'),
    servolib = require('servo-pca9685'),
    tessel = require('tessel'),
    port = 8000,
    flag = false,
    position = 0.001,
    goTime = 'ding!',
    maxDings = 6, // 2 represents one full ding
    servo = servolib.use(tessel.port.A),
    servoNumber = 1, // Plug your servo or motor controller into port 1
    // Create the websocket server, provide connection callback
    server = ws.createServer(function(conn) {
        console.log('Accepted new connection...');
        // If get a binary stream is opened up
        conn.on('binary', function(stream) {
            // When we get data
            stream.on('data', function(data) {
                // Log the data
                console.log('Got data:', data.toString());
                var command = data.toString().trim(),
                    counter = 0,
                    intervalID;
                if (command === goTime) {
                    intervalID = setInterval(function() {
                        if (flag) {
                            position = 0.1;
                            flag = false;
                        } else {
                            position = 0.001;
                            flag = true;
                        }
                        servo.move(servoNumber, position);
                        counter++;
                        if (counter >= maxDings) {
                            clearInterval(intervalID);
                        }
                    }, 1000);
                }
            });
        });

        conn.on('close', function(code, reason) {
            console.log('Connection closed');
        });
    }).listen(port);

servo.on('ready', function() {
    // Start at a duty cycle of 10%
    var duty = 0.1;
    // Set the min and max duty cycle to 0% and 100%,
    // respectively to give you the maximum flexibility
    // and to eliminate math
    servo.configure(servoNumber, 0, 1, function() {
        // Move into the starting position
        servo.move(servoNumber, duty);
    });
});

console.log('Listening on port', port);
