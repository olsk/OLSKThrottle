/*!
 * OLSKThrottle
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./main');

const kTest = {
	kDefaultDuration: function () {
		return 100;
	},
	uDefaultDurationForMultiple: function(inputData) {
		return kTest.kDefaultDuration() * inputData;
	},
	StubThrottleObjectValid: function() {
		let outputData = {
			OLSKThrottleCallback: function() {
				return outputData._OLSKTestingData.push(new Date());
			},
			OLSKThrottleDuration: kTest.kDefaultDuration(),
			_OLSKTestingData: [],
		};

		return outputData;
	},
};

describe('OLSKThrottleInputDataIsThrottleObject', function testOLSKThrottleInputDataIsThrottleObject() {

	it('returns false if not object', function() {
		assert.strictEqual(mainModule.OLSKThrottleInputDataIsThrottleObject(null), false);
	});

	it('returns false if OLSKThrottleCallback not function', function() {
		assert.strictEqual(mainModule.OLSKThrottleInputDataIsThrottleObject(Object.assign(kTest.StubThrottleObjectValid(), {
			OLSKThrottleCallback: true,
		})), false);
	});

	it('returns false if OLSKThrottleDuration not number', function() {
		assert.strictEqual(mainModule.OLSKThrottleInputDataIsThrottleObject(Object.assign(kTest.StubThrottleObjectValid(), {
			OLSKThrottleDuration: '1',
		})), false);
	});

	it('returns true', function() {
		assert.strictEqual(mainModule.OLSKThrottleInputDataIsThrottleObject(kTest.StubThrottleObjectValid()), true);
	});

});

describe('OLSKThrottleTimeoutFor', function testOLSKThrottleTimeoutFor() {

	it('throws error if not valid', function() {
		assert.throws(function() {
			mainModule.OLSKThrottleTimeoutFor({});
		}, /OLSKErrorInputInvalid/);
	});

	it('returns timeoutID', function() {
		assert.strictEqual(mainModule.OLSKThrottleTimeoutFor(kTest.StubThrottleObjectValid()).constructor.name, 'Timeout');
	});

	it('sets _OLSKThrottleTimeoutID to timeoutID', function() {
		let item = kTest.StubThrottleObjectValid();
		assert.deepEqual(mainModule.OLSKThrottleTimeoutFor(item), item._OLSKThrottleTimeoutID);
	});

	it('calls OLSKThrottleCallback at OLSKThrottleDuration', function(done) {
		let item = kTest.StubThrottleObjectValid();

		mainModule.OLSKThrottleTimeoutFor(item);

		setTimeout(function() {
			assert.strictEqual(item._OLSKTestingData.length, 1);

			done();
		}, kTest.uDefaultDurationForMultiple(1.1));
	});

	it('restarts timer if called again be stopped via clearInterval', function(done) {
		let item = kTest.StubThrottleObjectValid();

		mainModule.OLSKThrottleTimeoutFor(item);

		setTimeout(function() {
			mainModule.OLSKThrottleTimeoutFor(item);

			setTimeout(function() {
				assert.strictEqual(item._OLSKTestingData.length, 0);

				setTimeout(function() {
					assert.strictEqual(item._OLSKTestingData.length, 1);

					done();
				}, kTest.uDefaultDurationForMultiple(0.7))
			}, kTest.uDefaultDurationForMultiple(0.6));
		}, kTest.uDefaultDurationForMultiple(0.5));
	});

	it('can be stopped via clearInterval', function(done) {
		let item = kTest.StubThrottleObjectValid();

		mainModule.OLSKThrottleTimeoutFor(item);

		setTimeout(function() {
			clearInterval(item._OLSKThrottleTimeoutID);

			setTimeout(function() {
				assert.strictEqual(item._OLSKTestingData.length, 0);

				done();
			}, kTest.uDefaultDurationForMultiple(0.6));
		}, kTest.uDefaultDurationForMultiple(0.5));
	});

});
