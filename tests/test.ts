import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

import { compose } from '../src/compose.ts';
import { pipe } from '../src/pipe.ts';

Deno.test('pipe()', () => {
  const f = pipe(
    (n: number) => n + 1,
    (n: number) => n ** 2,
    (n: number) => n - 10,
  )

  assertEquals(f(5), (5 + 1) ** 2 - 10)
})

Deno.test('compose()', () => {
  const g = compose(
    (n: number) => n - 10,
    (n: number) => n ** 2,
    (n: number) => n + 1,
  )

  assertEquals(g(5), (5 + 1) ** 2 - 10)
})
