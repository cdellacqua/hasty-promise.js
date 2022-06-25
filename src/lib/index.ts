/**
 * An HastyPromise adds a `hurry` method
 * to the standard Promise API.
 */
export type HastyPromise<T, THurry = unknown> = Promise<T> & {
	/**
	 * Hurry a Promise to stop before its natural resolution (or rejection).
	 *
	 * @param reason the reason this Promise should stop.
	 */
	hurry(reason: THurry): void;
};

/**
 * A function that's invoked by the hurry method. The reason passed
 * to the hurry method gets forwarded to this handler which in turn
 * can take the necessary steps to stop the async task and resolve or reject
 * the underline Promise.
 */
export type HurryHandler<THurry> = (reason: THurry) => void;

/**
 * A HastyPromise executor is a synchronous function
 * that takes both a resolve and a reject callback, just like
 * a standard Promise executor.
 *
 * A HastyPromiseExecutor returns a {@link HurryHandler} function
 * that will take the necessary steps to stop
 * the running task when the `hurry` method is called.
 */
export type HastyPromiseExecutor<T, THurry> = (
	resolve: (value: T) => void,
	reject: (reason?: unknown) => void,
) => HurryHandler<THurry>;

/**
 * Create a HastyPromise.
 *
 * @param executor A HastyPromise executor is a synchronous function
 * that takes both a resolve and a reject callback, just like
 * a standard Promise executor.
 *
 * A HastyPromiseExecutor returns a {@link HurryHandler} function
 * that will take the necessary steps to stop
 * the running task when the `hurry` method is called.
 * @returns a {@link HastyPromise}
 */
export function makeHastyPromise<T, THurry = unknown>(
	executor: HastyPromiseExecutor<T, THurry>,
): HastyPromise<T, THurry> {
	const contextRef: {
		hurryHandler?: HurryHandler<THurry>;
	} = {};
	const basePromise = new Promise((res, rej) => {
		contextRef.hurryHandler = executor(res, rej);
	});
	(basePromise as HastyPromise<T, THurry>).hurry = (reason) => {
		contextRef.hurryHandler?.(reason);
		contextRef.hurryHandler = undefined;
	};
	return basePromise as HastyPromise<T, THurry>;
}
