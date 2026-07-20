# `<article>` vs `<div>` — why each repo card is an `<article>`

In this app each search result (`RepoCard`) is wrapped in `<article>`, not a plain
`<div>`. This doc records why.

## Mental model: `<article>` = "a self-contained piece of content"

`<article>` means: _this chunk would still make sense on its own if you lifted it
out and dropped it somewhere else._

Think of a **newspaper**. Each article can be cut out with scissors and handed to a
friend and still make complete sense — headline, body, byline, all there.

A **repo card** is the same shape: repo name + description + stars + language +
updated. Pull one card out of the results list and it's still a complete,
meaningful unit → semantically it _is_ an article.

Classic `<article>` cases, all the same shape: blog posts in a feed, product cards
in a grid, comments in a thread, search results in a list.

## Why it matters: `<div>` is semantically invisible

A `<div>` conveys **nothing** to assistive tech. `<div><div><div>` is just "some
boxes" — no meaning, no structure. A card built purely from divs/spans is announced
as an undifferentiated stream of text:

> "facebook/react link, the library for…, JavaScript, 1.2k stars, 2 days ago"

…with no signal where one card ends and the next begins.

Swapping the outer `<div>` for `<article>` adds the one thing a div can't: a
**boundary**. It tells assistive tech "everything in here is one distinct item."

## What the boundary unlocks for a screen-reader user

1. **Grouping** — name, description, and metadata are announced as belonging
   together (one card), not loose text bleeding into the next result.
2. **Navigation** — many screen readers let users jump _article to article_
   (e.g. VoiceOver's rotor, or a "next article" command). So a user can skip
   card-by-card through results, like flipping through headlines, instead of
   arrowing through every line.

## How it pairs with `<ul>` / `<li>`

The two do different jobs and work together:

- The `<ul>` / `<li>` around the cards gives the **list** structure — "result 3 of
  10," countable, navigable as a list.
- The `<article>` gives each item its **self-contained identity** within that list.

That's also why we _don't_ make the whole results list one big `<article>` — the
list is a collection, not a single self-contained item. The article boundary
belongs at the level of the thing that stands on its own: one card.

## The test to apply

Ask: **"Would this still make sense on its own, lifted out of its surroundings?"**

- Repo card → yes → `<article>`.
- `<div className="flex items-center">` wrapping avatar + name → no, that's layout
  glue → stays a `<div>`.

The line: **`<article>` for meaningful, standalone units; `<div>` for visual/layout
wrappers.**

## In code

`src/components/RepoCard.tsx` — outer element is `<article>`.

If we need to write test, asserts `getByRole("article")` (the implicit ARIA role
of `<article>`) — i.e. the test checks the _accessibility semantic_, not the tag
name.
