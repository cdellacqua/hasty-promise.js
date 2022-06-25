hasty-promise

# hasty-promise

## Table of contents

### Type Aliases

- [HastyPromise](README.md#hastypromise)
- [HastyPromiseExecutor](README.md#hastypromiseexecutor)
- [HurryHandler](README.md#hurryhandler)

### Functions

- [makeHastyPromise](README.md#makehastypromise)

## Type Aliases

### HastyPromise

Ƭ **HastyPromise**<`T`, `THurry`\>: `Promise`<`T`\> & { `hurry`: (`reason`: `THurry`) => `void`  }

An HastyPromise adds a `hurry` method
to the standard Promise API.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `THurry` | `unknown` |

#### Defined in

[index.ts:5](https://github.com/cdellacqua/hasty-promise.js/blob/main/src/lib/index.ts#L5)

___

### HastyPromiseExecutor

Ƭ **HastyPromiseExecutor**<`T`, `THurry`\>: (`resolve`: (`value`: `T`) => `void`, `reject`: (`reason?`: `unknown`) => `void`) => [`HurryHandler`](README.md#hurryhandler)<`THurry`\>

#### Type parameters

| Name |
| :------ |
| `T` |
| `THurry` |

#### Type declaration

▸ (`resolve`, `reject`): [`HurryHandler`](README.md#hurryhandler)<`THurry`\>

A HastyPromise executor is a synchronous function
that takes both a resolve and a reject callback, just like
a standard Promise executor.

A HastyPromiseExecutor returns a [HurryHandler](README.md#hurryhandler) function
that will take the necessary steps to stop
the running task when the `hurry` method is called.

##### Parameters

| Name | Type |
| :------ | :------ |
| `resolve` | (`value`: `T`) => `void` |
| `reject` | (`reason?`: `unknown`) => `void` |

##### Returns

[`HurryHandler`](README.md#hurryhandler)<`THurry`\>

#### Defined in

[index.ts:31](https://github.com/cdellacqua/hasty-promise.js/blob/main/src/lib/index.ts#L31)

___

### HurryHandler

Ƭ **HurryHandler**<`THurry`\>: (`reason`: `THurry`) => `void`

#### Type parameters

| Name |
| :------ |
| `THurry` |

#### Type declaration

▸ (`reason`): `void`

A function that's invoked by the hurry method. The reason passed
to the hurry method gets forwarded to this handler which in turn
can take the necessary steps to stop the async task and resolve or reject
the underline Promise.

##### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | `THurry` |

##### Returns

`void`

#### Defined in

[index.ts:20](https://github.com/cdellacqua/hasty-promise.js/blob/main/src/lib/index.ts#L20)

## Functions

### makeHastyPromise

▸ **makeHastyPromise**<`T`, `THurry`\>(`executor`): [`HastyPromise`](README.md#hastypromise)<`T`, `THurry`\>

Create a HastyPromise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `THurry` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `executor` | [`HastyPromiseExecutor`](README.md#hastypromiseexecutor)<`T`, `THurry`\> | A HastyPromise executor is a synchronous function that takes both a resolve and a reject callback, just like a standard Promise executor.  A HastyPromiseExecutor returns a [HurryHandler](README.md#hurryhandler) function that will take the necessary steps to stop the running task when the `hurry` method is called. |

#### Returns

[`HastyPromise`](README.md#hastypromise)<`T`, `THurry`\>

a [HastyPromise](README.md#hastypromise)

#### Defined in

[index.ts:48](https://github.com/cdellacqua/hasty-promise.js/blob/main/src/lib/index.ts#L48)
