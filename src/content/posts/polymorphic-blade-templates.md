---
title: Polymorphic Blade Templates
date: 2025-02-25
category: code
hero:
  credit: https://unsplash.com/photos/green-and-black-chameleon-on-brown-tree-branch-stv4w-asB80
  image: ../../assets/hero/polymorphic-blade-templates.jpg
  alt: Chameleon staring straight at you
tags:
  - PHP
  - Laravel
  - Blade
---

I've spent most of the frontend aspects of my career building in React. It's common to find base components – usually from a UI kit or library – that allow for polymorphism:

```tsx
import { Typography } from 'my-ui-kit'

function App() {
  return (
    <div>
      <Typography as="h1">Title</Typography>
      <Typography as="p">Some content text</Typography>
      <Button as="a" href="/login">
        Log in
      </Button>
    </div>
  )
}
```

Lately, I've been spending a lot of my time in Laravel using it's templating engine, Blade. Here's what a typical Blade component looks like[^1]:

```blade
// views/components/button.blade.php
<button {{ $attributes->class(['py-2 px-4 bg-blue-600']) }}>
  {{$slot}}
</button>
```

And it can be used like this:

```blade
// views/home.blade.php
<div>
  <x-button type="submit" class="mt-4">Save</x-button>
</div>
```

I was curious what a polymorphic component might look like in a Blade template. I had a flexible `button` component with styles for different variants and sizes. I wanted to reuse those styles for links when necessary, but I didn't want to copy/paste the `button` component to only swap out the underlying `<button>` tag for an `<a>` tag.

Turns out, Blade templates are mostly string interpolation so adding an `as` prop was trivial:

```blade
// views/components/button.blade.php

@props(['as' => 'button'])

<{{ $as }} {{ $attributes->class(['py-2 px-4 bg-blue-600']) }}>
  {{$slot}}
</{{ $as }}>
```

The `@props` Blade directive tells the templating engine that we are going to be using the `$as`[^2] prop outside of the `$attributes` bag[^1]. Then we replace the text `button` in our component with `{{ $as }}`. The templating engine does the rest. Lastly, we added a default value for `$as` of `button` so that we only need to pass the `as` prop when we want something other than a button.

Here's what our new polymorphic component looks like when it's used:

```blade
// views/form-footer.blade.php
<div class="flex gap-2">
  <x-button type="submit">Save</x-button>
  <x-button as="a" href="/">Cancel</x-button>
</div>
```

That's all there is to it!

[^1]: If you're curious about how Blade templates work and what `$attributes` and `$slot` do, check out [the Blade docs on Laravel's site](https://laravel.com/docs/12.x/blade).
[^2]: In PHP, all variables use the `$` prefix so even though we defined out prop as `as` (which is what the name will be when passing in the value in the template), we use `$as` in our PHP code.
