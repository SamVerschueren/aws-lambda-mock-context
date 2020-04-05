const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const defer = require('pinkie-defer');
const pkg = require('./package.json');

const mockContext = userOptions => {
	const id = uuidv1();
	const stream = uuidv4().replace(/-/g, '');

	const options = {
		region: 'us-west-1',
		account: '123456789012',
		functionName: pkg.name,
		functionVersion: '$LATEST',
		memoryLimitInMB: '128',
		timeout: 3,
		...userOptions
	};

	const deferred = defer();

	const d = new Date();
	const logDateString = [
		d.getFullYear(),
		('0' + (d.getMonth() + 1)).slice(-2),
		('0' + d.getDate()).slice(-2)
	].join('/');
	const start = d.getTime();
	let end;
	let timeout = null;
	const context = {
		callbackWaitsForEmptyEventLoop: true,
		functionName: options.functionName,
		functionVersion: options.functionVersion,
		invokedFunctionArn: `arn:aws:lambda:${options.region}:${options.account}:function:${options.functionName}:${options.alias || options.functionVersion}`,
		memoryLimitInMB: options.memoryLimitInMB,
		awsRequestId: id,
		invokeid: id,
		logGroupName: `/aws/lambda/${options.functionName}`,
		logStreamName: `${logDateString}/[${options.functionVersion}]/${stream}`,
		getRemainingTimeInMillis: () => {
			const endTime = end || Date.now();
			const remainingTime = (options.timeout * 1000) - (endTime - start);

			return Math.max(0, remainingTime);
		},
		succeed: result => {
			end = Date.now();

			deferred.resolve(result);
		},
		fail: err => {
			end = Date.now();

			if (typeof err === 'string') {
				err = new Error(err);
			}

			deferred.reject(err);
		},
		done: (err, result) => {
			if (timeout) {
				clearTimeout(timeout);
			}

			if (err) {
				context.fail(err);
				return;
			}

			context.succeed(result);
		},
		Promise: new Promise(deferred)
	};

	timeout = setTimeout(() => {
		if (context.getRemainingTimeInMillis() === 0) {
			context.fail(new Error(`Task timed out after ${options.timeout}.00 seconds`));
		}
	}, options.timeout * 1000);

	return context;
};

module.exports = mockContext;
