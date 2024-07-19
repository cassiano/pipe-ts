# 100% type-safe `pipe()` and `compose()` functions written in TS

> [Function composition](<https://en.wikipedia.org/wiki/Function_composition_(computer_science)>) is an act or mechanism to combine simple functions to build more complicated ones. Like the usual composition of functions in mathematics, the result of each function is passed as the argument of the next, and the result of the last one is the result of the whole. Source: Wikipedia.
>
> Piping is basically the same idea, but in reverse order, where the functions are provided in a more natural order (i.e. the same order as they are actually invoked).
>
> This package provides a simple way to transform functions into their piped or composed versions using [Higher-Order Functions](https://en.wikipedia.org/wiki/Higher-order_function) (HOFs) called `pipe()` and `compose()`, respectively, while keeping the original functions signatures, making sure that, for each function in the sequence:
>
> - `pipe()`: the type of the **output** (result) of the **previous** function will always match the type of the **input** of the **next** function. The type of the parameter of the piped function will always match the type of its **first** function's parameter and the final result will have the type of its **last** function.
> - `compose()`: the type of the **input** of the **previous** function will always match the type of the **output** (result) of the **next** function. The type of the parameter of the composed function will always match the type of its **last** function's parameter and the final result will have the type of its **first** function.

## Features

- 100% type-safe
- Supports functions that have up to 30 parameters
- Fully compatible with JavaScript
- Very small (both functions have under 250 bytes gzipped after bundling)
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

Simply supply the functions to be piped as parameters of the `pipe()` HOF.

Basic example:

```ts
import { pipe } from '@cdandrea/piping-ts'

const plus1 = (n: number) => n + 1
const isEven = (n: number) => n % 2 === 0
const asString = (b: boolean) => b.toString()
const asArray = (s: string) => [s]

const f = pipe(plus1, isEven, asString, asArray)

// f()'s signature will be: `const f: (a1: number) => string[]`
//
// Notice how f() expects as input the single parameter of its
// 1st parameter (`plus1` function) and returns the result of
// its last parameter (`asArray` function), which is `string[]`.

console.log(f(10)) // Prints ["false"]
```

More elaborate example, using `pipe()` and `curry()`:

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

Notice that the piped function returned by `pipe()` gets fully typed.

##### Compose:

Simply supply the functions to be composed as parameters of the `compose()` HOF:

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
