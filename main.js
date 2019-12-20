(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(factory((global.OLSKThrottle = global.OLSKThrottle || {})));
}(this, (function(exports) {
	'use strict';

	const mod = {

		OLSKThrottleInputDataIsThrottleObject (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				return false;
			}

			if (typeof inputData.OLSKThrottleCallback !== 'function') {
				return false;
			}

			if (typeof inputData.OLSKThrottleDuration !== 'number') {
				return false;
			}

			return true;
		},

		OLSKThrottleTimeoutFor (inputData) {
			if (!exports.OLSKThrottleInputDataIsThrottleObject(inputData)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (inputData._OLSKThrottleTimeoutID) {
				clearTimeout(inputData._OLSKThrottleTimeoutID);
			}

			inputData._OLSKThrottleTimeoutID = setTimeout(function () {
				mod._OLSKThrottleFire(inputData);
			}, inputData.OLSKThrottleDuration);

			return inputData._OLSKThrottleTimeoutID;
		},

		OLSKThrottleSkip (inputData) {
			if (!exports.OLSKThrottleInputDataIsThrottleObject(inputData)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			clearTimeout(inputData._OLSKThrottleTimeoutID);
			
			mod._OLSKThrottleFire(inputData);
		},

		_OLSKThrottleFire (inputData) {
			inputData.OLSKThrottleCallback(inputData.OLSKThrottleInput);
		},

		OLSKThrottleMappedTimeoutFor (param1, param2, param3, param4) {
			if (typeof param1 !== 'object' || param1 === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof param2 !== 'string') {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof param3 !== 'function') {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof param4 === 'undefined') {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (!param1[param2]) {
				param1[param2] = param3(param4);	
			}

			return exports.OLSKThrottleTimeoutFor(param1[param2]);
		},

	};

	Object.assign(exports, mod);

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));
