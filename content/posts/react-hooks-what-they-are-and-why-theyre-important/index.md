---
title: "React Hooks: What They Are and Why They're Important"
date: 2018-11-05
category: code
---

[Sophie Alpert][satwitter] and [Dan Abramov][datwitter] showcased hooks, React's newest upcoming feature, at ReactConf this year. At first glance, I thought they seemed strange and frankly unhelpful. But as I've worked with them and worked through the spec and documentation, I'm now of a very different opinion. I - along with many others - think hooks are the future of React. In this first article in a 3 part series, I'll discuss what hooks are and why I think they're important for React ecosystem. The second article will deep dive into the specific APIs of each hook included in React. The third article will walk through refactoring a render prop component into a custom hook, in my opinion one of the most interesting aspects of the hooks specification.

_I highly recommend looking at the [hooks documentation][hookdocs] on the React website. The React team has done a brilliant job providing documentation for this new feature. The [ReactConf keynote presentation][keynoteyoutube] is also worth a watch. Additionally, there have already been many interesting observations and excellent articles written on hooks. I have included a selection of these in the [Additional Resources](#additional-resources) section._

## What are hooks?

> It should be noted that hooks are only a proposal and included in the React v16.7 alpha release as a preview. Certain aspects of their API and internal workings may change before their final release.

Hooks are a new feature in React that allow us to "hook into" React features and do operations in function components that would typically require a class component. Some of those operations include maintaining state and updating it over time; triggering side effects; cleaning up side effects after a component unmounts; accessing Context instances; or using refs. Hooks will obviate the need for class components almost entirely, _and that's a good thing!_ JavaScript classes are [difficult for both humans and machines][classesarehard].

Over the past few years, there's been a natural evolution in how React allows us to create components. The very first versions of React had the `createClass` function. It would create components when passed an object following a very specific structure defining its state, propTypes, internal methods, render function, etc. There wasn't a better way in the language to create components, either stateful or stateless. With the ES2015 spec bringing the `class` keyword to JavaScript, the React team saw the in-built language feature as a replacement to `createClass` - classes maintain their state, define methods including static methods, can be extended, etc. - and in v0.13 they released the ability to create components using JavaScript classes. This was a step forward for stateful components, using language features instead of a custom API, but stateless components didn't require all the overhead of using the `class` keyword. React v0.14 included support for regular functions as stateless components. This made defining stateless components as simple as writing a function. After all, a stateless component's output should be a _function_ of its structure and props.

Fast-forward to hooks. Now, stateless _and_ stateful components can be written as functions. Hooks give us the ability to utilize all of React's features within the context of simple function components. Importantly, hooks are merely _functions_ themselves. While they give us access to core React functionality, using them feels the same as using any other function. Almost everything in React is now a function!

## Hooks by Example

Let's look at two React hooks, how they are used, and how their syntax maps from class components.

### useState

The first hook is `useState` which gives us the ability to - no surprise - manage component state. Let's start by looking at simple counter component using the class syntax.

```javascript
import React, { Component } from 'react'

class MyClassComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
    }
    this.incrementCount.bind(this)
  }

  incrementCount() {
    this.setState(state => {
      count: state.count + 1
    })
  }

  render() {
    return (
      <div>
        <p>Counter: {this.state}</p>
        <button onClick={this.incrementCount}>Increment Count</button>
      </div>
    )
  }
}
```

There's not much going on here. We set an initial value for our `count` state in the constructor and have an `incrementCount` method we can call when the button is clicked to increment that state. Still, for something as simple as a counter, there's a lot of code we have to write to get it to work, including knowing about class constructors, making sure we don't forget to call `super(props)`, and binding `this` correctly to `incrementCount`.

Here's that exact same component using a hook.

```javascript
import React, { useState } from 'react'

function MyFunctionComponent() {
  const [count, setCount] = useState(0)
  const incrementCount = () => setCount(countState => countState + 1)

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={incrementCount}>Increment Count</button>
    </div>
  )
}
```

That's so much more straightforward! I have a single call to `useState` (by convention, all hooks start with the word `use` to signify they are in fact hooks) which returns an array with two elements in it. The first is a reference to the state being managed, which we named `count`. The second is a function to change that state, which we named `setCount`. We can think of the `[state, setState]` signature as a tuple. JavaScript doesn't have tuples built into the language, but they are being emulated here using [array destructuring][arraydestructuring]. The names we use aren't dictated by `useState` either. We can name them descriptively based on how we're using `useState` at the time. Additionally, any value passed into `useState` when it's called - `0` in our example - is used as the initial state.

Let's talk about `setCount`. It's very similar to `this.setState` in that it allows us to update our state over time. However, while `this.setState` will merge any state changes for you, `setCount` (or any state setting function from `useState`) always overwrites the previous state. `incrementCount` is now a function in our component instead of a class method.

That's the `useState` hook. It gives us all the state management features of class components in our function components and will continue to be a building block for more advanced hook use cases.

### useEffect

`useEffect` is a hook that allows us to run and manage side effects in our components. Typically, one would use component lifecycle methods to accomplish this. Let's see what this might look like with a class component.

```javascript
import React, { Component } from 'react'
import fakeWebSocketLib from './fakeWebSocketLib'

class MyClassComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    fakeWebSocketLib.subscribe(this.props.id, message => {
      this.setState(state => ({ messages: state.messages.concat([message]) }))
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      fakeWebSocketLib.unsubscribe()
      fakeWebSocketLib.subscribe(this.props.id, message => {
        this.setState(state => ({ messages: state.messages.concat([message]) }))
      })
    }
  }

  componentWillUnmount() {
    fakeWebSocketLib.unsubscribe()
  }

  render() {
    return (
      // ...
    )
  }
}
```

Let's break that down. First, we're going to keep `messages` in our component state. This will get updated as messages are pushed to us via our `fakeWebSocketLib`. Second, we're subscribing to our socket using the `id` prop and a callback which will add any messages we receive to `this.state.messages`. Third, we are using `compenentDidUpdate` to check if the `id` prop has changed between renders and, if so, unsubscribing to the old socket and subscribing to a new one with the new `id`. Fourth, we make sure there aren't any memory leaks and unsubscribe to the socket when the component is unmounted. For this example, we don't care about what the component will render, hence the lack of code in the `render` function.

_Whew_. That was a lot. And there are some gotchas in there. Someone new to React probably wouldn't think to cover the `componentDidUpdate` case. We have duplicate code in there too. We could DRY that up, but it would also mean another class method (and making sure we remember to call `.bind(this)` on that method in the constructor).

Here's the exact same component using hooks.

```javascript
import React, { useState, useEffect } from 'react'
import fakeWebSocketLib from './fakeWebSocketLib'

function MyFunctionComponent(props) {
  const [messages, setMessages] = useState([])
  useEffect(() => {
    fakeWebSocketLib.subscribe(props.id, message => {
      setMessages(messagesState => messageState.concat([message]))
    })
    return () => fakeWebSocketLib.unsubscribe()
  }, [props.id])

  return (
    // ...
  )
}
```

Isn't that incredible? Our code is much more expressive now that we have a sequential description of what's taking place as opposed to our logic being broken up amongst different lifecycle methods. It's also DRYer and contains less boilerplate.

We're using `useState` again to maintain the list of messages. Next, we call `useEffect` and pass it a function to run for us, subscribing to our socket with `props.id`. The subscribe callback will add any messages it receives to `messages` via `setMessages`. We also return a function inside `useEffect`. This function will automatically be called when the component unmounts to clean up the socket subscription. Don't forget the requirement that we need the subscription to be torn down and recreated any time `props.id` changes. Notice the second parameter we pass to `useEffect`: `[props.id]`. We're telling `useEffect` to clean up and re-instantiate itself if `props.id`, and only if `props.id`, changes.

We went from 33 lines in our class down to 13 using hooks, but lines of code is a terrible metric. Instead, think about how much more clearly the hook example communicates what the component is accomplishing. We can perform side effects in a straightforward fashion providing both initialization and cleanup code in the same code block as well as utilize the output of other hooks. If your intuition is telling you hooks are a big deal, you'd be right, but for more reasons than just code clarity and readability.

## Why hooks are important

In order to understand why hooks are important, we need to take a step back to talk about **composability**. React was one of the first view libraries to model user interfaces as a composition of components. With React, having self-contained code artifacts with clearly defined APIs provided the foundation for cleanly separated building blocks for our user interfaces. We construct our UI by starting small and building up as we compose larger and larger components. This component architecture is so effective, almost every other view library now follows similar models.

If we consider the types of components we create, they fall into two general categories. The first category contains what are sometimes described as "stateless" or "dumb" components. These components are typically functions that hold no state, do not interact with their environment except by accepting props, and are chiefly concerned with displaying our UI. The second category contains "stateful" or "smart" class components which hold business logic to interact with the environment, handle data fetching, provide user interactivity, etc. It's important to note that while our UI code is easily composable using our stateless components, our business logic is actually locked into the stateful components in which it is written. How do we then share this business logic (read: how do we compose this logic) across our application? Through React's lifetime, this has been handled in a few different ways.

If we go back to the beginning of React, when components were created via `React.createClass`, mixins were the primary mechanism for sharing business logic amongst components. Mixins were built into React and could be utilized to easily inject methods and state into components. As time went on and mixins were more commonly used, [multiple drawbacks became apparent][mixinsharmful]. Mixins created implicit dependencies where it became difficult to tell where logic was coming from, especially if one used multiple mixins in the same component. Mixins could also collide with each other if the method or state names were ever the same. Further, once React moved to using `class` to define components, there was no way to use mixins anymore. They were deprecated swiftly.

But composition was still a necessity. A new pattern arose in the community, spearheaded by Redux's React bindings, to share logic: [higher order components][hocdocs] or HOCs. HOCs are functions that take a component and wrap it in another component while injecting props into the original component. How the wrapping component behave and what the props are depends on the desired functionality of the HOC. It sounds confusing, but HOCs are actually quite simple to use. For those that have used Redux, its `connect` function is an HOC. HOCs can accept options themselves and multiple HOCs can be strung together using a `compose` function. They are very powerful, but they suffer from many of the same downsides as mixins. They create implicit dependencies where it's not always clear where props are coming from. They can also clobber one another if two HOCs try to inject the same prop.

To provide a more flexible paradigm, the idea of [render prop][renderpropsdocs] components emerged. With render props, instead of allowing other code (HOCs, mixins) to inject props into a component, props can be named and even renamed when used by the developer, providing greater clarity as to where logic was originating. These props can also be spread out across a tree instead of just being injected into the immediate child. One significant downside is using multiple render prop components can be verbose and unwieldy. They can significantly increase the number of components written in the component tree; patterns are just now starting to emerge to mitigate this issue. Their syntax can also be confusing, especially for those less familiar with React. While render props have become the most popular paradigm for reusing logic as of late, they can still be difficult to work with and still rely on class components and component lifecycle methods under the hood to provide much of their functionality.

Hooks step into this environment and provide a better alternative for sharing business logic. We no longer rely on components to encapsulate our logic which injects more complexity into our component tree, either implicitly or explicitly. Instead, hooks exist as functions that can be called within components, shared across components and themselves composed into more complicated hooks - oh yes, custom hooks exist and they are wonderful - without affecting the component tree. All calls to hooks are explicit so dependencies aren't hidden and give the developer naming flexibility so there's no prop clobbering. Hooks are brand new, so there will undoubtedly be rough edges and scenarios we haven't even considered yet but they will only improve as they reach full community adoption.

The initial look and feel of hooks is fantastic. They are the most composable paradigm for sharing business logic and allow everything in React to be encapsulated as functions, both UI components and business logic. This move towards functions has been the evolutionary trend of React throughout its life and hooks are a natural outcome of that evolution. They are incredibly powerful and I can't wait to see how we as the community use them to write better software.

## Additional Resources

I will be writing two more articles on hooks, one walking through the APIs of the different hooks React provides and another on converting a render prop component to a hook. In the meantime, there are many helpful resources already out the in the community and a handful are included below:

- [Hooks documentation][hookdocs]
- [ReactConf keynote presentation][keynoteyoutube]
- ["Making Sense of React Hooks" - Dan Abramov][makingsenseofreacthooks]
- [Collection of React Hooks][collectionofhooks]
- [usehooks.com][usehooks]
- ["A Simple Intro to React Hooks" - Dave Ceddia][simplehooksintro]

---

Have thoughts on hooks? Chat with me about them on [Twitter](https://twitter.com/RayGesualdo)!

[satwitter]: https://twitter.com/sophiebits
[datwitter]: https://twitter.com/dan_abramov
[keynoteyoutube]: https://www.youtube.com/watch?v=dpw9EHDh2bM
[classesarehard]: https://www.youtube.com/watch?v=dpw9EHDh2bM&t=609
[hookdocs]: https://reactjs.org/docs/hooks-intro.html
[hocdocs]: https://reactjs.org/docs/higher-order-components.html
[renderpropsdocs]: https://reactjs.org/docs/render-props.html
[arraydestructuring]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring
[mixinsharmful]: https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html
[makingsenseofreacthooks]: https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889
[collectionofhooks]: https://nikgraf.github.io/react-hooks/
[usehooks]: https://usehooks.com/
[simplehooksintro]: https://daveceddia.com/intro-to-hooks/
