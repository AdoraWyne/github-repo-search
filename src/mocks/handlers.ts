import { http, HttpResponse } from "msw";
import type { SearchResponse } from "../types/github";

export const handlers = [
  http.get("https://api.github.com/search/repositories", () => {
    return HttpResponse.json<SearchResponse>({
      total_count: 1000,
      incomplete_results: false,
      items: [
        {
          id: 10270250,
          full_name: "facebook/react",
          description: "The library for web and native user interfaces.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
          },
          html_url: "https://github.com/facebook/react",
          updated_at: "2026-04-30T16:42:54Z",
          stargazers_count: 244772,
          language: "JavaScript",
        },
        {
          id: 135786093,
          full_name: "typescript-cheatsheets/react",
          description:
            "Cheatsheets for experienced React developers getting started with TypeScript",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/50188264?v=4",
          },
          html_url: "https://github.com/typescript-cheatsheets/react",
          updated_at: "2026-04-30T04:51:00Z",
          stargazers_count: 47038,
          language: "JavaScript",
        },
        {
          id: 75396575,
          full_name: "duxianwei520/react",
          description:
            " React+webpack+redux+ant design+axios+less全家桶后台管理框架",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/3249653?v=4",
          },
          html_url: "https://github.com/duxianwei520/react",
          updated_at: "2026-04-28T10:11:12Z",
          stargazers_count: 5313,
          language: "JavaScript",
        },
        {
          id: 121814210,
          full_name: "primer/react",
          description:
            "An implementation of GitHub's Primer Design System using React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/7143434?v=4",
          },
          html_url: "https://github.com/primer/react",
          updated_at: "2026-04-30T04:28:57Z",
          stargazers_count: 3836,
          language: "TypeScript",
        },
        {
          id: 90759930,
          full_name: "discountry/react",
          description: "React docs in Chinese | React 中文文档翻译",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/4507101?v=4",
          },
          html_url: "https://github.com/discountry/react",
          updated_at: "2026-04-22T07:49:45Z",
          stargazers_count: 1362,
          language: "JavaScript",
        },
        {
          id: 565563619,
          full_name: "ysymyth/ReAct",
          description:
            "[ICLR 2023] ReAct: Synergizing Reasoning and Acting in Language Models",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/4877252?v=4",
          },
          html_url: "https://github.com/ysymyth/ReAct",
          updated_at: "2026-04-30T13:27:57Z",
          stargazers_count: 3790,
          language: "Jupyter Notebook",
        },
        {
          id: 77513419,
          full_name: "react-redux-antd-es6/react",
          description: "基于react的企业后台管理开发框架",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/24805142?v=4",
          },
          html_url: "https://github.com/react-redux-antd-es6/react",
          updated_at: "2026-04-28T10:14:39Z",
          stargazers_count: 1293,
          language: "JavaScript",
        },
        {
          id: 93503545,
          full_name: "HackYourFuture/React",
          description:
            'This repository contains all the material for the HackYourFuture module "React.js: Building dynamic UIs with modern JavaScript"',
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/20858568?v=4",
          },
          html_url: "https://github.com/HackYourFuture/React",
          updated_at: "2026-04-27T08:01:13Z",
          stargazers_count: 456,
          language: "JavaScript",
        },
      ],
    });
  }),
];
