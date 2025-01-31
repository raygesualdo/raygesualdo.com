---
title: Caching Auth Tokens with Distributed Refresh
date: 2024-03-09
category: code
hero:
  credit: https://unsplash.com/photos/thunderstorm-with-lightning-trnTvywx2Rg
  image: ../../assets/hero/thundering-herd.jpg
  alt: A massive thunderstorm
tags:
  - JavaScript
  - TypeScript
---

Ever been in this situation? You make an innocuous change to your authentication logic only to realize upon deploy that it invalidated all your users' sessions. Even worse, they're all trying to reauthenticate at once. So now every client is trying to re-authenticate to your system at the same time. Worse still, your authentication re-auth logic means you're going to have a [thundering herd problem](https://en.wikipedia.org/wiki/Thundering_herd_problem) every 5 minutes when the clients request new credentials.

Maybe this scenario resonates; maybe it doesn't. It definitely resonates with us at Salesloft because a few years ago this is exactly what happened. We made a seemingly innocent change to our [IdP](https://en.wikipedia.org/wiki/Identity_provider) microservice which caused every user session in our main frontend SPA to try to re-auth at the same time, requesting a new [JWT](https://jwt.io/) token from our IdP service. It almost brought down our entire system. The token refresh logic at the time was set to refresh every 5 minutes. Not only did we almost bring down our system, but we were doing so every 5 minutes because now all users were on the exact same refresh interval. Thanksfully, we deployed an immediate fix and stabilized the system. But knew we could improve the refresh logic to prevent thundering herd problems in the future.

> The work I'm about to walk through was done by [Steve Bussey](https://twitter.com/YOOOODAAAA) and [Matt Thompson](https://twitter.com/Mattyice_Dev) so while I get to share this helpful pattern, the implementation is theirs. Thanks fellas!

Our exact implementation is tightly tied to our particular setup so I've generalized and simplified it with before/after comparisons. Here is what the token fetching logic looked like prior to the change:

```ts
import NodeCache from 'node-cache'

const cache = new NodeCache({ checkperiod: 0 })

export async function getToken() {
  const cachedValue = cache.get('token')

  if (cachedValue) return cachedValue

  const token = await fetchToken()
  cache.set('token', tokenData, 5 * 60)
  return token
}
```

We're using the [`node-cache`](https://www.npmjs.com/package/node-cache) library because it has a built-in TTL capability that uses wall-clock time checks instead of `setTimeout`[^1]. When `getToken` is called, it checks for a non-stale token in the cache. If there is one, we return it immediately. If not, we fetch a new one, cache it for 5 minutes, and return it.

This worked fine until the authentication issue I mentioned at the start. Turns out we needed to add some [jitter](https://en.wikipedia.org/wiki/Jitter) to the refresh interval. Instead of refreshing every five minutes, we wanted it to refresh randomly between 50% and 90% of the JWT's expiration time – ours is 10 minutes which makes the math easy. This randomness would ensure that any large spikes in initial traffic after an authentication change would immediately smooth out, leading to an even distribution over time.

Here is the updated code:

```ts {11-12}
import NodeCache from 'node-cache'
import jwtDecode from 'jwt-decode'

const cache = new NodeCache({ checkperiod: 0 })

export async function getToken() {
  const cachedValue = cache.get('token')

  if (cachedValue) return cachedValue

  const { token, utcNow } = await fetchToken()
  cache.set('token', tokenData, getCacheTTLInSeconds(token, utcNow))
  return token
}

function getCacheTTLInSeconds(token, utcNow) {
  const expiration = jwtDecode(token).exp || 0
  return getRandomlyDistributedTime(expiration, utcNow)
}

function getRandomlyDistributedTime(expiration, utcNow = Math.floor(new Date().getTime() / 1000)) {
  const secondsUntilExpiration = expiration - utcNow
  const max = secondsUntilExpiration * 0.9
  const min = secondsUntilExpiration * 0.5

  const randomDistributedTime = Math.floor(Math.random() * (max - min)) + min

  return Math.min(9 * 60, Math.max(randomDistributedTime, 5 * 60))
}
```

The big difference here is the `getCacheTTLInSeconds(token)` call when setting the token in the cache. `getCacheTTLInSeconds` decodes the JWT to get its expiry time and passes that in to `getRandomlyDistributedTime`. `getRandomlyDistributedTime` calculates the duration between now and the expiration time in seconds, the `max` time by multiplying the duration by `0.9`, and the `min` time by multiplying the duration by `0.5`. With those values, we can generate a random time between them using `Math.random` and a few additional calculations. As a safety measure, we clamp the value between 5 and 9 minutes before returning it.

So what's the deal with `utcNow`? This was a more recent addition after we discovered an edge case in our code. `utcNow` comes from the server generating the JWT. We don't want to use `Date.now()` on the user's computer because they might have set their system clock to a different time. We ran into this exact issue where users had set their system time in the future such that their local `utcNow` was already beyond the JWT's expiry time. This is the reason we added the clamp on the last line of `getRandomlyDistributedTime` as well. Without the server `utcNow` and the clamp, these users were requesting new JWTs 1000s of times an hour instead of 6-12. With the fix, they fell within the normal ranges once again.

That's it. Our tokens now refresh in a randomly distributed fashion within the 50%-90% expiry window using the server's time as the basis for determing expiry. Adding this randomly distributed jitter has kept our IdP service much happier over the years. I highly recommend this approach if you are fetching tokens similarly.

[^1]: This matters because when users put their computer to sleep – perhaps closing their laptop – using `setTimeout` will be suspended until after the user wakes their computer up. Because our JWTs have a short expiration (a solid security practice in general), this suspended `setTimeout` would wait too long to mark the cached JWT as stale and refetch a valid token. Using wall-clock time checks avoids this edge-case entirely.
