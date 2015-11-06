'use strict';
var format = require('util').format;
var uuid = require('node-uuid');
var moment = require('moment');
var Promise = require('pinkie-promise');
var defer = require('pinkie-defer');
var pkg = require('./package.json');

module.exports = function () {
	var id = uuid.v1();
	var stream = uuid.v4().replace(/-/g, '');
	var account = uuid.v1().replace(/-/g, '').substr(0, 12);

	var deferred = defer();

	return {
		functionName: pkg.name,
		functionVersion: '$LATEST',
		invokedFunctionArn: format('arn:aws:lambda:us-west-1:%s:function:%s', account, pkg.name),
		memoryLimitInMB: '128',
		awsRequestId: id,
		logGroupName: format('/aws/lambda/%s', pkg.name),
		logStreamName: format('%s/[$LATEST]/%s', moment().format('YYYY/MM/DD'), stream),
		succeed: function (result) {
			deferred.resolve(result);
		},
		fail: function (err) {
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
