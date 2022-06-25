import {expect} from 'chai';
import {makeHastyPromise} from '../src/lib/index';

describe('makeHastyPromise', () => {
	it('constructs a hasty promise', async () => {
		expect(() => makeHastyPromise(() => () => undefined)).not.to.throw();
	});
	it('lets a promise resolve', async () => {
		const p = makeHastyPromise<string>((res) => {
			res('');
			return () => undefined;
		});
		expect(await p).to.eq('');
	});
	it('lets a promise reject', async () => {
		const p = makeHastyPromise<string>((_, rej) => {
			rej('');
			return () => undefined;
		});
		expect(await p.catch((err) => err)).to.eq('');
	});
	it('hurry a promise, resolving it', async () => {
		const p = makeHastyPromise<void, void>((res) => () => res());
		p.hurry();
		expect(
			await p.then(
				() => true,
				() => false,
			),
		).to.be.true;
	});
	it('hurry a promise, rejecting it', async () => {
		const p = makeHastyPromise<void, void>((_, rej) => () => rej());
		p.hurry();
		expect(
			await p.then(
				() => true,
				() => false,
			),
		).to.be.false;
	});
	it('checks that the cleanup function gets called at most once', async () => {
		let cleanups = 0;
		const p = makeHastyPromise<void, void>((res) => () => {
			cleanups++;
			res();
		});
		p.hurry();
		p.hurry();
		p.hurry();
		p.hurry();
		p.hurry();
		p.hurry();
		expect(
			await p.then(
				() => true,
				() => false,
			),
		).to.be.true;
		expect(cleanups).to.eq(1);
	});
	it('checks that the cleanup function is not called when resolving', async () => {
		let cleanups = 0;
		const p = makeHastyPromise((res) => {
			res('');
			return () => {
				cleanups++;
			};
		});
		await p;
		expect(cleanups).to.eq(0);
	});
	it('checks that the cleanup function is not called when rejecting', async () => {
		let cleanups = 0;
		const p = makeHastyPromise((_, rej) => {
			rej();
			return () => {
				cleanups++;
			};
		});
		await p.catch(() => undefined);
		expect(cleanups).to.eq(0);
	});
	it('hurry a promise with an error, resolving it anyway', async () => {
		const p = makeHastyPromise<void>((res) => () => res());
		p.hurry(new Error('stop!'));
		expect(
			await p.then(
				() => true,
				(err) => err.message,
			),
		).to.be.true;
	});
	it('hurry a promise with an error, rejecting it', async () => {
		const p = makeHastyPromise((_, rej) => (err) => rej(err));
		p.hurry(new Error('stop!'));
		expect(
			await p.then(
				() => true,
				(err) => err.message,
			),
		).to.eq('stop!');
	});
});
