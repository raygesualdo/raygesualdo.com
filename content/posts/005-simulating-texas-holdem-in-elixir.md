---
title: Simulating Texas Hold'em in Elixir
date: 2018-08-28
category: code
---

A few weeks ago, [Todd Sharp](https://twitter.com/recursivecodes) wrote an article called ["Simulating Texas Hold'em in Groovy"](https://recursive.codes/blog/post/40) where, no surprise, he simulated a Texas Hold'em hand in Groovy. At the end of the article, he welcomed others to do the same in different languages. I've started looking into Elixir recently and thought it would be a great language in which to replicate the experiment as best I could.

For those unfamiliar with Texas Hold'em, I'll quote Todd's article as he includes a helpful explanation.

> If you're not familiar with Texas Hold'em the game is pretty straightforward: 2 to 10 players each receive two down ("hole") cards and then five community cards are dealt face up in three stages: three at first (called the "flop"), then two rounds of one card (called the "turn" and the "river" respectively). A card is "burned" or discarded prior to each round of community cards. The players make their best five card poker hand using the seven cards - their two hole cards and the five community cards. They can use any combination - use of the hole cards is not necessary to make their "best" hand. That's pretty much all there is to it - I won't get into betting or strategy here as that's beyond the scope of the discussion for these purposes.

With our poker knowledge now fully intact, let's dive in. While I could have kept all the logic in a single Elixir script file (`.exs`), I decided to create a whole project.

```shell
mix new texas_holdem
```

Next, I created a separate module called `TexasHoldem.Deck` that would manage the deck lifecycle, from shuffling all the way through to the river.

```elixir
defmodule TexasHoldem.Deck do
  @moduledoc """
  Module to manage a card deck's lifecycle
  """
end
```

The first thing I added to the module were module attributes to hold all the possible suits and ranks for a card deck.

```elixir
@card_suits ["❤️", "♠️", "♣️", "♦️"]
@card_ranks ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
```

I also created some types so I could correctly annotate the functions in the module. I created one to represent a `card` that was of type `String.t()`. I then created a `deck` type that was a list of `card`s. Finally, I created a `hands` type, a list of list of cards, to represent the cards dealt to each player to start the game.

```elixir
@type card :: String.t()
@type deck :: [card]
@type hands :: [[card]]
```

Now I had the values and types I needed to create and shuffle a deck. I decided to put these two concerns (creating and shuffling) in the same function since we'd always need our deck shuffled to begin with. I did, however, break the deck creation out into it's own private function for clarity. To create the deck, I mapped (actually, flat mapped; more on that in a second) over each suit. In the map function, I mapped again over each rank and concatenated each rank with the current suit. However, I now had a list of lists. I wanted a list of each card without any nesting, so I utilized `Enum.flat_map` for the first map. The last step was to call `Enum.shuffle()` on the resulting deck. Voila! A shuffled deck of cards.

```elixir
@doc """
Create and shuffle a deck
"""
@spec shuffle() :: deck
def shuffle do
  create_cards_list() |> Enum.shuffle()
end

defp create_cards_list do
  Enum.flat_map(@card_suits, fn suit -> Enum.map(@card_ranks, fn rank -> rank <> suit end) end)
end
```

I could now create a shuffled deck of cards. The next step was to deal hands out to each player. Before we look at the logic to deal out hands, let's take a look at the logic to deal out N number of cards as that will be used both by the initial deal as well as for the flop, turn, and river.

I wanted to create a `deal/2` function that would handle dealing an arbitrary number of cards. This means it would have to pull N number of cards from the top of the deck (read: head of the list) and return both the list of dealt cards as well as the remaining deck. To do this, I wrote a recursive `deal/3` function that takes the deck, the number of times to iterate (number of cards to deal), and the current list of dealt cards. The first `deal/3` has a guard to handle when we've dealt all the cards we need. The second `deal/3` pops the top card off the deck and then calls itself again, decrementing `timesRemaining` and adding the new card to the list of already dealt cards. The final return value of this function is a tuple of dealt cards and the remaining deck.

```elixir
@doc """
Deal N number of cards
"""
@spec deal(deck, non_neg_integer()) :: {[card], deck}
def deal(deck, times) do
  deal(deck, times, [])
end

defp deal(deck, timesRemaining, cards) when timesRemaining === 0, do: {cards, deck}

defp deal(deck, timesRemaining, cards) do
  {card, deck} = List.pop_at(deck, 0)
  deal(deck, timesRemaining - 1, cards ++ List.wrap(card))
end
```

OK, I now had a function `deal/2` that can deal an arbitrary number of cards for us. The next step was to actually deal out the initial hands to each player. This is honestly where I got tripped up the most. It took me a few tries to come up with the correct logic to handle this correctly. I'll walk you through what I tried as well as what I eventually ended with. Here's where I started:

```elixir
@doc """
Initially deal hands to each player
"""
@spec initial_deal(deck, Integer.t()) :: {hands, deck}
def initial_deal(deck, player_count) do
end
```

Given a shuffled deck of cards and a number of players, I wanted to return the hands for each player (a list of lists) and the remaining deck of cards. In Todd's code, he used multiple loops to deal out the cards. I decided to start there. Spoiler alert: it didn't work.

```elixir
def initial_deal(deck, player_count) do
  hands =
    Enum.map(0..1, fn _ ->
      Enum.map(0..(player_count - 1), fn _ ->
        {card, deck} = deal(deck, 1)
        card
      end)
    end)
    |> List.zip()

  {hands, deck}
end
```

The elixir masters out there are probably having a good laugh at that code. On the surface, it doesn't seem like a terrible solution. Map twice (`0..1`) for the number of cards in each player's hand then map again for each player (`0..(player_count - 1)`), grabbing a card off the top of the deck and zipping those cards up into hands. Spot the problem though? `deck` isn't mutable. The above code was always pulling the same card off the top of the deck. Assuming the top card on the deck was `K❤️`, the players hands looked like this: `[["K❤️", "K❤️"], ["K❤️", "K❤️"]]`. `List.zip()` wasn't doing what I wanted either, but since the loops were inherently flawed, I didn't bother finishing the data transformation at the end.

I googled something along the lines of "iteration in Elixir" and found the section on the Elixir website (which has amazing documentation, by the way 😍) about generators. It seemed like they might get me closer, so I tried using some generators, but ran into the same problem I had with `Enum.map`. The code is similar to the first iteration, except I'm using `for` instead of `Enum.map` and I added a little data transformation at the end, but `deck` still isn't mutable and the same card was always being pulled off.

```elixir
def initial_deal(deck, player_count) do
  hands =
    for _ <- 0..1 do
      for _ <- 0..(player_count - 1) do
        {card, deck} = deal(1, deck)
        card
      end
    end
    |> List.zip()
    |> Enum.map(fn {a, b} -> a ++ b end)

  {hands, deck}
end
```

Eventually, I realized I could go about dealing the hands in a more algorithmic way. To accomplish this, I could:

1. deal out twice as many cards as players,
2. split those cards into two lists,
3. zip those lists (where the first card from each list is placed in a tuple, the second cards are placed in a tuple, etc.), and
4. convert the tuples to lists to get what I needed.

Below is where I landed with comments showing the return value for each function in the pipeline.

```elixir
def initial_deal(deck, player_count) do
  {cards, deck} = deal(deck, player_count * 2, [])

  hands =
    cards
    # ["2♣️", "10♠️", "7♣️", "A❤️", "8♦️", "7♠️", "Q❤️", "4♦️", "6♠️", "K♠️"]
    |> Enum.split(player_count)
    # {["2♣️", "10♠️", "7♣️", "A❤️", "8♦️"], ["7♠️", "Q❤️", "4♦️", "6♠️", "K♠️"]}
    |> Tuple.to_list()
    # [
    #   ["2♣️", "10♠️", "7♣️", "A❤️", "8♦️"],
    #   ["7♠️", "Q❤️", "4♦️", "6♠️", "K♠️"]
    # ]
    |> List.zip()
    # [
    #   {"2♣️", "7♠️"},
    #   {"10♠️", "Q❤️"},
    #   {"7♣️", "4♦️"},
    #   {"A❤️", "6♠️"},
    #   {"8♦️", "K♠️"}
    # ]
    |> Enum.map(&Tuple.to_list/1)
    # [
    #   ["2♣️", "7♠️"],
    #   ["10♠️", "Q❤️"],
    #   ["7♣️", "4♦️"],
    #   ["A❤️", "6♠️"],
    #   ["8♦️", "K♠️"]
    # ]

  {hands, deck}
end
```

Here's the full function code again without the comments:

```elixir
@doc """
Initially deal hands to each player
"""
@spec initial_deal(deck, Integer.t()) :: {hands, deck}
def initial_deal(deck, player_count) do
  {cards, deck} = deal(deck, player_count * 2, [])

  hands =
    cards
    |> Enum.split(player_count)
    |> Tuple.to_list()
    |> List.zip()
    |> Enum.map(&Tuple.to_list/1)

  {hands, deck}
end
```

I was pretty pleased with how this function turned out, considering how much time it took me to figure out how to iterate correctly (meaning not using iteration at all). I'm sure there's a better way to get from 10 cards to a zipped list of lists of those cards, but I don't know it...yet.

Now I could handle the initial deal using `initial_deal/2` as well as subsequent deals of the flop, turn, and river with `deal/2`. Last thing to do was to add a function for burning a card (removing one card from the top of the pile). That function turned out to be very straightforward. We simply call `tl/1` on the deck to get the list minus the head.

```elixir
@doc """
Remove a card from the top of the deck
"""
@spec burn_card(deck) :: deck
def burn_card(deck), do: tl(deck)
```

With that, the `TexasHoldem.Deck` module was done. I had all the functions I needed to handle a Texas Hold'em game. It was time to call all these functions in `TexasHoldem.main/0` and play out the hand.

I wanted to be able to see the results of the functions as I went, so I added a `print_result/2` function to my `TexasHoldem` module that would take the result of a previous operation (a `deck` alone or a tuple of the previous operation result and `deck`), log it out with a message and pass the remaining `deck` of cards along.

```elixir
defp print_result({result, deck}, message) do
  IO.puts(message <> inspect(result))
  deck
end

defp print_result(deck, message) do
  IO.puts(message <> inspect(deck, limit: 52))
  deck
end
```

I also added `alias TexasHoldem.Deck` to my module. With that, `main/0` was ready to be written. First, I called `Deck.shuffle/0` to create a shuffled deck, piped the deck to `Deck.initial_deal/2` to deal hands for players (in this case, 5 players), and called `Deck.burn_card/1` and `Deck.deal/2` together three times to deal the flop, turn, and river.

```elixir
def main do
  Deck.shuffle()
  |> print_result("Shuffled Deck --> ")
  |> Deck.initial_deal(5)
  |> print_result("Player Hands --> ")
  |> Deck.burn_card()
  |> Deck.deal(3)
  |> print_result("Flop --> ")
  |> Deck.burn_card()
  |> Deck.deal(1)
  |> print_result("Turn --> ")
  |> Deck.burn_card()
  |> Deck.deal(1)
  |> print_result("River --> ")

  :ok
end
```

Here is the resulting console output from calling `TexasHoldem.main/0` in `iex`:

```shell
Shuffled Deck --> ["Q♠️", "7♣️", "10♦️", "Q♣️", "9♦️", "A♣️", "10♣️", "5♠️", "A♠️", "7♠️", "6❤️", "9♠️", "7❤️", "7♦️", "A❤️", "6♦️", "8♠️", "J♠️", "4❤️", "5♦️", "J❤️", "9❤️", "K♠️", "5♣️", "Q♦️", "3♣️", "J♦️", "2♠️", "9♣️", "8♣️", "3♠️", "4♣️", "6♣️","Q❤️", "J♣️", "2♦️", "4♦️", "2♣️", "3♦️", "K❤️", "K♦️", "8❤️", "2❤️", "6♠️", "10❤️","K♣️", "4♠️", "8♦️", "A♦️", "3❤️", "5❤️", "10♠️"]
Player Hands --> [["Q♠️", "A♣️"], ["7♣️", "10♣️"], ["10♦️", "5♠️"], ["Q♣️", "A♠️"], ["9♦️", "7♠️"]]
Flop --> ["9♠️", "7❤️", "7♦️"]
Turn --> ["6♦️"]
River --> ["J♠️"]
```

That's it. A Texas Hold'em hand in Elixir. I'm still in the early days of learning Elixir, so there's bound to be parts of this script that can be improved, but overall I'm pleased with where I landed. The [repo with this code](https://github.com/raygesualdo/texas-holdem-example/) is up on GitHub. Check it out.

---

Are you learning Elixir too? Or maybe you're an Elixir veteran? Chat with me about it on [Twitter](https://twitter.com/RayGesualdo)!
