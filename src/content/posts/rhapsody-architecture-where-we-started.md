---
title: Where We Started
date: 2024-03-16
category: code
series:
  id: rhapsody-architecture
  order: 1
  includeNameInPageTitle: true
hero:
  # https://unsplash.com/photos/running-field-during-daytime-52p1K0d0euM
  image: ../../assets/hero/salesloft-architecture-where-we-started.jpg
  alt: A starting line
---

Over the past 6 years, Salesloft has been transitioning from AngularJS to React. Along with that transition, we have focused heavily on developing an architecture that will scale with us now and far into the future. It's been quite the journey. Sharing this journey is particularly important to me because it has been my primary focus for almost my entire time at Salesloft. Additionally, there aren't many resources – blog posts, conference talks, etc. – about the process of "scaling to medium" as I sometimes call it. So join me as I walk through the thought processes, learnings, mistakes, implementations, and reflections of the past 6 years in a new series about Salesloft Frontend Architecture.

## Setting the scene

If you're not familiar, let me introduce you to Salesloft so you have an idea what kind of product we build. Salesloft is a revenue orchestration platform for full-cycle sellers. Unless you have a background in sales, that probably doesn't me much to you (nor did it me when I first started). I like to say we help sellers focus on the right things in order to take the right actions at the right time so they can connect more authentically with their customers.

To provide some numbers as to how we've grown, when I started in 2018, we were about 30 engineers strong with 10 contractors working alongside us. Today, we are 125 engineers strong[^1]. We added headcount very quickly, especially during the economic boom post-Covid. Our numbers would be much larger if the current economic downturn hadn't happened. This also doesn't capture the natural churn we've had as engineers have moved on to other opportunities[^2]. On the users side, we've gone from about 15k weekly active users (WAUs) to 90k+ WAUs today. Our product is mission-critical for our customers. Many salespeople spend 7, 8, 9+ hours a day in our app. So while our number of users may be not be huge, the app is heavily exercised by those using it. In terms of code, we've gone from ~170k lines of code to 1.14M today. That's ~41% growth year-over-year for the past five and a half years. Our backend services have jumped from 5 to almost 100, and our original Rails monolith itself doubled in size amidst all these new microservices.

## Start at the beginning

Now that we've established Salesloft and a bit about how we've grown, let's jump back in time five and a half years to when this process all started. The year is 2018. I'd been working at Salesloft for about 6 months. In that time, quite a few things happened very quickly regarding our frontend code.

First, we split our frontend application out from our Rails monolith. The Salesloft platform started as a single Rails service with server-rendered pages, as did most startups in the mid-2010s. We eventually added AngularJS as the need for client-side interactivity increased. The frontend code continued to grow and it because clear that splitting the code out into its own repo was necessary. It didn't need to be tied in to the build and deploy process of our Rails app anymore. The eminent [Tim Door](https://twitter.com/timdorr) did this for us (he was a founding engineer at Salesloft). The new repo, named Rhapsody[^3], quickly became our most active and worked-in repo across the entire organization.

Second, I split off a group of components into a new repo that would eventually become our design system. We had a single folder in what was now Rhapsody that contained a set of shared UI components, solid building blocks like buttons, input fields, etc. Moving these to their own repo allowed us to use them across multiple surface areas[^4]. It also layed the foundation for thinking more in terms of componentization and reusability.

Third, we made the official decision to migrate to React off of Angular. AngularJS was being sunset by Google and we needed a plan for what to move to. A small team used React to build out a new section of our Chrome extension as a sort of trial run. The process went well and most everyone agreed that React would be AngularJS' successor. By the time I joined the company, there were already a number of React components in Rhapsody and that number was increasing rapidly.

Amidst all these changes, we knew there was more that needed to be done architecturally to prepare and sustain growth. We knew this mostly from the pain we were experiencing working within our current structures.

## The problems we experienced

As we reflected on our experiences up til now, we identified three specific pain points we had with our current codebase.

1. **Ownership**: Our code was one giant ball of spaghetti. It was diffult to find things and, more importantly, it was difficult to know who owned what code. Often times, we'd use `git blame` to see who touched a particular chunk of code and reach out to them. Other times, tribal knowledge would dictate that a certain team owned a certain part of the app. Neither of these were scalable. Code ownership is vital as a codebase scales. When a bug is reported, or a security defect comes in, or an old part of the codebase that hasn't been touched in years needs to be updated, knowing exactly who to go to is vital. The adage "if everyone owns the code then no one owns the code" was proven out time and again for us. Parts of the code everyone used would either rot, or would be extended and expanded so many times they became an unrecongizable Frankestein's monster. We needed explicit definitions of who owned what.

2. **Dependency management**: Regardless of codebase size, one has to deal with dependencies. Some are deprecated or abandoned by their contributors. Others are updated frequently and need to be bumped on a regular basis. Others have security issues or bugs that needs to be ameliorated. We started by having one set of dependencies for the entire codebase. This proved extremely challenging over time as we added more code, more teams, and more dependencies. Heavily-used, cross-cutting dependencies were exceedingly difficult to upgrade. Old dependencies that needed to be removed were hard to carve out. We needed better mechanisms and processes to manage our dependencies.

3. **Opaque interdependencies**: As I already mentioned, Rhapsody was spaghetti. We had code depending on or being depended on by other bits of code all across the repo. There was no organization, guard rails, or structure to how code was inter-related. This made changes and refactoring much harder. A team would go to update or improve their area of the code only to find that another team (or five other teams!) had imported some file of theirs and they were now stuck with the old code for the foreseable future. We needed crystal clear delineations between parts of the codebase and enforced isolation to prevent the same spaghetti mess from happening again, just with a different framework.

There were other issues that needed to be addressed as well - many of which we will discuss in later articles - but these were immediate and perennial issues that required solutions. Any architecture we instilled needed to address all three of these.

## Growth equals opportunity

"Growth equals opportunity" was a common adage of our founding CEO, Kyle Porter. And he was absolutely correct. When companies are growing, particularly at the rate we were, there are always opportunities to "learn more, do more, and become more" (another one of his sayings). Our frontend codebase – Rhapsody – was no exception. Despite all the pain points we were experiencing, the growth trajectory we were on was exciting and opened up new opportunities for us to learn how to scale it well. As I would come to realize, the next step in the process would be figuring out how to determine a frontend architecture in the first place. We'll explore that in the next article. I hope you will join me for this journey as we delve deeper into how we architected our frontend at Salesloft.

[^1]: This number represents only the engineers working on the product. This doesn't include management, design, DevOps, QA, or data science roles since few of them ever work in our frontend codebase.
[^2]: When I was hired, I was right around employee #250. Now, I'm around employee #50 in terms of tenure, maybe closer to 40. We used to use a tool called Pingboard which made it really easy to figure out where you stood, but that's been gone for a year or two now.
[^3]: I'm going to use the words "Rhapsody", "repo", and "codebase" to refer to the same thing: our primary frontend application's code. As to "rhapsody", the Rails monolith is named Melody, so we stuck with the musical theme.
[^4]: We have two Chrome extensions (one on Manifest v2 that's being sunset and a new one on Manifest v3) as well as a few small UI projects that make use of the design system components as well.
