/*!
 * OLSKThrottle
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./main');

const kTest = {
	kDefaultDuration () {
		return 100;
	},
	uDefaultDurationForMultiple (inputData) {
		return kTest.kDefaultDuration() * inputData;
	},
	StubThrottleObjectValid () {
		const outputData = {
			OLSKThrottleCallback () {
				return outputData._OLSKTestingData.push(new Date());
			},
			OLSKThrottleDuration: kTest.kDefaultDuration(),
			_OLSKTestingData: [],
		};

		return outputData;
	},
};

describe('OLSKThrottleInputDataIsThrottleObject', function test_OLSKThrottleInputDataIsThrottleObject() {

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

describe('OLSKThrottleTimeoutFor', function test_OLSKThrottleTimeoutFor() {

	it('throws error if not valid', function() {
		assert.throws(function() {
			mainModule.OLSKThrottleTimeoutFor({});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns timeoutID', function() {
		assert.strictEqual(mainModule.OLSKThrottleTimeoutFor(kTest.StubThrottleObjectValid()).constructor.name, 'Timeout');
	});

	it('sets _OLSKThrottleTimeoutID to timeoutID', function() {
		const item = kTest.StubThrottleObjectValid();
		assert.deepEqual(mainModule.OLSKThrottleTimeoutFor(item), item._OLSKThrottleTimeoutID);
	});

	it('calls OLSKThrottleCallback at OLSKThrottleDuration', async function() {
		const item = kTest.StubThrottleObjectValid();

		mainModule.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(1.1));
		}));

		assert.strictEqual(item._OLSKTestingData.length, 1);
	});

	it('restarts timer if called again', async function() {
		const item = kTest.StubThrottleObjectValid();

		mainModule.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.5));
		}));

		mainModule.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.6));
		}));

		assert.strictEqual(item._OLSKTestingData.length, 0);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.7));
		}));

		assert.strictEqual(item._OLSKTestingData.length, 1);
	});

	it('can be stopped via clearInterval', async function() {
		const item = kTest.StubThrottleObjectValid();

		mainModule.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.5));
		}));

		clearInterval(item._OLSKThrottleTimeoutID);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.6));
		}));

		assert.strictEqual(item._OLSKTestingData.length, 0);
	});

});

describe('OLSKThrottleSkip', function test_OLSKThrottleSkip() {

	it('throws error if not valid', function() {
		assert.throws(function() {
			mainModule.OLSKThrottleSkip({});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns undefined', function() {
		assert.strictEqual(mainModule.OLSKThrottleSkip(kTest.StubThrottleObjectValid()), undefined);
	});

	it('calls OLSKThrottleCallback', async function() {
		const item = kTest.StubThrottleObjectValid();

		mainModule.OLSKThrottleTimeoutFor(item);
		mainModule.OLSKThrottleSkip(item);

		assert.strictEqual(item._OLSKTestingData.length, 1);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(1.1));
		}));

		assert.strictEqual(item._OLSKTestingData.length, 1);
	});

});

describe('OLSKThrottleMappedTimeoutFor', function test_OLSKThrottleMappedTimeoutFor() {

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mainModule.OLSKThrottleMappedTimeoutFor(null, '', function () {}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.OLSKThrottleMappedTimeoutFor({}, null, function () {}, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.OLSKThrottleMappedTimeoutFor({}, '', null, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param3 not defined', function() {
		assert.throws(function() {
			mainModule.OLSKThrottleMappedTimeoutFor({}, '', function () {}, undefined);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns output of OLSKThrottleTimeoutFor', function() {
		assert.strictEqual(mainModule.OLSKThrottleMappedTimeoutFor({}, '', function() { return kTest.StubThrottleObjectValid() }, null).constructor.name, 'Timeout');
	});

	context('param3', function () {

		it('passes param4', function() {
			mainModule.OLSKThrottleMappedTimeoutFor({}, '', function(inputData) {
				assert.strictEqual(inputData, 'alfa');
				return kTest.StubThrottleObjectValid();
			}, 'alfa');
		});
	
	});

});
