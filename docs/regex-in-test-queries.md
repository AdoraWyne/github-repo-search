# Regex in test queries

Testing Library's `getByRole(role, { name: ... })` matches an element by its
**accessible name** (usually its label). Passing a **regex** instead of a plain string
makes the match flexible, so a test doesn't break over a small label styling choice
(a capital letter, a space vs. an underscore).

Example from `PageSizeSelect.test.tsx`:

```ts
screen.getByRole("combobox", { name: /per.?page/i });
```

## `/per.?page/i` token by token

| Part      | Meaning                                                              |
| --------- | ------------------------------------------------------------------- |
| `/ ... /` | delimiters of a **regex literal** in JS                             |
| `per`     | the literal characters `p`, `e`, `r`                                |
| `.`       | **any single character** (space, letter, underscore, hyphen, …)     |
| `?`       | **zero or one** of the token right before it (here, the `.`)        |
| `page`    | the literal characters `p`, `a`, `g`, `e`                           |
| `i`       | **case-insensitive** flag (comes after the closing slash)           |

`.?` together = *"an optional single character"* (zero or one of anything).

Whole pattern: **"per", then optionally one character, then "page" — ignoring case.**

## What it matches (and doesn't)

| String                | Matches? | Why                                   |
| --------------------- | -------- | ------------------------------------- |
| `Per Page`            | ✅       | `.` = the space; `i` ignores capitals |
| `per page`            | ✅       | `.` = space                           |
| `per_page`            | ✅       | `.` = underscore                      |
| `per-page`            | ✅       | `.` = hyphen                          |
| `perpage`             | ✅       | `.?` matches **zero** characters      |
| `PER PAGE`            | ✅       | `i` flag                              |
| `per  page` (2 spaces)| ❌       | `.?` allows only **one** char         |

## Caveat: `.` is a wildcard

`.` matches *any* character, so `/per.?page/i` is slightly too permissive — it would also
match nonsense like `perZpage`. Harmless when there's only one matching element on the
page, but if you want to be precise, spell out the allowed separators with a **character
class**:

```ts
/per[\s_-]?page/i   // optional whitespace, underscore, or hyphen — nothing else
```

`[\s_-]` = "a whitespace **or** underscore **or** hyphen". The `?` still makes it optional.

## Quick reference — regex bits used in test names

| Pattern    | Means                                             |
| ---------- | ------------------------------------------------- |
| `.`        | any one character                                 |
| `?`        | zero or one of the preceding token                |
| `*`        | zero or more of the preceding token               |
| `+`        | one or more of the preceding token                |
| `[abc]`    | one character from the set `a`, `b`, `c`          |
| `[\s_-]`   | one whitespace, underscore, or hyphen             |
| `\d`       | one digit                                         |
| `^` / `$`  | start / end of string (anchor an exact match)     |
| `/.../i`   | case-insensitive flag                             |

> Tip: a **plain string** in `{ name: "Per Page" }` is a *substring, case-sensitive*
> match. Reach for a regex only when you want flexibility (case, separators) or an exact
> anchored match (`/^Per Page$/`).
