---
title: Our 3 Pillars
date: 2025-07-08
category: code
series:
  id: rhapsody-architecture
  order: 3
  includeNameInPageTitle: true
hero:
  credit: https://unsplash.com/photos/a-very-tall-building-with-some-columns-on-top-of-it-4FvbC0oXyok
  image: ../../assets/hero/salesloft-architecture-three-pillars.jpg
  alt: Stone pillars holding up a heavy roof
tags:
  - Salesloft
  - Frontend Architecture
---

When embarking on a journey to a new destination, it's important to have landmarks or signposts along the way to let you know you're going in the right direction. This was how we used goals with our architecture. "Goals" in this context act as those signposts. They are not specific targets to hit or objectives to attain per se. Rather, they inform decision making as one works through the particulars of developing an architecture. The number and substance of your goals may likely differ from the ones we discuss here. What's important is that they are meaningful for your organization.

At Salesloft, we landed on three while [defining our architecture](/posts/rhapsody-architecture-defining-an-architecture).

## #1: 5 years and beyond

When I first started this project, our frontend application was about five years old, so the symmetry of "5 years and beyond" had a nice ring to it. Nearly seven years later, the principle remains: how we do set ourselves up for success far beyond just next month, next quarter, or next year? The decisions we make now can have significant effects on our codebase years from now, hopefully for the positive.

To be clear, I'm not suggesting we should stress out trying to come up with The Perfect Architecture™ that will work perfectly as designed in perpetuity. Such an architecture doesn't exist. What we create now will change and evolve over time to support the needs of the day. But are there _better_ decisions we can make today that will support that changing and evolving in the future? Absolutely. One part of this goal were the concepts of "optimizing for change" and "optimizing for deletion". What I mean by that is once code is written, it must be maintained. It will likely change over time as well. There's also a very real chance it will get deleted one day too. With that in mind, we should build our application in a way that allows us to change or delete things easily. One simple example of this is code that changes together should live together[^1].

Another aspect of this goal was staying framework agnostic where we could. We use React everywhere and utilize it heavily. We don't shy away from that. But we don't tie all of our application, particularly core platform code, to React. We made this mistake with AngularJS[^2] and we didn't want to make the same mistake twice. For example, all platform code in our frontend application is vanilla JavaScript (well, technically TypeScript) with React bindings sprinkled in where it makes sense, either via components or custom hooks. We have no plans on switching UI libraries any time soon. However, by keeping our core logic outside of a UI library, we could very quickly adapt it for another one should we need to.

All of this underpinned the actual act of removing AngularJS from the codebase. It needed to go. It had been with us for five years already then (and would end up being with us another six years). It was becoming a greater liability given the lack of security releases and shrinking pool of institutional knowledge needed to maintain it. This was one of the few aspects of the goals that was a specific attainable task.

## #2: Improve the customer experience

Our userbase was growing rapidly and whatever architecture we settled on needed to serve that userbase well. The number of users on the platform was increasing as was the number of users per tenant, which comes with its own unique problems[^3]. AngularJS – or perhaps how we wrote our AngularJS code – made it difficult to measure and improve performance. All AngularJS code was eagerly loaded at the beginning, bloating tab memory and decimating any sort of initial load metrics. AngularJS also encouraged multiple footguns, including data mutability that made it hard to trace where problems were actually originating from. We knew removing AngularJS would help significantly here, but we wanted to be mindful of how we could improve this moving forward beyond simlpy "removing Angular".

On a related note, improving initial load times and overall asset delivery strategies was a concern as well. Users typically load up our application and keep the tab open for a while so initial load times need to be reasonable but didn't need to be lightning quick. That said, at one point our frontend application was shipping a single 20MB+ JavaScript file[^4] to the customer. That's 20MB _after_ compression. And we were shipping something like 4MB of CSS. And our boot process included multiple waterfall requests to endpoints that weren't particularly speedy. Initial load times for our application were 5, 10, sometimes 20 seconds on a good connection. Even if we're not an e-commerce site where load times directly affect our revenue, that isn't acceptable.

There were plenty of nuts-and-bolts changes we made to solve this, mostly around our build toolchain, but a good architecture can inform this discussion too. How is the application bootstrapped? How does code get loaded by the application? Does a single heavy dependency in one spot of the application slow all load times down? These were questions we wanted to answer.

This spoke to a deeper principle of providing a consistent customer experience throughout the application. One may read "consistent customer experience" and first think of visual consistency. This is a part of the discussion and certainly an area in which we needed to make significant strides. There are other aspects to this as well. Do interactions behave identically across the platform? Is all content phrased and presented with a single voice? Do users who employ assistive technologies experience the site in an equivalent fashion compared to those who do not? All of this and more is part of a consistent customer experience and we wanted our architecture to support these as much as possible.

## #3: Support our engineers

<!--
1. DX is a first-class citizen
2. Make the right thing the easy thing
3. Decrease onboarding time
-->

Code isn't created in a vacuum. It's written by humans (well...mostly). And for a mature project like ours where there was significant existing code and established paradigms, supporting our engineers was a primary concern. Change management – which applies at an invididual, team, and organization level – can make or break these kinds of projects. This meant that the developer experience (DX) moving to the new architecture needed to be a first-class citizen when building out the platform. This meant writing all platform code in TypeScript

[^1]: The larger a project gets, I cannot stress enough how important colocation is.
[^2]: Arguably, it was hard _not_ to do this with AngularJS. JavaScript was not nearly as mature of a language. There was no module system yet so writing everything in Angular controllers/directives/factories/etc. made complete sense. It did make it hard to extract logic out of Angular though.
[^3]: When you have a dropdown listing everyone on the team (read: tenant), this works great when the team is only 10 people. But when there's suddenly 5,000 people on a team, things get hairy.
[^4]: 😳 🤯
