'use strict';

var q = require('q'),
    _ = require('ls-lodash'),
    tessel = require('tessel'),
    servolib = require('servo-pca9685');

/*
 *  port: 'A', 'B', 'C', 'D' (required)
 *  opts:
 *      moduleFrequency: PWM frequency in Hz
 *      servoDutyOverrides: Object
 *          <pinNum>: {
 *              minDutyCycle: <float>,
 *              maxDutyCycle: <float>
 *          }
 *
 *
 */
module.exports = _.memoize(function qServo(tesselPort, opts) {
    var deferred = q.defer(),
        servoObj = servolib.use(tessel.port[tesselPort]);

    function createServoWrapper(pinNum) {
        var servoInstance = {
                configure: _.seal(q.nbind(servoObj.configure, servoObj), [pinNum], 2),
                move: _.seal(q.nbind(servoObj.move, servoObj), [pinNum], 1),
                read: _.seal(q.nbind(servoObj.read, servoObj), [pinNum], 0),
                setDutyCycle: _.seal(q.nbind(servoObj.setDutyCycle, servoObj), [pinNum], 1)
            };

        return servoInstance.configure(0.05, 0.12).then(_.constant(servoInstance));
    }

    servoObj.on('ready', function() {
        try {
            if (_.isObject(opts) && opts.moduleFrequency) {
                servoObj.setModuleFrequency(opts.moduleFrequency, function(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(q.all(_.map(_.range(1, 16), createServoWrapper)));
                    }
                });
            } else {
                deferred.resolve(q.all(_.map(_.range(1, 16), createServoWrapper)));
            }
        } catch (err) {
            deferred.reject(err);
        }
    });

    servoObj.on('error', deferred.reject);

    return deferred.promise;
});
