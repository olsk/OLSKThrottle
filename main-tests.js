const { throws, deepEqual } = require('assert');

const mod = require('./main.js');

const kTest = {
	kDefaultDuration () {
		return 100;
	},
	uDefaultDurationForMultiple (inputData) {
		return kTest.kDefaultDuration() * inputData;
	},
	StubThrottleObjectValid (inputData = {}) {
		const outputData = {
			OLSKThrottleCallback () {
				return outputData._OLSKTestingData.push(new Date());
			},
			OLSKThrottleDuration: kTest.kDefaultDuration(),
			_OLSKTestingData: [],
		};

		return Object.assign(outputData, inputData);
	},
};

describe('OLSKThrottleIsValid', function test_OLSKThrottleIsValid() {

	it('returns false if not object', function() {
		deepEqual(mod.OLSKThrottleIsValid(null), false);
	});

	it('returns false if OLSKThrottleCallback not function', function() {
		deepEqual(mod.OLSKThrottleIsValid(Object.assign(kTest.StubThrottleObjectValid(), {
			OLSKThrottleCallback: true,
		})), false);
	});

	it('returns false if OLSKThrottleDuration not number', function() {
		deepEqual(mod.OLSKThrottleIsValid(Object.assign(kTest.StubThrottleObjectValid(), {
			OLSKThrottleDuration: '1',
		})), false);
	});

	it('returns true', function() {
		deepEqual(mod.OLSKThrottleIsValid(kTest.StubThrottleObjectValid()), true);
	});

});

describe('OLSKThrottleTimeoutFor', function test_OLSKThrottleTimeoutFor() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.OLSKThrottleTimeoutFor({});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns timeoutID', function() {
		deepEqual(mod.OLSKThrottleTimeoutFor(kTest.StubThrottleObjectValid()).constructor.name, 'Timeout');
	});

	it('sets _OLSKThrottleTimeoutID to timeoutID', function() {
		const item = kTest.StubThrottleObjectValid();
		deepEqual(mod.OLSKThrottleTimeoutFor(item), item._OLSKThrottleTimeoutID);
	});

	it('calls OLSKThrottleCallback at OLSKThrottleDuration', async function() {
		const item = kTest.StubThrottleObjectValid();

		mod.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(1.1));
		}));

		deepEqual(item._OLSKTestingData.length, 1);
	});

	it('restarts timer if called again', async function() {
		const item = kTest.StubThrottleObjectValid();

		mod.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.5));
		}));

		mod.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.6));
		}));

		deepEqual(item._OLSKTestingData.length, 0);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.7));
		}));

		deepEqual(item._OLSKTestingData.length, 1);
	});

	it('can be stopped via clearInterval', async function() {
		const item = kTest.StubThrottleObjectValid();

		mod.OLSKThrottleTimeoutFor(item);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.5));
		}));

		clearInterval(item._OLSKThrottleTimeoutID);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(0.6));
		}));

		deepEqual(item._OLSKTestingData.length, 0);
	});

	it('clears _OLSKThrottleTimeoutID after OLSKThrottleDuration', async function() {
		const item = kTest.StubThrottleObjectValid();

		mod.OLSKThrottleTimeoutFor(item)

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(1.1));
		}));

		deepEqual(item._OLSKThrottleTimeoutID, undefined);
	});

});

describe('OLSKThrottleSkip', function test_OLSKThrottleSkip() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.OLSKThrottleSkip({});
		}, /OLSKErrorInputNotValid/);
	});

	it('calls OLSKThrottleCallback', async function() {
		const item = kTest.StubThrottleObjectValid();

		mod.OLSKThrottleTimeoutFor(item);
		mod.OLSKThrottleSkip(item);

		deepEqual(item._OLSKTestingData.length, 1);

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(1.1));
		}));

		deepEqual(item._OLSKTestingData.length, 1);
	});

	it('returns OLSKThrottleCallback', function() {
		const item = Math.random().toString();
		deepEqual(mod.OLSKThrottleSkip(kTest.StubThrottleObjectValid({
			OLSKThrottleCallback () {
				return item;
			},
		})), item);
	});

});

describe('OLSKThrottleMappedTimeout', function test_OLSKThrottleMappedTimeout() {

	it('throws error if param1 not object', function() {
		throws(function() {
			mod.OLSKThrottleMappedTimeout(null, '', kTest.StubThrottleObjectValid());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mod.OLSKThrottleMappedTimeout({}, null, kTest.StubThrottleObjectValid());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param3 not valid', function() {
		throws(function() {
			mod.OLSKThrottleMappedTimeout({}, '', {});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns output of OLSKThrottleTimeoutFor', function() {
		const item = kTest.StubThrottleObjectValid();
		deepEqual(mod.OLSKThrottleMappedTimeout({}, '', item), item._OLSKThrottleTimeoutID);
	});

	it('uses entry if exists', function() {
		const item = kTest.StubThrottleObjectValid();
		const map = {
			alfa: item,
		};

		mod.OLSKThrottleMappedTimeout(map, 'alfa', kTest.StubThrottleObjectValid());
		deepEqual(map.alfa, item);
	});

	it('clears entry after OLSKThrottleDuration', async function() {
		const map = {};
		const item = kTest.StubThrottleObjectValid();

		mod.OLSKThrottleMappedTimeout(map, 'alfa', item);
		deepEqual(typeof map.alfa, 'object');

		await (new Promise(function (res, rej) {
			return setTimeout(res, kTest.uDefaultDurationForMultiple(1.1));
		}));

		deepEqual(map.alfa, undefined);
	});

});
