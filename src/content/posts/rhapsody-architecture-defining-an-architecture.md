---
title: Defining an Architecture
date: 2024-08-27
category: code
series:
  id: rhapsody-architecture
  order: 2
  includeNameInPageTitle: true
hero:
  credit: https://unsplash.com/photos/brown-pencil-on-white-printing-paper-fteR0e2BzKo
  image: ../../assets/hero/salesloft-architecture-defining-an-architecture.jpg
  alt: A pencil and ruler sitting on top of blueprints or schematics
---

I've [written before](/posts/being-a-software-architect-at-salesloft) about what it means to be an architect: determining direction and defining incremental steps to get there. But what if you don't know your direction yet? What if you don't even have a framework to help you determine a direction? This is where I found myself when I started on our new frontend architecture six years ago. There weren't many resources that talked about how to develop a frontend arcthitecture at the time and I struggled to figure out how to go about the process. Hopefully this post can be one such resource and serve as a meta discussion about how one can develop an architecture.

## Why this is so important

Before we go any further, we need to establish why this process is so important. Having a well-defined architecture brings massive gains to development efforts in myriad ways.

First, it provides **clarity**. With any large change, the clearer the destination, the greater the chance for success. Change is always hard, even good change. Knowing exactly where you are going brings clarity at both an individual and organizational level.

Second, it provides **motivation**. These types of projects can stretch on far longer than initially anticipated. Case in point, it's taken us almost six years to fully remove AngularJS from our codebase. Good architecture helps everyone see the finish line, the final state, and keeps them moving toward it.

Third, it provides helpful **guardrails for decision-making**. To deal with change, we typically need to know the "why" behind decisions, but the "why" is usually the first thing lost to the sands of time. The code itself (and sometimes tribal knowledge if the code is particularly thorny) can communicate _what_ decision was made. The reasoning behind it – the tradeoffs, the alternative approaches considered, etc. – doesn't stick around. A good architecture encodes these whys for everyone to refer back to.

For these reasons and more, having a well-defined architecture will provide benefits for years to come.

## Investing the time

I didn't know this going in, but looking back on it now, this process took much more time than I anticipated. That is OK. Getting large architectural changes right typically can't be rushed. I wrote recently about [background tasks in the brain](/posts/background-threads-and-rubber-ducks/). I had to do this quite a bit while developing our new architecture. Many times, my biggest breakthroughs happened when I was away from the computer. This is expected and normal.

Conversely, we cannot wait forever to start implementing our architecture. In many ways, we should expect the [architecture design to emerge](https://en.wikipedia.org/wiki/Emergent_design#Emergent_design_in_agile_software_development) even as we are imposing our new structure. It's a very symbiotic and almost paradoxical relationship. But it tracks with an iterative methodology. We should be in the continuous feedback loop of making a change consistent with our new architecture, gathering feedback, validating the change has the desired outcome, and planning the next change. It won't happen overnight. Nor does it need to. Done consistently, it will completely

## Defining the problem

The first place to start with any architecture is to define the problem(s). These may be problems the customer is having (e.g. the user cannot perform necessary tasks effectively), problems the organization is having (e.g. teams aren't able to develop and maintain their code), or problems the application itself is having (e.g. the application's performance is not meeting expectations). By defining the problem early, we know what exactly we're solving for.

As I mentioned [previously][prev], we at Salesloft had the immediate need of removing AngularJS from our codebase. We also experienced three major painpoints with our codebase:

1. Ownership
2. Dependency management
3. Opaque interdependencies

Any architecture we settled on would need to address each of these to some extent. We also knew there were aspects of our workflows at Salesloft we wanted to maintain. Our teams had fairly high degrees of autonomy in making changes to their parts of the frontend application. We didn't want this to change. That autonomy kept their velocity high by preventing unnecessary gatekeeping. With the inevitable changes a new architecture would require, we knew we would have to support our developers well through the process.

This would also necessitate us embracing rethinking as well. New architectures are usually implemented as incremental improvements but they are in-total tectonic shifts in how we build our applications. As we're defining the problem, we need to be open to any and all solutions at the beginning before we start narrowing down what works for us.

## Searching for prior art

With a well-defined set of problems, it's helpful to look to the community to see how they are solving similar issues. Perhaps there are solutions out there that fit your use-case. As I looked for prior art that would address the problems we had, the topic that kept coming up was microfrontends. I didn't have a good grasp on what that would look like for our organization until I walked into Erik Grijzen's talk at [Connect.Tech](https://connect.tech/) in 2019 about New Relic's upcoming New Relic One project. In his talk, Erik walked through New Relic's new frontend architecture and how it all worked. This was fascinating to me hearing how an organization just a few years ahead of Salesloft was building large frontend applications. Two important concepts I took from the talk were 1. having strong conventions about how UI is injected and presented to the user and 2. having a standardized set of tooling and packages to build with. Microfrontends were an interesting idea and one that I wanted to take bring into the next part of the process.

An orthogonal but related idea in this sphere was monorepos. Today, monorepos are everywhere. But six years ago, they were not nearly as common. What appealled to me about monorepos was the centralized management, standardization, and tight feedback loop of monorepos. If every team is working in a separate repo, any changes at the platform and infrastructure level – e.g. build pipeline, linters and formatters, localization, deprecated depencencies, etc. – take much longer to propagate. Keeping code in a single repo makes much of these changes far easier as they only need to happen once.

These were were excellent finds in the community, but there wasn't anything that exactly fit our use case. It was time to take what we had gathered and iterate on it.

## Making it our own

After gathering information from the community, it's time to start crafting it into a solution that works for you. This requires fully contextualizing what you've found with the unique requirements, needs, and constraints of your project. This assumes of course that you are familiar with the unique requirements, needs, and constraints of your project. Knowing these is one of the most crucial aspects of this process. If you don't know your domain well, it's difficult to know how to apply abstract ideas in a productive fashion.

What I found in the community regarding microfrontends and monorepos was raw material. It still had to be refined into a form we could use for our own purposes at Salesloft. This is where making it our own came into play. For instance, microfrontends – even ones as well regulated as New Relic's – were not going to work for us. We didn't have the personnel or bandwidth to split our frontend application into many different repos. However, there were aspects of microfrontends that spoke directly to our pain points of ownership and dependency management.

I started synthesizing a list of these raw materials that would be helpful in our new architecture, noting their pros and cons, what problems they solved, and how they might be implemented. As themes and patterns began to emerged, I also took time to define goals for our architecture, north stars that would help guide our architectural choices. With our problems well-defined, our list of raw materials categorized and tied back to problems, and our goals set, it was time to start sketching out what our architecture should actually look like.

_In the next series article, I'll walk through the goals – or "pillars" – we established for our architecture. The article after that will break down what our final architectural plan looked like._

## Preparing for the road ahead

If you're attempting this, first know that you are not alone! Plenty have done this before and are here to help. Two pieces of advice as you work through this. First, expect false starts. Not everything goes smoothly. Not everything we plan works as intended. We may need to double-back, iterate, tweak, and change on the fly. Second, done is better than perfect. It's easy with these types of projects to idealize our solution and want everything to be just right at the end. That's not how real-world projects work. A good solution shipped is worth infinitely more than a great solution that doesn't.

[prev]: ./rhapsody-architecture-where-we-started
