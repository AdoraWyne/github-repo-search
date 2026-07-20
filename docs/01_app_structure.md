# Page

Only one page/route - [SearchPage](../src/routes/SearchPage.tsx).

This page renders:

- [PageLayout](../src/components/PageLayout.tsx)
- The heading: "Github Repository Search by adora 🐖"
- [SearchInput](../src/components/SearchInput.tsx)
- [ResultList](../src/components/ResultList.tsx)
  - [RepoCard](../src/components/RepoCard.tsx)

# Components

**[PageLayout](../src/components/PageLayout.tsx)**

To give the margin and padding of the whole page.

**[SearchInput](../src/components/SearchInput.tsx)**

**[ResultList](../src/components/ResultList.tsx)**

The container to show the search result - RepoCard.

**[RepoCard](../src/components/RepoCard.tsx)**

The card to show each search repo result:

- The Avatar
- The Title link
- The description
- Programming language of the repo, the star rating, updated in relative time.
