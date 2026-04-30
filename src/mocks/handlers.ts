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
        },
        {
          id: 135786093,
          full_name: "typescript-cheatsheets/react",
          description:
            "Cheatsheets for experienced React developers getting started with TypeScript",
        },
        {
          id: 75396575,
          full_name: "duxianwei520/react",
          description:
            " React+webpack+redux+ant design+axios+less全家桶后台管理框架",
        },
        {
          id: 121814210,
          full_name: "primer/react",
          description:
            "An implementation of GitHub's Primer Design System using React",
        },
        {
          id: 90759930,
          full_name: "discountry/react",
          description: "React docs in Chinese | React 中文文档翻译",
        },
        {
          id: 565563619,
          full_name: "ysymyth/ReAct",
          description:
            "[ICLR 2023] ReAct: Synergizing Reasoning and Acting in Language Models",
        },
        {
          id: 77513419,
          full_name: "react-redux-antd-es6/react",
          description: "基于react的企业后台管理开发框架",
        },
        {
          id: 93503545,
          full_name: "HackYourFuture/React",
          description:
            'This repository contains all the material for the HackYourFuture module "React.js: Building dynamic UIs with modern JavaScript"',
        },
      ],
    });
  }),
];
