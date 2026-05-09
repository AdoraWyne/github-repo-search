import { http, HttpResponse } from "msw";
import type { SearchResponse } from "../types/github";

export const handlers = [
  http.get("https://api.github.com/search/repositories", () => {
    return HttpResponse.json<SearchResponse>({
      total_count: 66,
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
        {
          id: 70107786,
          full_name: "vercel/next.js",
          description: "The React Framework",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4",
          },
          html_url: "https://github.com/vercel/next.js",
          updated_at: "2026-04-30T18:22:11Z",
          stargazers_count: 128340,
          language: "JavaScript",
        },
        {
          id: 29028775,
          full_name: "facebook/react-native",
          description:
            "A framework for building native applications using React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
          },
          html_url: "https://github.com/facebook/react-native",
          updated_at: "2026-04-30T15:11:42Z",
          stargazers_count: 119876,
          language: "C++",
        },
        {
          id: 24195339,
          full_name: "remix-run/react-router",
          description: "Declarative routing for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/64235328?v=4",
          },
          html_url: "https://github.com/remix-run/react-router",
          updated_at: "2026-04-30T11:08:24Z",
          stargazers_count: 53210,
          language: "TypeScript",
        },
        {
          id: 32634415,
          full_name: "reduxjs/react-redux",
          description: "Official React bindings for Redux",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/13142323?v=4",
          },
          html_url: "https://github.com/reduxjs/react-redux",
          updated_at: "2026-04-29T09:14:55Z",
          stargazers_count: 23145,
          language: "TypeScript",
        },
        {
          id: 39464018,
          full_name: "mui/material-ui",
          description:
            "Material UI: Comprehensive React component library that implements Google's Material Design.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/33663932?v=4",
          },
          html_url: "https://github.com/mui/material-ui",
          updated_at: "2026-04-30T17:45:00Z",
          stargazers_count: 92103,
          language: "TypeScript",
        },
        {
          id: 37153337,
          full_name: "ant-design/ant-design",
          description:
            "An enterprise-class UI design language and React UI library",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/12101536?v=4",
          },
          html_url: "https://github.com/ant-design/ant-design",
          updated_at: "2026-04-30T16:03:21Z",
          stargazers_count: 91245,
          language: "TypeScript",
        },
        {
          id: 18540884,
          full_name: "facebook/create-react-app",
          description: "Set up a modern web app by running one command.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
          },
          html_url: "https://github.com/facebook/create-react-app",
          updated_at: "2026-04-28T22:19:33Z",
          stargazers_count: 102567,
          language: "JavaScript",
        },
        {
          id: 12551875,
          full_name: "gatsbyjs/gatsby",
          description:
            "The best React-based framework with performance, scalability and security built in.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/12551863?v=4",
          },
          html_url: "https://github.com/gatsbyjs/gatsby",
          updated_at: "2026-04-29T13:55:08Z",
          stargazers_count: 55432,
          language: "TypeScript",
        },
        {
          id: 277575651,
          full_name: "remix-run/remix",
          description:
            "Build Better Websites. Create modern, resilient user experiences with web fundamentals.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/64235328?v=4",
          },
          html_url: "https://github.com/remix-run/remix",
          updated_at: "2026-04-30T10:47:18Z",
          stargazers_count: 29876,
          language: "TypeScript",
        },
        {
          id: 197850000,
          full_name: "react-hook-form/react-hook-form",
          description:
            "📋 React Hooks for form state management and validation (Web + React Native)",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/53986236?v=4",
          },
          html_url: "https://github.com/react-hook-form/react-hook-form",
          updated_at: "2026-04-30T08:30:55Z",
          stargazers_count: 41320,
          language: "TypeScript",
        },
        {
          id: 248470240,
          full_name: "TanStack/query",
          description:
            "🤖 Powerful asynchronous state management, server-state utilities and data fetching for the web.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/72518640?v=4",
          },
          html_url: "https://github.com/TanStack/query",
          updated_at: "2026-04-30T14:28:19Z",
          stargazers_count: 42750,
          language: "TypeScript",
        },
        {
          id: 180328715,
          full_name: "pmndrs/zustand",
          description: "🐻 Bear necessities for state management in React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/45790596?v=4",
          },
          html_url: "https://github.com/pmndrs/zustand",
          updated_at: "2026-04-30T07:19:42Z",
          stargazers_count: 47890,
          language: "TypeScript",
        },
        {
          id: 287347318,
          full_name: "pmndrs/jotai",
          description: "👻 Primitive and flexible state management for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/45790596?v=4",
          },
          html_url: "https://github.com/pmndrs/jotai",
          updated_at: "2026-04-29T19:21:08Z",
          stargazers_count: 18342,
          language: "TypeScript",
        },
        {
          id: 30084683,
          full_name: "reduxjs/redux",
          description:
            "A JS library for predictable and maintainable global state management",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/13142323?v=4",
          },
          html_url: "https://github.com/reduxjs/redux",
          updated_at: "2026-04-29T20:12:35Z",
          stargazers_count: 60876,
          language: "TypeScript",
        },
        {
          id: 22149809,
          full_name: "mobxjs/mobx",
          description: "Simple, scalable state management.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/41972722?v=4",
          },
          html_url: "https://github.com/mobxjs/mobx",
          updated_at: "2026-04-28T11:34:21Z",
          stargazers_count: 27432,
          language: "TypeScript",
        },
        {
          id: 251202692,
          full_name: "facebookexperimental/Recoil",
          description:
            "Recoil is an experimental state management library for React apps.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
          },
          html_url: "https://github.com/facebookexperimental/Recoil",
          updated_at: "2026-04-25T09:14:11Z",
          stargazers_count: 19250,
          language: "TypeScript",
        },
        {
          id: 36302985,
          full_name: "styled-components/styled-components",
          description:
            "Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress 💅",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/20658825?v=4",
          },
          html_url: "https://github.com/styled-components/styled-components",
          updated_at: "2026-04-29T15:43:08Z",
          stargazers_count: 40213,
          language: "TypeScript",
        },
        {
          id: 67232442,
          full_name: "emotion-js/emotion",
          description:
            "👩‍🎤 CSS-in-JS library designed for high performance style composition",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/31557565?v=4",
          },
          html_url: "https://github.com/emotion-js/emotion",
          updated_at: "2026-04-28T22:11:09Z",
          stargazers_count: 17654,
          language: "TypeScript",
        },
        {
          id: 178570888,
          full_name: "chakra-ui/chakra-ui",
          description:
            "⚡️ Simple, Modular & Accessible UI Components for your React Applications",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/54212428?v=4",
          },
          html_url: "https://github.com/chakra-ui/chakra-ui",
          updated_at: "2026-04-30T13:18:44Z",
          stargazers_count: 38120,
          language: "TypeScript",
        },
        {
          id: 16563930,
          full_name: "react-bootstrap/react-bootstrap",
          description: "Bootstrap components built with React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/3164102?v=4",
          },
          html_url: "https://github.com/react-bootstrap/react-bootstrap",
          updated_at: "2026-04-27T16:55:33Z",
          stargazers_count: 22487,
          language: "TypeScript",
        },
        {
          id: 39191545,
          full_name: "Semantic-Org/Semantic-UI-React",
          description: "The official Semantic-UI-React integration",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/13990163?v=4",
          },
          html_url: "https://github.com/Semantic-Org/Semantic-UI-React",
          updated_at: "2026-04-22T08:42:17Z",
          stargazers_count: 13210,
          language: "TypeScript",
        },
        {
          id: 11730342,
          full_name: "storybookjs/storybook",
          description:
            "Storybook is a frontend workshop for building UI components and pages in isolation.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/22632046?v=4",
          },
          html_url: "https://github.com/storybookjs/storybook",
          updated_at: "2026-04-30T16:12:09Z",
          stargazers_count: 84765,
          language: "TypeScript",
        },
        {
          id: 161601862,
          full_name: "testing-library/react-testing-library",
          description:
            "🐐 Simple and complete React DOM testing utilities that encourage good testing practices.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/43742164?v=4",
          },
          html_url: "https://github.com/testing-library/react-testing-library",
          updated_at: "2026-04-29T11:22:14Z",
          stargazers_count: 19432,
          language: "JavaScript",
        },
        {
          id: 36246615,
          full_name: "enzymejs/enzyme",
          description: "JavaScript Testing utilities for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/61748094?v=4",
          },
          html_url: "https://github.com/enzymejs/enzyme",
          updated_at: "2026-04-12T09:08:21Z",
          stargazers_count: 19986,
          language: "JavaScript",
        },
        {
          id: 213507112,
          full_name: "vercel/swr",
          description: "React Hooks for Data Fetching",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4",
          },
          html_url: "https://github.com/vercel/swr",
          updated_at: "2026-04-30T03:11:41Z",
          stargazers_count: 30765,
          language: "TypeScript",
        },
        {
          id: 76027571,
          full_name: "apollographql/apollo-client",
          description:
            ":rocket:  A fully-featured, production ready caching GraphQL client",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/17189275?v=4",
          },
          html_url: "https://github.com/apollographql/apollo-client",
          updated_at: "2026-04-29T20:44:18Z",
          stargazers_count: 19543,
          language: "TypeScript",
        },
        {
          id: 19185888,
          full_name: "facebook/relay",
          description:
            "Relay is a JavaScript framework for building data-driven React applications.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
          },
          html_url: "https://github.com/facebook/relay",
          updated_at: "2026-04-29T18:20:47Z",
          stargazers_count: 18432,
          language: "Rust",
        },
        {
          id: 56171213,
          full_name: "pmndrs/react-spring",
          description: "✌️ A spring physics based React animation library",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/45790596?v=4",
          },
          html_url: "https://github.com/pmndrs/react-spring",
          updated_at: "2026-04-30T09:27:56Z",
          stargazers_count: 28987,
          language: "TypeScript",
        },
        {
          id: 198069473,
          full_name: "framer/motion",
          description:
            "Open source, production-ready animation and gesture library for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/12554729?v=4",
          },
          html_url: "https://github.com/framer/motion",
          updated_at: "2026-04-30T17:00:53Z",
          stargazers_count: 25876,
          language: "TypeScript",
        },
        {
          id: 53556732,
          full_name: "atlassian/react-beautiful-dnd",
          description:
            "Beautiful and accessible drag and drop for lists with React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/168166?v=4",
          },
          html_url: "https://github.com/atlassian/react-beautiful-dnd",
          updated_at: "2026-04-21T07:18:34Z",
          stargazers_count: 33121,
          language: "JavaScript",
        },
        {
          id: 21560862,
          full_name: "react-dnd/react-dnd",
          description: "Drag and Drop for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/16462020?v=4",
          },
          html_url: "https://github.com/react-dnd/react-dnd",
          updated_at: "2026-04-25T10:32:25Z",
          stargazers_count: 21098,
          language: "TypeScript",
        },
        {
          id: 27554863,
          full_name: "bvaughn/react-virtualized",
          description:
            "React components for efficiently rendering large lists and tabular data",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/29597?v=4",
          },
          html_url: "https://github.com/bvaughn/react-virtualized",
          updated_at: "2026-04-19T17:44:56Z",
          stargazers_count: 26543,
          language: "JavaScript",
        },
        {
          id: 130898328,
          full_name: "bvaughn/react-window",
          description:
            "React components for efficiently rendering large lists and tabular data",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/29597?v=4",
          },
          html_url: "https://github.com/bvaughn/react-window",
          updated_at: "2026-04-26T11:42:05Z",
          stargazers_count: 16432,
          language: "JavaScript",
        },
        {
          id: 33126170,
          full_name: "JedWatson/react-select",
          description: "The Select Component for React.js",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/85577?v=4",
          },
          html_url: "https://github.com/JedWatson/react-select",
          updated_at: "2026-04-30T05:21:11Z",
          stargazers_count: 28432,
          language: "TypeScript",
        },
        {
          id: 22148918,
          full_name: "Hacker0x01/react-datepicker",
          description: "A simple and reusable datepicker component for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/4153?v=4",
          },
          html_url: "https://github.com/Hacker0x01/react-datepicker",
          updated_at: "2026-04-29T14:28:19Z",
          stargazers_count: 8210,
          language: "JavaScript",
        },
        {
          id: 24996644,
          full_name: "reactjs/react-modal",
          description: "Accessible modal dialog component for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/6412038?v=4",
          },
          html_url: "https://github.com/reactjs/react-modal",
          updated_at: "2026-04-15T08:54:32Z",
          stargazers_count: 7689,
          language: "JavaScript",
        },
        {
          id: 41189057,
          full_name: "nfl/react-helmet",
          description: "A document head manager for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/8027983?v=4",
          },
          html_url: "https://github.com/nfl/react-helmet",
          updated_at: "2026-04-12T09:11:42Z",
          stargazers_count: 17321,
          language: "JavaScript",
        },
        {
          id: 53875213,
          full_name: "fkhadra/react-toastify",
          description: "React notification made easy 🚀 !",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/12592949?v=4",
          },
          html_url: "https://github.com/fkhadra/react-toastify",
          updated_at: "2026-04-28T13:09:55Z",
          stargazers_count: 13245,
          language: "TypeScript",
        },
        {
          id: 24171158,
          full_name: "akiran/react-slick",
          description: "React carousel component",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/1885991?v=4",
          },
          html_url: "https://github.com/akiran/react-slick",
          updated_at: "2026-04-22T19:20:14Z",
          stargazers_count: 11543,
          language: "JavaScript",
        },
        {
          id: 33049981,
          full_name: "zenoamaro/react-quill",
          description: "A Quill component for React.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/2620?v=4",
          },
          html_url: "https://github.com/zenoamaro/react-quill",
          updated_at: "2026-04-12T16:40:21Z",
          stargazers_count: 6921,
          language: "TypeScript",
        },
        {
          id: 67975025,
          full_name: "remarkjs/react-markdown",
          description: "Markdown component for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/16309564?v=4",
          },
          html_url: "https://github.com/remarkjs/react-markdown",
          updated_at: "2026-04-29T22:15:08Z",
          stargazers_count: 12876,
          language: "TypeScript",
        },
        {
          id: 19819637,
          full_name: "react-grid-layout/react-grid-layout",
          description:
            "A draggable and resizable grid layout with responsive breakpoints, for React.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/12781853?v=4",
          },
          html_url: "https://github.com/react-grid-layout/react-grid-layout",
          updated_at: "2026-04-25T11:08:33Z",
          stargazers_count: 19321,
          language: "TypeScript",
        },
        {
          id: 261806191,
          full_name: "xyflow/xyflow",
          description:
            "React Flow | Svelte Flow - Powerful open source libraries for building node-based UIs",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/144383709?v=4",
          },
          html_url: "https://github.com/xyflow/xyflow",
          updated_at: "2026-04-30T12:54:21Z",
          stargazers_count: 25432,
          language: "TypeScript",
        },
        {
          id: 159953480,
          full_name: "pmndrs/react-three-fiber",
          description: "🇨🇭 A React renderer for Three.js",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/45790596?v=4",
          },
          html_url: "https://github.com/pmndrs/react-three-fiber",
          updated_at: "2026-04-30T08:14:07Z",
          stargazers_count: 27654,
          language: "TypeScript",
        },
        {
          id: 264125657,
          full_name: "pmndrs/drei",
          description: "🥉 useful helpers for react-three-fiber",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/45790596?v=4",
          },
          html_url: "https://github.com/pmndrs/drei",
          updated_at: "2026-04-30T11:55:22Z",
          stargazers_count: 8432,
          language: "TypeScript",
        },
        {
          id: 14776722,
          full_name: "PaulLeCam/react-leaflet",
          description: "React components for 🍃 Leaflet maps",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/271471?v=4",
          },
          html_url: "https://github.com/PaulLeCam/react-leaflet",
          updated_at: "2026-04-22T07:11:32Z",
          stargazers_count: 5132,
          language: "TypeScript",
        },
        {
          id: 49050923,
          full_name: "wojtekmaj/react-pdf",
          description:
            "Display PDFs in your React app as easily as if they were images.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/5426427?v=4",
          },
          html_url: "https://github.com/wojtekmaj/react-pdf",
          updated_at: "2026-04-28T18:54:02Z",
          stargazers_count: 9876,
          language: "TypeScript",
        },
        {
          id: 26412665,
          full_name: "react-syntax-highlighter/react-syntax-highlighter",
          description:
            "syntax highlighting component for react with prismjs or highlightjs ast using inline styles",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/40601540?v=4",
          },
          html_url:
            "https://github.com/react-syntax-highlighter/react-syntax-highlighter",
          updated_at: "2026-04-19T10:13:44Z",
          stargazers_count: 4231,
          language: "JavaScript",
        },
        {
          id: 30095812,
          full_name: "casesandberg/react-color",
          description:
            "🎨 Color Pickers from Sketch, Photoshop, Chrome, Github, Twitter & more",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/5419?v=4",
          },
          html_url: "https://github.com/casesandberg/react-color",
          updated_at: "2026-04-15T13:09:21Z",
          stargazers_count: 12543,
          language: "JavaScript",
        },
        {
          id: 38241307,
          full_name: "ReactTooltip/react-tooltip",
          description: "React Tooltip Component",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/118718645?v=4",
          },
          html_url: "https://github.com/ReactTooltip/react-tooltip",
          updated_at: "2026-04-26T11:40:28Z",
          stargazers_count: 3654,
          language: "TypeScript",
        },
        {
          id: 230226031,
          full_name: "TanStack/table",
          description:
            "🤖 Headless UI for building powerful tables & datagrids",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/72518640?v=4",
          },
          html_url: "https://github.com/TanStack/table",
          updated_at: "2026-04-30T14:12:39Z",
          stargazers_count: 25890,
          language: "TypeScript",
        },
        {
          id: 153099677,
          full_name: "react-icons/react-icons",
          description: "svg react icons of popular icon packs",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/45292741?v=4",
          },
          html_url: "https://github.com/react-icons/react-icons",
          updated_at: "2026-04-29T08:51:42Z",
          stargazers_count: 11543,
          language: "TypeScript",
        },
        {
          id: 56776298,
          full_name: "i18next/react-i18next",
          description:
            "Internationalization for react done right. Using the i18next i18n ecosystem.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/8546082?v=4",
          },
          html_url: "https://github.com/i18next/react-i18next",
          updated_at: "2026-04-30T07:05:11Z",
          stargazers_count: 9034,
          language: "JavaScript",
        },
        {
          id: 122491720,
          full_name: "statelyai/xstate",
          description:
            "Actor-based state management & orchestration for complex app logic.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/91490606?v=4",
          },
          html_url: "https://github.com/statelyai/xstate",
          updated_at: "2026-04-30T13:21:09Z",
          stargazers_count: 27654,
          language: "TypeScript",
        },
        {
          id: 31414401,
          full_name: "mobxjs/mobx-react",
          description: "React bindings for MobX",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/41972722?v=4",
          },
          html_url: "https://github.com/mobxjs/mobx-react",
          updated_at: "2026-04-22T10:18:55Z",
          stargazers_count: 5012,
          language: "TypeScript",
        },
        {
          id: 81668326,
          full_name: "recharts/recharts",
          description: "Redefined chart library built with React and D3",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/15528954?v=4",
          },
          html_url: "https://github.com/recharts/recharts",
          updated_at: "2026-04-30T16:42:11Z",
          stargazers_count: 23456,
          language: "TypeScript",
        },
        {
          id: 32128771,
          full_name: "tomchentw/react-google-maps",
          description: "React.js Google Maps integration component",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/922097?v=4",
          },
          html_url: "https://github.com/tomchentw/react-google-maps",
          updated_at: "2026-04-08T14:32:09Z",
          stargazers_count: 4876,
          language: "JavaScript",
        },
        {
          id: 51131490,
          full_name: "shoutem/ui",
          description:
            "Customizable set of components for React Native applications",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/8181457?v=4",
          },
          html_url: "https://github.com/shoutem/ui",
          updated_at: "2026-04-18T11:45:33Z",
          stargazers_count: 4934,
          language: "JavaScript",
        },
        {
          id: 87809210,
          full_name: "GeekyAnts/NativeBase",
          description:
            "Mobile-first, accessible components for React Native & Web to build consistent UI across Android, iOS and Web.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/14149727?v=4",
          },
          html_url: "https://github.com/GeekyAnts/NativeBase",
          updated_at: "2026-04-29T10:02:34Z",
          stargazers_count: 20132,
          language: "TypeScript",
        },
        {
          id: 12010815,
          full_name: "mzabriskie/react-draggable",
          description: "React draggable component",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/477023?v=4",
          },
          html_url: "https://github.com/mzabriskie/react-draggable",
          updated_at: "2026-04-19T08:55:21Z",
          stargazers_count: 8765,
          language: "JavaScript",
        },
        {
          id: 89820876,
          full_name: "downshift-js/downshift",
          description:
            "🏎 A set of primitives to build simple, flexible, WAI-ARIA compliant React autocomplete, combobox or select dropdown components.",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/45110628?v=4",
          },
          html_url: "https://github.com/downshift-js/downshift",
          updated_at: "2026-04-26T19:32:14Z",
          stargazers_count: 12345,
          language: "TypeScript",
        },
        {
          id: 195638323,
          full_name: "tannerlinsley/react-charts",
          description: "⚛️ Simple, immersive & interactive charts for React",
          owner: {
            avatar_url: "https://avatars.githubusercontent.com/u/5580297?v=4",
          },
          html_url: "https://github.com/tannerlinsley/react-charts",
          updated_at: "2026-04-19T08:24:01Z",
          stargazers_count: 7890,
          language: "TypeScript",
        },
      ],
    });
  }),
];
