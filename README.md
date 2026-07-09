# TODO:

Goals:

- Trying to return the mocked data from MSW handlers with q=react&page=1&per_page=2.
- Problem at src/components/SearchInput.tsx, line 17 and line 18:
  ```ts
  setQueryAndResetPage(trimmed);
  setPerPage(2);
  ```
- setPage(2) will overwrite setQueryAndResetPage(trimmed), so when I hit submit, it gives me back this url: `/?per_page=2`, instead of `/?q=react&page=1&per_page=2`

---

# For URL Search Params

I need to figure out what are the user stories for the URL params.

Bug:

- If I'm on "/?q=jay&page=1&per_page=2", and I wanna search new value and I put "adora" into the input box, it will only update `q` from "jay" to "adora".

This is my handleSubmit function:

```ts
const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();
  const trimmed = value.trim();
  if (!trimmed) return;
  // TODO: here is the problem
  // updateParams({ q: trimmed, page: "1", per_page: "2" });
  setQueryAndResetPage(trimmed);
};
```

```ts
const setQueryAndResetPage = (v: string) => updateParams({ q: v, page: "1" });
```

```ts
const updateParams = (updates: Record<string, string>) => {
  setSearchParams((prev) => {
    console.log("adora prev: ", prev.toString());
    const next = new URLSearchParams(prev);
    for (const [key, value] of Object.entries(updates)) {
      next.set(key, value);
    }
    return next;
  });
};
```

The problem of current is, it will take the previous state. so if you want to have a new search, it will carry the pre states. unless, we do a reset.
but I need to make it clear how do the user stories like for URL params

# User Stories

- when on “/“, shows nothing on the page cuz q is empty.
  - page will be = 1
  - per_page will be = 10
  - sort will be "best-match"
- when on “/?q=react”, we show 10 items per page and on page 1 and sort with best match cuz default.
- and when user on “/?q=react”, and the user go to page 2 so the query string is “/?q=react&page=2&per_page=10”.
- but if user update q value again, it should reset the q and page but per_page and sort should remain the same value.

# Small note

- I came back to this project after a 23-day holiday, I forgot what I did! I just done with the `getPageNumber` function.
- I should have enforced myself to note down what I have done and what need to do next.
- But because of I forgot what I did, I needed to understand the `getPageNumber` function I wrote few weeks ago. I found a bug in it. Have fixed it.
