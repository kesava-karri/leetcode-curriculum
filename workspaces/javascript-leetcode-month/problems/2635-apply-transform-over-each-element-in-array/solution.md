# 2635. Apply Transform Over Each Element in Array

[View this Write-up on LeetCode TODO](https://leetcode.com/problems/apply-transform-over-each-element-in-array/solutions/) | [View Problem on LeetCode](https://leetcode.com/problems/apply-transform-over-each-element-in-array/)

> [!WARNING]  
> This page includes spoilers. For a spoiler-free introduction to the problem, see [the README file](README.md).

## Summary

Not counting ignoring the problem statement and using [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method

## Background

## Solutions

### Using [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

As always, it's fun to ignore the problem statement and get a quick accept.

```typescript []
const map = <TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] => arr.map(fn);
```

### Iterate and Build

Any of the many ways to iterate over an array will work, for example a classic `for` loop:

```typescript []
function map<TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] {
  const res: TOut[] = [];

  for (let i = 0; i < arr.length; ++i) {
    res.push(fn(arr[i], i));
  }

  return res;
}
```

A `.forEach`:

```typescript []
function map<TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] {
  const res: TOut[] = [];

  arr.forEach((element, index) => {
    res.push(fn(element, index));
  });

  return res;
}
```

And even a `for...of` loop, using `.entries` to have access to the index:

```typescript []
function map<TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] {
  const res: TOut[] = [];

  for (const [index, element] of arr.entries()) {
    res.push(fn(element, index));
  }

  return res;
}
```

Generators:

```typescript []
function* lazyMap<TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): Generator<TOut, void, void> {
  for (const [index, element] of arr.entries()) {
    yield fn(element, index);
  }
}

const map = <TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] => Array.from(lazyMap(arr, fn));
```

### Using [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

Using the spread operator looks satisfying,

```typescript []
const map<TIn, TOut> = (
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] => arr.reduce((res, element, index) => [...res, fn(element, index)], []);
```

```typescript []
const map = <TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] =>
  arr.reduce((res, element, index) => {
    res.push(fn(element, index));
    return res;
  }, []);
```

```typescript []
const map = <TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] =>
  arr.reduce((res, element, index) => (res.push(fn(element, index)), res), []);
```

### Using Other Built-Ins

A few other built-in functions have mapping behavior we can leverage, while technically not using `.map`. For example `Array.from` supports mapping for some reason:

```typescript []
const map = <TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] => Array.from(arr, fn);
```

But I think the funnier one to use is `.flatMap`! Since LeetCode guarantees that `fn` will not return an array, this works:

```typescript []
const map = <TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] => arr.flatMap(fn);
```

> [!NOTE]  
> **What would happen if we used `.flatMap` in the implementation with a `fn` that returns arrays?** As always, the answer is at the bottom of the doc.

The more defensive implementation would wrap the result of `fn` in an array:

```typescript []
const map = <TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] => arr.flatMap((element, index) => [fn(element, index)]);
```

### Recursion

Not that you should, but you could:

```typescript []
function map<TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] {
  const res: TOut[] = [];

  const doMap = (index: number) => {
    if (index === arr.length) {
      return;
    }

    res.push(fn(arr[index], index));
    doMap(index + 1);
  };

  doMap(0);

  return res;
}
```

We don't necessarily need an `index` argument, we can use the size of the result so far:

```typescript []
function map<TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
): TOut[] {
  const res: TOut[] = [];

  const doMap = () => {
    if (res.length === arr.length) {
      return;
    }

    res.push(fn(arr[res.length], res.length));
    doMap();
  };

  doMap();

  return res;
}
```

Or:

```typescript []
function map<TIn, TOut>(
  arr: readonly TIn[],
  fn: (element: TIn, index: number) => TOut,
  res: TOut[] = [],
): TOut[] {
  if (res.length === arr.length) {
    return res;
  }

  res.push(fn(arr[res.length], res.length));
  return map(arr, fn, res);
}
```

## Answers to Bonus Questions

> [!TIP]  
> Thanks for reading! If you enjoyed this write-up, feel free to [up-vote it on LeetCode TODO](https://leetcode.com/problems/apply-transform-over-each-element-in-array/solutions/)! 🙏
