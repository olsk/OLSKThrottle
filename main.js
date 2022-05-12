(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(factory((global.OLSKThrottle = global.OLSKThrottle || {})));
}(this, (function(exports) { 'use strict';

	const mod = {

		OLSKThrottleIsValid (inputData) {
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
			if (!mod.OLSKThrottleIsValid(inputData)) {
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
			if (!mod.OLSKThrottleIsValid(inputData)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			clearTimeout(inputData._OLSKThrottleTimeoutID);
			
			return mod._OLSKThrottleFire(inputData);
		},

		_OLSKThrottleFire (inputData) {
			delete inputData._OLSKThrottleTimeoutID;
			
			return inputData.OLSKThrottleCallback();
		},

		OLSKThrottleMappedTimeout (param1, param2, param3) {
			if (typeof param1 !== 'object' || param1 === null) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (typeof param2 !== 'string') {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (!mod.OLSKThrottleIsValid(param3)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			if (!param1[param2]) {
				param1[param2] = Object.assign(Object.assign({}, param3), {
					OLSKThrottleCallback () {
						mod._OLSKThrottleFire(param3);

						delete param1[param2];
					},
				});
			}

			return param3._OLSKThrottleTimeoutID = mod.OLSKThrottleTimeoutFor(param1[param2]);
		},

	};

	Object.assign(exports, mod);

	Object.assign(exports, mod);

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));
