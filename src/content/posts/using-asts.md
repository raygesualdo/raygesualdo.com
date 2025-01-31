---
title: Using ASTs
date: 2024-03-30
category: code
hero:
  credit: https://unsplash.com/photos/green-leaf-tree-on-shore-XBxQZLNBM0Q
  image: ../../assets/hero/using-asts.jpg
  alt: A single tree in the middle of a field in front of the ocean
tags:
  - JavaScript
---

Few things accelerated my understanding of code, and what I could do with it, faster than Abstract Syntax Trees (ASTs). ASTs are data representations of code. Said another way, it's how computers parse code into it's different pieces and parts, much like students diagramming sentences in school. Each bit of code has a name and a job that the computer can understand. To be clear, this is not about executing code. That is done separately. This is about breaking the code down into a machine-readable format the computer can analyze, verify, validate or change it in some way.

Before we talk about why this is so powerful, take the following code as an example:

```js
const greeting = 'Hello world'
console.log(greeting)
```

This is a very simple JavaScript program that stores a string in a variable then logs the value out to the console. But what does that program look like as an AST? Here's how [SWC](https://swc.rs/) parses it:

```json
{
  "type": "Module",
  "span": {
    "start": 53,
    "end": 105,
    "ctxt": 0
  },
  "body": [
    {
      "type": "VariableDeclaration",
      "span": {
        "start": 53,
        "end": 83,
        "ctxt": 0
      },
      "kind": "const",
      "declare": false,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "span": {
            "start": 59,
            "end": 83,
            "ctxt": 0
          },
          "id": {
            "type": "Identifier",
            "span": {
              "start": 59,
              "end": 67,
              "ctxt": 0
            },
            "value": "greeting",
            "optional": false,
            "typeAnnotation": null
          },
          "init": {
            "type": "StringLiteral",
            "span": {
              "start": 70,
              "end": 83,
              "ctxt": 0
            },
            "value": "Hello world",
            "hasEscape": false,
            "kind": {
              "type": "normal",
              "containsQuote": true
            }
          },
          "definite": false
        }
      ]
    },
    {
      "type": "ExpressionStatement",
      "span": {
        "start": 84,
        "end": 105,
        "ctxt": 0
      },
      "expression": {
        "type": "CallExpression",
        "span": {
          "start": 84,
          "end": 105,
          "ctxt": 0
        },
        "callee": {
          "type": "MemberExpression",
          "span": {
            "start": 84,
            "end": 95,
            "ctxt": 0
          },
          "object": {
            "type": "Identifier",
            "span": {
              "start": 84,
              "end": 91,
              "ctxt": 0
            },
            "value": "console",
            "optional": false
          },
          "property": {
            "type": "Identifier",
            "span": {
              "start": 92,
              "end": 95,
              "ctxt": 0
            },
            "value": "log",
            "optional": false
          }
        },
        "arguments": [
          {
            "spread": null,
            "expression": {
              "type": "Identifier",
              "span": {
                "start": 96,
                "end": 104,
                "ctxt": 0
              },
              "value": "greeting",
              "optional": false
            }
          }
        ],
        "typeArguments": null
      }
    }
  ],
  "interpreter": null
}
```

That's a whole lot of JSON[^1] and we don't have time to break it all down here, but notice that:

1. It's a tree of information, hence the "tree" in "abstract syntax tree",
2. It stores the location of every bit of code, and
3. It disambiguates each bit of code via a `type` that then has additional metadata.

With this information, the program can also be stringified back into code. Before it's stringified, any number of things can be done to it. If you're using a tool like Babel, the AST can be changed so that the final code is different than the code that was parsed. If you're using ESLint, it can analyze the AST to ensure it meets certain standards and criteria. If you're using a bundler like Webpack, it can use the AST to walk the dependency tree of your entire application. The use-cases are many.

It should be noted that there isn't one standard AST for JavaScript. In fact, tools like ESLint, SWC, Rollup, Babel, esbuild, Flowtype, TypeScript, and many more each have their own AST representations. As you're learning ASTs, you will notice this pretty quickly; Babel plugins and ESLint plugins work very differently. Parsing all this code is one of the areas in which Rust-based tools like esbuild, SWC, Rspack, and the forthcoming Rolldown excel in terms of performance. But regardless, all these tools are doing the same thing under the hood: converting code to ASTs before operating on them in one form or another.

Clearly, ASTs are important for the JavaScript ecosystem. Our entire modern build toolchain uses them to some degree. But where they are particularly helpful to us is when we need to analyze or change code en masse in large projects or in a way that's repeatable across many different projects. Understanding ASTs allows us to write codemods, programs that take an AST and alter it for some needed change. For example, say you manage the design system at your company and you shipped a major version update recently. Depending on the changes shipped, you could write a codemod that helps your users update their components automatically instead of having to do it by hand. At Salesloft, I've written multiple codemods for code updates and CLI tools for code analysis that wouldn't be possible without access to the AST[^2].

It would take a book (or three) to talk through everything we can do with ASTs, but hopefully I've piqued your curiousity. If you're interested in learning more, I highly recommend starting with [AST Explorer](https://astexplorer.net/). You can input source code for 10s of languages, parse it down to AST using many different parsers, and explore the output. Depending on the language, it may even let you right codemods right there in the browser. This has been the single greatest learning tool for me when it comes to JavaScript ASTs.

[^1]: You can view the input and output via this [AST Explorer page](https://astexplorer.net/#/gist/5751074dd7a55393aea9e32c54bbc5f4/ed5f3bd5b3baab0c02d84e89db5f591cd6648abd).
[^2]: To a degree, operating on code as data can be referred to as "meta programming". Jumping languages for a moment, Elixir code is all data under the hood (and I've been told Lisps are the same, although I'm not personally familiar). One can write [macros](https://hexdocs.pm/elixir/macros.html) that alter the code itself, not just runtime behavior. Macros can be too magic-y if overused, but in the right situation they are incredibly powerful.
