---
title: Keep Repos Clean with Global .gitignore and a Scratch Directory
date: 2022-02-11
category: process
---

There are times I need to write scripts, save some JSON files, or do other things in a repo that create files that shouldn't be git-controlled. I'll often create these files when doing exploratory work or analysis on a codebase. I know there's `git stash` and other mechanisms for tracking these files, but I don't really need them to be tracked. I came up with a different solution that's worked really well for me. In any repo I'm working in, I create what I call a "scratch directory" to hold these files. I happen to use the naming convention `_ray` because the underscore keeps the directory at the top of directory listings and the rest makes it pretty clear that I created it 😁 I ensure these scratch directories are never checked into git by creating a global .gitignore file for the directory `_ray`. The steps to do so are pretty simple.

```shell
echo '/_ray' > ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

With that, I can add any and all files I want to any directory named `_ray` at the root of a git repo. Child directories named `_ray` would still be included; to include all child directories, remove the `/` from the front of the ignore pattern. Also, these commands only work on Mac/Linux. They'll have to be adjusted if you're using Windows. Hope this was helpful!

---

Have thoughts about this blog post? Chat with me about it on [Twitter](https://twitter.com/RayGesualdo)!
