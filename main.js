/*!
 * OLSKThrottle
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(factory((global.OLSKThrottle = global.OLSKThrottle || {})));
}(this, (function(exports) {
	'use strict';

	//_ OLSKThrottleInputDataIsThrottleObject

	exports.OLSKThrottleInputDataIsThrottleObject = function(inputData) {
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
	};

	//_ OLSKThrottleTimeoutFor

	exports.OLSKThrottleTimeoutFor = function(inputData, callbackInput) {
		if (!exports.OLSKThrottleInputDataIsThrottleObject(inputData)) {
			throw new Error('OLSKErrorInputInvalid');
		}

		if (inputData._OLSKThrottleTimeoutID) {
			clearTimeout(inputData._OLSKThrottleTimeoutID);
		}

		inputData._OLSKThrottleTimeoutID = setTimeout(function () {
			inputData.OLSKThrottleCallback();
		}, inputData.OLSKThrottleDuration);

		return inputData._OLSKThrottleTimeoutID;
	};

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));
