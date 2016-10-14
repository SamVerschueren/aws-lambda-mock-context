'use strict';
const uuid = require('node-uuid');
const moment = require('moment');
const defer = require('pinkie-defer');
const pkg = require('./package.json');

module.exports = options => {
	const id = uuid.v1();
	const stream = uuid.v4().replace(/-/g, '');

	const opts = Object.assign({
		region: 'us-west-1',
		account: '123456789012',
		functionName: pkg.name,
		functionVersion: '$LATEST',
		memoryLimitInMB: '128'
	}, options);

	const deferred = defer();

	const context = {
		callbackWaitsForEmptyEventLoop: true,
		functionName: opts.functionName,
		functionVersion: opts.functionVersion,
		invokedFunctionArn: `arn:aws:lambda:${opts.region}:${opts.account}:function:${opts.functionName}:${opts.alias || opts.functionVersion}`,
		memoryLimitInMB: opts.memoryLimitInMB,
		awsRequestId: id,
		invokeid: id,
		logGroupName: `/aws/lambda/${opts.functionName}`,
		logStreamName: `${moment().format('YYYY/MM/DD')}/[${opts.functionVersion}]/${stream}`,
		getRemainingTimeInMillis: () => Math.floor(Math.random() * (3000 - 100)) + 100,
		succeed: result => {
			deferred.resolve(result);
		},
		fail: err => {
			if (typeof err === 'string') {
				err = new Error(err);
			}

			deferred.reject(err);
		},
		done: (err, result) => {
			if (err) {
				context.fail(err);
				return;
			}

			context.succeed(result);
		},
		Promise: new Promise(deferred)
	};

	return context;
};
