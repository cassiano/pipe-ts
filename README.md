# 100% type-safe `pipe()` and `compose()` functions written in TS

> [Function composition](<https://en.wikipedia.org/wiki/Function_composition_(computer_science)>) is an act or mechanism to combine simple functions to build more complicated ones. Like the usual composition of functions in mathematics, the result of each function is passed as the argument of the next, and the result of the last one is the result of the whole. Source: Wikipedia.
>
> Piping is basically the same idea, but in reverse order, where the functions are provided in a more natural order (i.e. the same order as they are actually invoked).
>
> This package provides a simple way to transform functions into their piped or composed versions using [Higher-Order Functions](https://en.wikipedia.org/wiki/Higher-order_function) (HOFs) called "pipe()" and "compose()", respectively, while keeping the original function's signature, expecting the same parameters as the original functions.

## Features

- 100% type-safe
- Supports functions that have up to 30 parameters
- Fully compatible with JavaScript
- Very small (only 227 bytes gzipped after bundling)
- No external dependencies

## Installation

Install from `npm` using your favorite package manager:

```
npm install @cdandrea/piping-ts
```

```
yarn add @cdandrea/piping-ts
```

```
pnpm install @cdandrea/piping-ts
```

## Usage

##### Pipe:

Simply supply the function to be piped as the 1st parameter of the `pipe()` HOF.

```ts
import { curry } from '@cdandrea/currying-ts'
import { pipe } from '@cdandrea/piping-ts'

const prop = curry((prop: string, obj: Record<string, number>) => obj[prop])
const add = curry((a: number, b: number) => b + a)
const modulo = curry((a: number, b: number) => b % a)
const amtAdd1Mod7 = pipe(prop('amount'), add(1), modulo(7))

console.log(amtAdd1Mod7({ amount: 17 })) // Prints 4
console.log(amtAdd1Mod7({ amount: 987 })) // Prints 1
console.log(amtAdd1Mod7({ amount: 68 })) // Prints 6
```

Notice that the piped function returned by `pipe()` gets fully typed, expecting the same parameters as the original functions.

##### Compose:

Simply supply the function to be composed as the 1st parameter of the `compose()` HOF.

```ts
import { curry } from '@cdandrea/currying-ts'
import { compose } from '@cdandrea/piping-ts'

const prop = curry((prop: string, obj: Record<string, number>) => obj[prop])
const add = curry((a: number, b: number) => b + a)
const modulo = curry((a: number, b: number) => b % a)
const amtAdd1Mod7 = compose(modulo(7), add(1), prop('amount'))

console.log(amtAdd1Mod7({ amount: 17 })) // Prints 4
console.log(amtAdd1Mod7({ amount: 987 })) // Prints 1
console.log(amtAdd1Mod7({ amount: 68 })) // Prints 6
```
