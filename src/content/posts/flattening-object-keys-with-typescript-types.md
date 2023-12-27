---
title: Flattening Object Keys with TypeScript Types
date: 2022-04-26
category: code
---

A few weeks ago, I was working on a project where I needed to get all the flattened keys from a deeply nested object as a string union. I looked around the internet, but everything I found was about flattening the keys at runtime. I was looking for the types only. I eventually figured out how to do it and wanted to document it in case others found it helpful.

Here's the final result:

```typescript
const example = {
  a: {
    b: 'red',
    c: 'green',
  },
  d: {
    e: 'blue',
    f: 'yellow',
  },
  g: 'pink',
  h: {
    i: {
      j: {
        k: 'gray',
        l: 'grey',
      },
    },
  },
} as const

type FlattenObjectKeys<T extends Record<string, unknown>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never

type FlatKeys = FlattenObjectKeys<typeof example>
// type FlatKeys = "g" | "a.b" | "a.c" | "d.e" | "d.f" | "h.i.j.k" | "h.i.j.l"
```

<!-- ::: info -->

I loaded this code into the [TypeScript playground](https://www.typescriptlang.org/play?#code/MYewdgzgLgBApgDwIYFsAOAbOMC8MDeAUDDEgFwHEkwBGFA5AE5wAm9ANFScAwObNwwHKgF9OJFhSLV4DGhgCucYTIBmDAJ5wMGEAHd6o8TF4M0ASzABrFTAAWUrjHOOZJAFau3JK30ZINW28MPzhApxIRJyjIwhFSCBhQSChCQigNNGwAMQwkKChBAHkadzhgKABpMIgAHgAVeARCsBZEgCVykEYWWuhGS152GAVrMH0wAD5h6o1cGCswkFUYesncKlmmlraYfsGqAH5VgG1ZgF1twV3O0B6+qAGwIZGxicmjmAADABJ8WZEADo-rl8i0SmUKrM6vUzmFzpMRF8qBRfv8wkiUTAwHAAG5wRhpDJZGCgqo1eZk8GlcrkjR1YlwZZNVCYOCTIA) if you'd like to experiment further.

<!-- ::: -->

This approach uses two newer TypeScript concepts: [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) and [template literals](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#handbook-content). Let's break `FlattenObjectKeys` down to see what it's doing. First, we're going to use generics to pass in an object's type:

```typescript
  T extends Record<string, unknown>,
  Key = keyof T
```

`T` is the type for the object we're going to be flattening. We include `extends Record<string, unknown>` to let TypeScript know this is going to be an object with unknown value types. `Key` is a generic derived from all the keys of `T`. With these two types, we can start checking to see what to do with each key. We're going to use conditional types to perform these checks. You can think of conditional types as ternary statements for types. Our first check is `Key extends string`. This is necessary because objects can also have `Symbol`s as keys, so we need to eliminate those. Here's how that works:

```typescript
> = Key extends string
  ? // Continue
  : never
```

This conditional type states "if `Key` is a `string`, continue; otherwise, ignore it and do nothing". Now that we know that `Key` is a string, we can do an additional check on the type of `T[Key]`.

```typescript
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
```

Here is where we're checking for nested objects. We're using another conditional type to check if `T[Key]` is an object. If it's not, then we don't need to do anything else. We return `Key`. If `T[Key]` is an object, we use a template string to add the key to a string with a dot separator before recursively calling `FlattenedObjectKeys` on `T[Key]` for the process to continue. With this, we can take an object with any depth of nesting and get a single string union of all the keys flattened.

---

Have thoughts about this blog post? Chat with me about it on [Twitter](https://twitter.com/RayGesualdo)!
