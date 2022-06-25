import {expect} from 'chai';
import {makeHastyPromise} from '../src/lib/index';

describe('test examples', () => {
	let timeoutCallback: (() => void) | undefined;
	function fakeSetTimeout(callback: () => void) {
		timeoutCallback = callback;
	}
	function fakeClearTimeout() {
		timeoutCallback = undefined;
	}
	beforeEach(() => {
		timeoutCallback = undefined;
	});
	it('readme 1/part 1', async () => {
		const myPromise = makeHastyPromise<void, void>((res, rej) => {
			fakeSetTimeout(res);
			return (reason) => {
				fakeClearTimeout();
				rej(reason);
			};
		});
		myPromise.hurry();
		timeoutCallback?.();
		expect(
			await myPromise.then(
				() => 'bang!',
				() => 'not today...',
			),
		).to.eq('not today...');
	});
	it('readme 1/part 2', async () => {
		const myPromise = makeHastyPromise<void>((res, rej) => {
			fakeSetTimeout(res);
			return (reason) => {
				fakeClearTimeout();
				rej(reason);
			};
		});
		timeoutCallback?.();
		expect(
			await myPromise.then(
				() => 'bang!',
				() => 'not today...',
			),
		).to.eq('bang!');
	});
	it('readme 2/part 1', async () => {
		let verboseLog = '';
		const myPromise = makeHastyPromise<string, string>((res, rej) => {
			fakeSetTimeout(() => res('bang!'));
			return (reason) => {
				verboseLog = 'clearing timeout due to the following reason: ' + reason;
				fakeClearTimeout();
				rej(reason);
			};
		});
		myPromise.hurry('not today...');
		timeoutCallback?.();
		expect(
			await myPromise.then(
				(v) => v,
				(err) => err,
			),
		).to.eq('not today...');
		expect(verboseLog).to.eq(
			'clearing timeout due to the following reason: not today...',
		);
	});
	it('readme 2/part 2', async () => {
		let verboseLog = '';
		const myPromise = makeHastyPromise<string, string>((res) => {
			fakeSetTimeout(() => res('bang!'));
			return (reason) => {
				verboseLog = 'clearing timeout due to the following reason: ' + reason;
				fakeClearTimeout();
			};
		});
		timeoutCallback?.();
		expect(
			await myPromise.then(
				(v) => v,
				(err) => err,
			),
		).to.eq('bang!');
		expect(verboseLog).to.eq('');
	});
});
