---
title: 'Scaling Myself: Adjusting to a Staff Role'
date: 2024-08-10
category: learning
hero:
  credit: https://unsplash.com/photos/running-field-during-daytime-52p1K0d0euM
  image: ../../assets/hero/scaling-myself.jpg
  alt: A measuring tape
---

It's been just over two years since I was promoted to Staff Software Architect at Salesloft. My then-manager, Daniel, and I had numerous conversations before and after the promotion regarding how my day-to-day needed to change as I transitioned into a staff-level role. Through all the conversations, a constant theme emerged: I needed to scale myself. The work I had done up to that point needed to be spread out further across the organization. Our discussions produced four concrete steps I could take to effectively scale myself. Here's what I did:

## #1: Architecture mentorship cohort

Salesloft has a 1:1 mentorship program in our ProdDev org and I'm proud to have served as a mentor in it before. But as I was moving into a staff role, I wanted to do something a little different beyond a solely 1:1 experience. To that end, I founded a mentorship cohort with the goal of working with a small group to supercharge their technical leadership skills. The cohort members (or "cohortians" as I like to call them 😂) and I would meet on a regular basis as a group to discuss architecture-related topics. Perhaps more importantly, the group discussions were also an opportunity for the members to share technical problems and solutions with each other and receive peer feedback. In parallel, I would have one-on-ones with each member to address specific questions, help them focus on their areas of expertise, and provide feedback before they shared with the group. Daniel and I then identified four individuals at the senior or senior+ level who would be candidates to join. We asked each person to commit to the cohort which was an important step as being a part of the cohort would require a time and energy investment on their part. Thankfully, all four individuals were on board!

The cohort has gone well so far. Each member has presented to the group at least twice and the feedback Daniel gathered in a series of skip-level meetings has all been positive. One thing I will change for the next cohort is bringing each member's manager into the process earlier to give the managers more visibility into the process. I still need to document this cohort program so it can be used by others in future.

## 2: Coding in Public™

I am the kind of person that needs to stay hands-on-keyboard to some extent. I don't think I could work in a software engineering job where I wasn't able to write code (see: why I'll never become an engineering manager). However, hands-on-keyboard time is at a premium as a staff architect. Was there a way for me to stay hands-on while still leveraging that time for the larger organization? Turns out, there was! I started running what I call Coding in Public™ session two to three times a week where I run an internal livestream of work I'm doing for anyone in the ProdDev org that wants to watch. The actual experience is more of a hybrid between a livestream and [mob programming](https://en.wikipedia.org/wiki/Mob_programming) as the sessions are very conversational and collaborative. I take time to set context around the work being done as well as walk through the steps of how we're going to build a given thing. These sessions have been an excellent opportunity for people in different roles or on different teams to engage with some of the gnarlier problems I tend to tackle. We record each one too and there are many people who keep up with the sessions after the fact via the recordings.

> Look for a blog post in the coming weeks on how to run these kinds of internal livestreams yourself!

## 3: Scheduled architecture research time

One of the responsibilities of an architect at Salesloft, particularly of a staff-level architect, is to be involved with research projects. These projects are focused on larger, cross-cutting platform concerns as opposed to improving a single service or product area. Some recent topics include globally distributed database solutions, feature flag management services, and database autoscaling capabilities. Architects should be able to allocate "20% time" to these projects, but I've historically found this to be difficult to do as my normal delivery team work would always be prioritized. To fix this, I made the small change of scheduling all my research time on my calendar. Some of you are rolling your eyes right now because you've done this for years. And you're right. This was a really small change and something I wish I had been doing much sooner because it works well for me. I started scheduling research time and was able to easily meet the research deadline for my last project (the one about feature flag management services) while still balancing delivery team work.

## 4: Documentation

Writing things down is hard. At least it is for me. And in the conversations I've had with countless others both inside and outside Salesloft, it's hard for them too. But this is essential to scaling oneself. I needed to get things out of my head and down on paper. This needed to be tackled a few different ways. I already mentioned the Coding in Public sessions/recordings. We spun up a documentation portal for our primary frontend app/monorepo and I've been contributing to that on a regular basis. Lately, I've been focusing a good bit on documenting the "why" behind decisions. The "what" for a decision is typically obvious via commits and pull requests in our version control systems. But "why"s tend to get lost over time. This has included more thorough PR descriptions and commit messages, and we're currently looking at publishing [ADRs](https://www.redhat.com/architect/architecture-decision-records) to better capture "why"s as well.

## And on it goes

These are four ways I've been utilizing to better scale myself as I get deeper into my career. I haven't executed on them perfectly, but in aggregate they have definitely increased my impact in the organization. I hope these examples are helpful to you as you continue in your career.
