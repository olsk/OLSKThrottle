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
		if (!mod.OLSKThrottleInputDataIsThrottleObject(inputData)) {
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
		if (!mod.OLSKThrottleInputDataIsThrottleObject(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		clearTimeout(inputData._OLSKThrottleTimeoutID);
		
		mod._OLSKThrottleFire(inputData);
	},

	_OLSKThrottleFire (inputData) {
		inputData.OLSKThrottleCallback();

		delete inputData._OLSKThrottleTimeoutID;
	},

	OLSKThrottleMappedTimeout (param1, param2, param3) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!mod.OLSKThrottleInputDataIsThrottleObject(param3)) {
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