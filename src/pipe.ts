/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore no-explicit-any
export type FnType = (...args: any[]) => any

type Fail<Message extends string> = [never, `Type Error: ${Message}`]

type NonMatchingParameter<
  FnIndex extends number,
  ExpectedArg extends string,
  ActualArg extends string,
> = `Expected parameter type '${ExpectedArg}' of function with index ${FnIndex} to match return type '${ActualArg}' of previous one` // Index starts at 1 (not 0). If pipe, index should count from right to left if compose, from left to right.
// 'Non matching parameter'

type InvalidFunctionArity<
  FnIndex extends number,
  ActualFnArity extends number,
> = `Expected only 1 argument for function with index ${FnIndex}, but got ${ActualFnArity}` // Index starts at 1 (not 0). If pipe, index should count from right to left if compose, from left to right.
// 'Invalid function arity'

export type PipedFunction<Fns extends FnType[]> = Fns extends [
  // At least 2 args were supplied and are all functions?
  infer FirstFn extends FnType,
  infer SecondFn extends FnType,
  ...infer RemainingFns extends FnType[],
]
  ? PipeResult<
      Parameters<FirstFn>,
      ReturnTypeOfLastFn<[SecondFn, ...RemainingFns], FirstFn>
    >
  : never

type PipeResult<
  FirstFnParameters extends unknown[],
  ReturnTypeOfLastFnResult,
> = ReturnTypeOfLastFnResult extends [never, string]
  ? ReturnTypeOfLastFnResult[1] // Match failed. Return an error message.
  : (...args: FirstFnParameters) => ReturnTypeOfLastFnResult // Match ok. Return a function.

type ReturnTypeOfLastFn<
  Fns extends FnType[],
  PreviousFn extends FnType,
> = Fns extends [
  infer NextFn extends FnType, // Is there at least one remaining function in the sequence?
  ...infer RemainingFns extends FnType[],
]
  ? Parameters<NextFn>['length'] extends 1 // Next function in the sequence has exactly 1 parameter?
    ? ReturnType<PreviousFn> extends Parameters<NextFn>[0] // The return type of the previous function matches (is a subset of) the (sole) parameter type of the next one?
      ? ReturnTypeOfLastFn<RemainingFns, NextFn>
      : Fail<
          NonMatchingParameter<
            Fns['length'],
            Parameters<NextFn>[0],
            ReturnType<PreviousFn>
          >
        >
    : Fail<InvalidFunctionArity<Fns['length'], Parameters<NextFn>['length']>>
  : ReturnType<PreviousFn> // The return type of the last function will represent the return type of the entire sequence.

/**
 * A function that pipes a family of functions sequentially, where the result of each function is
 * passed as the argument of the next, and the result of the last one is the result of the whole.
 *
 * @template Fns - The signatures of the piped functions (always inferred automatically by TS).
 * @param {Fn} fn - The function to be piped.
 * @returns {PipedFunction<Fns>} - The piped function, expecting the parameter of the first function and
 * returning the result of the last one.
 */

export const pipe = <Fns extends FnType[]>(...fns: Fns): PipedFunction<Fns> => {
  const [headFn, ...tailFns] = fns

  return ((...args: unknown[]) =>
    tailFns.reduce(
      (acc: unknown, nextFn) => nextFn(acc),
      headFn(...args),
    )) as unknown as PipedFunction<Fns>
}

type Reverse<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? [...Reverse<Tail>, Head]
  : []

type ComposedFunction<Fns extends FnType[]> = PipedFunction<Reverse<Fns>>

/**
 * A function that composes a family of functions sequentially, where the result of each function is
 * passed as the argument of the previous, starting with the last, and the result of the first one is
 * the result of the whole.
 *
 * @template Fns - The signatures of the composed functions (always inferred automatically by TS).
 * @param {Fn} fn - The function to be composed.
 * @returns {ComposedFunction<Fns>} - The composed function, expecting the parameter of the last function and
 * returning the result of the first one.
 */

export const compose = <Fns extends FnType[]>(
  ...fns: Fns
): ComposedFunction<Fns> => pipe(...fns.reverse())
