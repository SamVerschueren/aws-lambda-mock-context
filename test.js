import test from 'ava';
import fn from './';

test('succeed', async t => {
	const ctx = fn();

	setTimeout(() => {
		ctx.succeed('baz');
	}, 500);

	t.is(await ctx.Promise, 'baz');
});

test('fail', async t => {
	const ctx = fn();

	setTimeout(() => {
		ctx.fail(new Error('promise fail'));
	}, 500);

	try {
		await ctx.Promise;
	} catch (err) {
		t.is(err.message, 'promise fail');
	}
});

test('done', async t => {
	const ctx = fn();

	setTimeout(() => {
		ctx.done(undefined, 'bazz');
	}, 500);

	t.is(await ctx.Promise, 'bazz');
});

test('done err', async t => {
	const ctx = fn();

	setTimeout(() => {
		ctx.done(new Error('done fail'));
	}, 500);

	try {
		await ctx.Promise;
	} catch (err) {
		t.is(err.message, 'done fail');
	}
});
