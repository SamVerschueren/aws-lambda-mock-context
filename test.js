import test from 'ava';
import delay from 'delay';
import inRange from 'in-range';
import m from './';

function invokeAsync(method, result, opts) {
	opts = Object.assign({
		ms: 500,
		timeout: 3
	}, opts);

	const ctx = m({
		timeout: opts.timeout
	});

	setTimeout(() => {
		if (Array.isArray(result)) {
			ctx[method].apply(ctx, result);
			return;
		}

		ctx[method](result);
	}, opts.ms);

	return ctx.Promise;
}

test('succeed', async t => {
	t.is(await invokeAsync('succeed', 'baz'), 'baz');
	t.is(await invokeAsync('done', [undefined, 'baz']), 'baz');
});

test('fail', async t => {
	await t.throws(invokeAsync('fail', 'promise fail'), 'promise fail');
	await t.throws(invokeAsync('fail', new Error('promise fail')), 'promise fail');
	await t.throws(invokeAsync('done', new Error('promise fail')), 'promise fail');
});

test('result', t => {
	const ctx = m();

	t.is(ctx.functionName, 'aws-lambda-mock-context');
	t.is(ctx.functionVersion, '$LATEST');
	t.is(ctx.memoryLimitInMB, '128');
	t.is(ctx.logGroupName, '/aws/lambda/aws-lambda-mock-context');
	t.is(ctx.invokedFunctionArn, 'arn:aws:lambda:us-west-1:123456789012:function:aws-lambda-mock-context:$LATEST');

	ctx.succeed();
});

test('options', t => {
	const ctx = m({
		region: 'eu-west-1',
		account: '210987654321',
		functionName: 'test',
		functionVersion: '1',
		memoryLimitInMB: '512',
		alias: 'production'
	});

	t.is(ctx.functionName, 'test');
	t.is(ctx.functionVersion, '1');
	t.is(ctx.memoryLimitInMB, '512');
	t.is(ctx.logGroupName, '/aws/lambda/test');
	t.is(ctx.invokedFunctionArn, 'arn:aws:lambda:eu-west-1:210987654321:function:test:production');

	ctx.succeed();
});

test('remaining time', async t => {
	const ctx = m();

	await delay(1000);

	const ms = ctx.getRemainingTimeInMillis();

	t.true(inRange(ctx.getRemainingTimeInMillis(), 1950, 2050));

	await delay(10);

	t.true(ctx.getRemainingTimeInMillis() < ms);

	ctx.succeed();

	const msAfterSuccess = ctx.getRemainingTimeInMillis();

	await delay(100);

	t.true(ctx.getRemainingTimeInMillis() === msAfterSuccess);
});

test('set function timeout', async t => {
	const ctx = m({
		timeout: 10
	});

	await delay(1000);

	t.true(inRange(ctx.getRemainingTimeInMillis(), 8950, 9050));
	ctx.succeed();
});

test('timeout throws error', async t => {
	await t.throws(invokeAsync('succeed', 'foo', {ms: 2000, timeout: 1}), 'Task timed out after 1.00 seconds');
});
