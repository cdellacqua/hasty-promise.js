import {HastyPromise, makeHastyPromise} from './lib';

const startButton = document.getElementById('start') as HTMLButtonElement;
const stopButton = document.getElementById('stop') as HTMLButtonElement;

let responsePromise: HastyPromise<Response> | undefined;
startButton.addEventListener('click', () => {
	startButton.disabled = true;

	responsePromise = makeHastyPromise((res, rej) => {
		const abortController = new AbortController();
		fetch('http://www.example.com/', {
			signal: abortController.signal,
		}).then(res, rej);

		return () => abortController.abort();
	});

	responsePromise
		.catch((err) => {
			alert('request stopped!' + String(err));
		})
		.finally(() => {
			startButton.disabled = false;
		});
});

stopButton.addEventListener('click', () =>
	responsePromise?.hurry('stopped by the user'),
);
