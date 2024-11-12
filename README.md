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

## The solution
This solution follows the requirements of the project
### Home Page
- A list of Pokemons is displayed at first load coming from the respective api endpoint
  - Said list is presented in a table that is navigatable through it's pages stopping at the last item or first accordingly
  - The list is filterable by Pokemon name and power threshold
### Detail Page
- A detail page with the respective info and image of the clicked pokemon is accessible through the click on it's respective row
- The details page has 2 buttons Next and Prev so that we can navigate the list based on pokemon id
- Added a simple menu with a link to navigate back to the home page
### Tech stack and CI/CD
- The tech stack used is the one already established in the project Next.js / Styled components / Jest
- I chose Netlify for the deployment due to already being familiar with it
- The API has 2 enpoints one for search and data and another to get Pokemon info by id from the list provided
- The app uses jest to the unit tests of the api and client app I aimed for a coverage above 80%(instructions below on how to run each set of tests)
- Added a very simple pipeline with github actions that deploys the app to netlify after completing a set of steps
  - lint
  - Client App tests
  - API tests
  - Deploy
- The app is deployed to netlify the link will be provided separately

### Install the dependencies

```bash
@user:~$ npm install
```

### Run the project

```bash
@user:~$ npm run dev
```

### Test the API

```bash
@user:~$ npm run test:api
```

### Test the client app 

```bash
@user:~$ npm run test:client
```
