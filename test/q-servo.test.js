'use strict';

var _ = require('ls-lodash'),
    expect = require('./test-helper').expect,
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

describe('q-servo', function() {
    function makeTestContext() {
        var mockTessel = { port: { A: 'A' } },
            mockServoInstance = {
                on: sinon.stub(),
                configure: sinon.stub().callsArg(3),
                move: sinon.stub().callsArg(2),
                read: sinon.stub().callsArg(1),
                setDutyCycle: sinon.stub().callsArg(2)
            },
            mockServo = {
                use: sinon.stub().returns(mockServoInstance)
            },
            qServo = proxyquire('../lib/util/q-servo', {
                tessel: mockTessel,
                'servo-pca9685': mockServo
            });

        mockServoInstance.on.onCall(0).callsArg(1).returns();

        return {
            qServo: qServo,
            mockServoInstance: mockServoInstance,
            mockTessel: mockTessel,
            mockServo: mockServo
        };
    }

    it('returns a promise for an array', function() {
        var context = makeTestContext();

        return expect(context.qServo('A')).to.eventually.be.instanceOf(Array);
    });

    it('sets up the correct port', function() {
        var context = makeTestContext();

        return context.qServo('A').then(function() {
            return expect(context.mockServo.use).to.have.been.calledWith('A');
        });
    });

    describe('binds and promise wraps', function() {
        it('configure', function() {
            var context = makeTestContext();

            return context.qServo('A').then(function(servos) {
                return servos[1].configure(0.01, 0.1).then(function() {
                    return expect(context.mockServoInstance.configure)
                        .to.have.been.calledWith(1, 0.01, 0.1);
                });
            });
        });

        it('move', function() {
            var context = makeTestContext();

            return context.qServo('A').then(function(servos) {
                return servos[1].move(0.01).then(function() {
                    return expect(context.mockServoInstance.move)
                        .to.have.been.calledWith(1, 0.01);
                });
            });
        });

        it('read', function() {
            var context = makeTestContext();

            return context.qServo('A').then(function(servos) {
                return servos[1].read().then(function() {
                    return expect(context.mockServoInstance.read)
                        .to.have.been.calledWith(1);
                });
            });
        });

        it('setDutyCycle', function() {
            var context = makeTestContext();

            return context.qServo('A').then(function(servos) {
                return servos[1].setDutyCycle(0.01).then(function() {
                    return expect(context.mockServoInstance.setDutyCycle)
                        .to.have.been.calledWith(1, 0.01);
                });
            });
        });
    });
});
