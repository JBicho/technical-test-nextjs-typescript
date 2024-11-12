<p align="center">
  <a href="https://goldavenue.com">
    <img src="https://images.teamtailor-cdn.com/images/s3/teamtailor-production/logotype-v3/image_uploads/ec20fa93-9b62-4681-b095-0d27a9cfa1df/original.png" height="128">
    <h1 align="center">Technical Test - Next.js and Typescript</h1>
  </a>
</p>

<p align="center">
  <a aria-label="Node version" href="https://nodejs.org/en/">
    <img src="https://img.shields.io/badge/node->=%20v16-red">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/">
    <img alt="" src="https://img.shields.io/badge/npm->=%20v8-blue">
  </a>
  <a aria-label="Typescript version" href="https://www.typescriptlang.org/">
    <img alt="" src="https://img.shields.io/badge/typescript-4.7.2-yellow">
  </a>
  <a aria-label="React version" href="https://reactjs.org/">
    <img alt="" src="https://img.shields.io/badge/react-18.2.0-green">
  </a>
</p>

## Introduction

This project is a technical test for a job application at Gold Avenue. 
The goal is to create a web application using Next.js and Typescript. The application must be able to display a list of Pokemons and their details.


- Fork this repository on your account
- Create a new branch
- Open a pull request on the `main` branch
- If possible, host the project on a platform like Vercel, Netlify, Heroku, etc. for easier review

### Requirements

#### Pokemon List

- We want to see all the Pokemon on the page by default (You can use pagination if you think this would cause a performance issue).
- We can search by name every Pokemon and you must show every Pokemon matched with the searched string.
- Threshold Power field: When you put a value (pokemon power), you must update the count value and count every Pokemon with the power threshold. For example: if you put 319, you must return every Pokemon with power strictly above 319.
- Count: must show the current count of pokemon returned by your search input and/or power threshold.
- Min: you must return the minimum Pokemon power of the list. It must be worked with a search
- Max: you must return the maximum Pokemon power of the list. It must be worked with a search
  Example : [Search part](with-search.png) [Power threshold part](with-threshold.png).

#### Pokemon view

- When you click on a row (pokemon in table), you must show this Pokemon on a new page (Page pokemon ex: /pokemon/2344). You must show on this page, all properties of Pokemon and this image (available in the public/images folder). 
A next button and a previous button must be displayed to access the previous or next Pokemon (based on ID logic).

#### Unit test

- Make unit tests on components, helpers, endpoint, ...

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

[Page list pokemon](http://localhost:3000/) can be accessed on http://localhost:3000/.
[Page pokemon](http://localhost:3000/pokemon/2344) can be accessed on http://localhost:3000/pokemon/2344.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/pokemons](http://localhost:3000/api/pokemons). This endpoint can be edited in `pages/api/pokemons.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Install the dependencies

```bash
@user:~$ npm install
```

### Run the project

```bash
@user:~$ npm run dev
```

### Test the project

```bash
@user:~$ npm run test
```
