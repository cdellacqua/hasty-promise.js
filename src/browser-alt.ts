import './style.css';
import {HastyPromise, makeHastyPromise} from './lib';

const resultsDiv = document.getElementById('results') as HTMLDivElement;
const startButton = document.getElementById('start') as HTMLButtonElement;
const stopButton = document.getElementById('stop') as HTMLButtonElement;

stopButton.disabled = false;

let timeoutPromise: HastyPromise<void> | undefined;
startButton.addEventListener('click', () => {
	(async () => {
		startButton.disabled = true;
		startButton.textContent = 'Pending...';

		timeoutPromise = makeHastyPromise((res, rej) => {
			const timeoutId = setTimeout(res, 1000);
			return (reason) => {
				clearTimeout(timeoutId);
				rej(reason);
			};
		});
		stopButton.disabled = false;
		try {
			await timeoutPromise;
			resultsDiv.insertBefore(
				document.createTextNode('resolved!\n'),
				resultsDiv.childNodes[0],
			);
		} catch (err) {
			resultsDiv.insertBefore(
				document.createTextNode(String(err) + '\n'),
				resultsDiv.childNodes[0],
			);
		} finally {
			startButton.textContent = 'Start Promise';
			startButton.disabled = false;
			timeoutPromise = undefined;
			stopButton.disabled = true;
		}
	})().catch(console.error);
});
stopButton.addEventListener('click', () => {
	timeoutPromise?.hurry('cancelled by user');
	timeoutPromise = undefined;
});
