'use strict';
var format = require('util').format;
var uuid = require('node-uuid');
var moment = require('moment');
var Promise = require('pinkie-promise');
var defer = require('pinkie-defer');
var objectAssign = require('object-assign');
var pkg = require('./package.json');

module.exports = function (opts) {
	var id = uuid.v1();
	var stream = uuid.v4().replace(/-/g, '');

	opts = objectAssign({
		region: 'us-west-1',
		account: '123456789012',
		functionName: pkg.name,
		functionVersion: '$LATEST',
		memoryLimitInMB: '128'
	}, opts);

	var deferred = defer();

	return {
		functionName: opts.functionName,
		functionVersion: opts.functionVersion,
		invokedFunctionArn: format('arn:aws:lambda:%s:%s:function:%s:%s', opts.region, opts.account, opts.functionName, opts.alias || opts.functionVersion),
		memoryLimitInMB: opts.memoryLimitInMB,
		awsRequestId: id,
		invokeid: id,
		logGroupName: format('/aws/lambda/%s', opts.functionName),
		logStreamName: format('%s/[%s]/%s', moment().format('YYYY/MM/DD'), opts.functionVersion, stream),
		succeed: function (result) {
			deferred.resolve(result);
		},
		fail: function (err) {
			if (typeof err === 'string') {
				err = new Error(err);
			}

			deferred.reject(err);
		},
		done: function (err, result) {
			if (err) {
				return this.fail(err);
			}

			this.succeed(result);
		},
		getRemainingTimeInMillis: function () {
			return Math.floor(Math.random() * (3000 - 100)) + 100;
		},
		Promise: new Promise(deferred)
	};
};
