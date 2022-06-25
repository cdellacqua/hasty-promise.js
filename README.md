# hasty-promise

> A signal based approach to cancellation should be preferable, this package will no longer receive updates.

A Promise you can hurry.

Promise are a great abstraction over asynchronous code,
but they fall short when it comes to [even not so] complex scenarios.

This package provides a simple API that can be used to create
Promises that can be stopped using a `hurry` method.

[NPM Package](https://www.npmjs.com/package/hasty-promise)

`npm install hasty-promise`

[Documentation](./docs/README.md)

## Highlights

`HastyPromise<T>` is an extension of the Promise API
that provides the `hurry` method:

- `hurry(reason)`. This method runs a function specified when creating
  the HastyPromise that should stop
  the running task as soon as possible and resolve or reject
  the underlying Promise.

It also exposes all the common methods:

- `then(...)/then(...,...)`;
- `catch(...)`;
- `finally(...)`.

## Creating a HastyPromise

To create a HastyPromise you can use the `makeHastyPromise` factory function.

It takes an executor as its only parameter. The executor is synchronous a function that
takes the resolve and reject callbacks and returns a HurryHandler function that
will be called when hurrying the Promise to stop.

The HurryHandler will also receive the `reason` passed to the `hurry` method.

Let's see a simple example: Russian roulette!

```ts
import {makeHastyPromise} from 'hasty-promise';

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
```

Let's make the russian roulette more verbose by passing a `reason`:

```ts
import {makeHastyPromise} from 'hasty-promise';

const myPromise = makeHastyPromise<string, string>((res, rej) => {
	const timeout = setTimeout(() => res('bang!'), 5000);

	return (reason) => {
		console.log('clearing timeout due to the following reason:', reason);
		clearTimeout(timeout);
		rej(reason);
	};
});
if (Math.random() > 0.2) {
	myPromise.hurry('not today...');
}
myPromise.then(
	(v) => console.log(v),
	(err) => console.log(err),
);
```

Note that, as with regular Promises, in TypeScript you often need to explicitly
define the resolution type (e.g. `makeHastyPromise<void>` in the examples above).

You can also specify the type of the `hurry` reason parameter (if you don't, it defaults to `unknown`):

```ts
import {makeHastyPromise} from 'hasty-promise';

const myPromise = makeHastyPromise<void, 'user-cancelled' | 'timeout'>(
	(res, rej) => {
		// ...

		return (reason) => {
			if (reason === 'user-cancelled') {
				res();
			} else {
				rej('timeout!');
			}
		};
	},
);

setTimeout(() => {
	myPromise.hurry('timeout');
}, 1000);
stopButton.addEventListener('click', () => {
	myPromise.hurry('user-cancelled');
});
```

A more complex scenario could be an HTTP request:

```ts
import {makeHastyPromise} from 'hasty-promise';

let responsePromise: HastyPromise<Response, string> | undefined;
startButton.addEventListener('click', () => {
	startButton.disabled = true;

	responsePromise = makeHastyPromise((res, rej) => {
		const abortController = new AbortController();
		fetch('http://www.example.com/', {
			signal: abortController.signal,
		}).then(res, rej);

		// No need to explicitly reject. Fetch will
		// automatically reject an aborted request with
		// an AbortError.
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
```
