import {makeHastyPromise} from './lib';

const myPromise = makeHastyPromise<void, void>((res, rej) => {
	const timeout = setTimeout(res, 5000);

	return (reason) => {
		clearTimeout(timeout);
		rej(reason);
	};
});
if (Math.random() > 0.2) {
	myPromise.hurry();
}
myPromise.then(
	() => console.log('bang!'),
	() => console.log('not today...'),
);
