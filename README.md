# SYMON

---

Synthetic Monitoring by Hyperjump

## Content

- [Installation](#Installation)
- [Development](#Development)
- [Storybook](#Storybook)
- [Integration test](#integration-test)
- [Building for production](#Building-for-production)
  - [Client](#Client)
  - [Server](#Server)
- [Install the dependencies](#Install-the-dependencies)

## Installation

Symon requires the following dependencies:

- [Node.js](https://nodejs.org/) >= 14
- [Npm](https://www.npmjs.com/) >=6.14

## Development

After cloning this repo, install the dependencies:

```
npm install
```

Copy the environment variables configuration:

```
cp .env.example .env
```

Run database (Prisma) migration:

```
npx prisma migrate dev --preview-feature
npx prisma generate
```

Run database (Prisma) seed:

```
npm run seed
```

Run the application:

```
npm start
```

and open localhost:4000 with a web browser.

To format the code according to the style guide:

```
npm run format-code
```

## Storybook

Storybook helps you document components for reuse and automatically visually test your components to prevent bugs.

To start Storybook locally:

```
npm run storybook
```

## Integration test

To run integration test locally, first open cypress:

```
npm run cypress:open
```

then in Tests tab, click the file you want to test

## Building for production

### Client

run `npm run client:build`. The client bundle will be available in `./dist` directory.

### Server

run `npm run server:build`.

## Install the dependencies

In case you don't have [npx](https://www.npmjs.com/package/npx):

```
npm i -g npx
```
