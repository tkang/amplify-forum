# Build a Reddit-like Forum with Next.js and Amplify

[한국어](README_ko.md)

![AmplifyForum](https://github.com/tkang/amplify-forum/blob/main/Amplify_Forum.jpg?raw=true)

This hands-on lab will build a full-stack serverless application on AWS using Amplify, Next.js, GraphQL

Application we will build is going to be a Reddit-like message forum.

Once users follow this guide, they will have a working application running on AWS.

## Overview

We will create a new project using Create Next App.

We will then use Amplify CLI to set up AWS Cloud environment and use Amplify JS Libraries to connect our Next.js app to our back-end on AWS Cloud

This project will be a fully-serverless application with following architecture.



This hands-on lab is expected to be done in 2 to 4 hours

[Demo](https://dev.d2lf8ywg8xsqzo.amplifyapp.com)

### Architecture

This guide will build a fully-serverless application with following architecture.

![Architecture](https://github.com/tkang/amplify-forum/blob/main/amplify-architecture.png?raw=true)

### Required Background / Level

This guide has been made for front-end and back-end developers who want to learn more about building a full-stack serverless application on AWS.

Having knowledge in React and GraphQL is helpful, but not necessary.

### Topics we will cover

- Next.js application
- Web application Hosting
- Authentication
- GraphQL API : query, mutation, subscription, filtered subscription
- Authorization
- Deleting the resources

### Features we will implement

1. Application hosting
2. Authentication : Sign Up, Login, Signout
3. Data Modeling
- There can be N Topics
- A Topic can have N Comments.
4. Authorization
- Authenticated (Logged-in) users can create, read, update, delete a
  Topic and Comment. They can only update and delete their own.
- Users in Moderator group can read, update, and delete Topics and
  Comments.
- Authenticated (Logged-in) users can read all Topics and Comments.
5. Application UI
- List Topics
- View Topics with Comments
6. Add and delete records (Topic, Comment)
7. Realtime updates with Subscription

### Development Environment

Before we start, please install

- Node.js v10.x or later
- npm v5.x or later
- git v2.14.1 or later

On a terminal, we will run Amplify CLI to create a infrastructure, start
Next.js application on a local machine, and test application on a
browser.

### AWS Account

If you don't have an AWS account and would like to create and activate an AWS account, please refer to the following
[link](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

### Create a Next.js application

Let's create a new project using [Create Next App](https://nextjs.org/docs/api-reference/create-next-app)

```sh
$ npx create-next-app amplify-forum
```

move into the `amplify-forum` directory and install aws-amplify related packages.

```sh
$ cd amplify-forum
$ yarn add aws-amplify @aws-amplify/ui-react
```

### Styling with TailwindCSS

We will use TailwindCSS to style application.

Let's install TailwindCSS related packages in devDependencies.

```sh
$ yarn add --dev tailwindcss@latest postcss@latest autoprefixer@latest @tailwindcss/forms
```

To create Tailwind config files (`tailwind.config.js` `postcss.config.js`), let's run the following.

```sh
$ npx tailwindcss init -p
```

Now, let's update `tailwind.config.js` as following.
> This is to do tree-shake unused styling in production build

```diff
// tailwind.config.js
module.exports = {
-  purge: [],
+  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
-  plugins: [],
+. plugins: [require('@tailwindcss/forms')],
}
```

To use Tailwind's base, component, and utilities style, Let's update `./styles/globals.css`

```
/* ./styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> If you would like to know more about installing TailwindCSS, plesae check [here](https://tailwindcss.com/docs/guides/nextjs)

Let's update **pages/index.js**, which renders / root page.

```js
/* pages/index.js */
import Head from "next/head";

function Home() {
  return (
    <div>
      <Head>
        <title>Amplify Forum</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐕</text></svg>"
        />
      </Head>

      <div className="container mx-auto">
        <main className="bg-white">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Amplify Forum
              </p>
              <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                Welcome to Amplify Forum
              </p>
            </div>
          </div>
        </main>
      </div>

      <footer></footer>
    </div>
  );
}

export default Home;
```

Let's run `yarn dev` to start a local server, and check if the page
loads with no issues on a browser at localhost:3000

```sh
$ yarn dev
```

### Intializing a git repostory

Let's create a git repository for this project at (https://github.com/new)

Once you create a repository, let's initialize a git in your folder, and
add the created repository url.

```sh
$ git init
$ git remote add origin git@github.com:username/project-name.git
$ git add .
$ git commit -m 'initial commit'
$ git push origin main
```

## Install Amplify CLI & Initialize Amplify Project

### Install Amplify CLI

Let's install Amplify CLI

```sh
$ npm install -g @aws-amplify/cli
```

Now, let's configure CLI to use your AWS credential.

> If you would like to know more about the steps to create a credential,
> please check this video
> [here](https://www.youtube.com/watch?v=fWbM5DLh25U)

```sh
$ amplify configure

- Specify the AWS Region: ap-northeast-2
- Specify the username of the new IAM user: amplify-cli-user
> In the AWS Console, click Next: Permissions, Next: Tags, Next: Review, & Create User to create the new IAM user. Then return to the command line & press Enter.
- Enter the access key of the newly created user:
? accessKeyId: (<YOUR_ACCESS_KEY_ID>)
? secretAccessKey: (<YOUR_SECRET_ACCESS_KEY>)
- Profile Name: amplify-cli-user
```

### Initialzing Amplify Project

Let's initialze your Amplify project.

```sh
$ amplify init

- Enter a name for the project: amplifyforum
- Enter a name for the environment: dev
- Choose your default editor: Visual Studio Code (or your default editor)
- Please choose the type of app that youre building: javascript
- What javascript framework are you using: react
- Source Directory Path: src
- Distribution Directory Path: out
- Build Command: npm run-script build
- Start Command: npm run-script start
- Do you want to use an AWS profile? Y
- Please choose the profile you want to use: amplify-cli-user
```

> **You must change Distribution Directory Path to `out`.**
> After you build and export your Next.js, build artifacts will be
> placed in `out` directory

> Once `amplify init` is done, **amplify** folder will be created and `aws-exports.js` file will be created in **src** folder.

> **src/aws-exports.js** is where you will find Amplify config infos.

> **amplify/team-provider-info.json** contains variables for Amplify project's
> back-end environment.
> If you plan to share the same back-end environment, you should share
> this file. If not (e.g. opening this project to a public), you should
> not share this file (e.g. adding this file in `.gitignore`)

> For more info, please check (https://docs.amplify.aws/cli/teams/shared)

You can check Amplify project's status with `amplify status` command.

```sh
$ amplify status
```

If you want to check with Amplify console,`amplify console`
should launch a console in your browser.

```sh
$ amplify console
```

### Configuring the Next applicaion with Amplify

Once we have Amplify project ready, we now need to make our Next.js app
to be aware of Amplify project.
We can do this by making the top level component to configure Amplify with `src/aws-exports.js` file

Let's open **pages/\_app.js** and add the following.

```diff
  import '../styles/globals.css'
+ import Amplify from "aws-amplify";
+ import config from "../src/aws-exports";
+ Amplify.configure(config);

  function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
  }

  export default MyApp
```

Once it's done, our Next.app is ready to use AWS managed by Amplify.

## Hosting

Amplify Console takes care of application hosting as well as CI and deployment.


First, let's update **package.json** as follows.

```diff
"scripts": {
  "dev": "next dev",
-  "build": "next build",
+  "build": "next build && next export",
  "start": "next start"
},
```

> `next export` generates static HTML from the Next.js app so the
> application can be served as a static file without the need of a Node
> server.

> As of 2021-04, Amplify hosting can only serve static files. However,
> server-side rending will soon be supported.

To add hosting, let's run `amplify add hosting`

```sh
$ amplify add hosting

? Select the plugin module to execute: Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
? Choose a type: Manual deployment
```

To apply the change we just made, let's run `amplify push`

```sh
$ amplify push
```

To publish/deploy our application, run `amplify publish`

```sh
$ amplify publish
```

Once deployment is finished, a url will be printed. Go to the url in
your browser, and make sure your application loads correctly.

## Adding Authentication

Let's now add authentication.

To add authentication feature, run `amplify add auth`

```sh
$ amplify add auth

? Do you want to use default authentication and security configuration? Default configuration
? How do you want users to be able to sign in when using your Cognito User Pool? Username
? Do you want to configure advanced settings? No, I am done.
```

To apply the change, run `amplify push`

```sh
$ amplify push

? Are you sure you want to continue? Yes
```

### withAuthenticator

Using `withAuthencator` HOC provided by amplify-ui, we can make sure
pages are protected by authentication.

Once applied, users must log in to access the page. If not, they will be
redirected to a login page.

This UX flow is all taken care of by `withAuthenticator`

To test, let's update **/pages/index.js**

```diff
/* pages/index.js */
import Head from "next/head";
+ import { withAuthenticator } from "@aws-amplify/ui-react";

- export default Home;
+ export default withAuthenticator(Home);
```

> Authenticator UI Component document [here](https://docs.amplify.aws/ui/auth/authenticator/q/framework/react)

Let's start a dev server and test in the browser.

```sh
yarn dev
```

If you try to load a root / page, you will be redirected to a login.

Let's create a new account with sign-up.

Once signed up, you will receive a confirmation code in your email.

Entering the confirmation code will complete the new user sign up.

You can check newly created users in Auth console

```sh
$ amplify console auth

> Choose User Pool
```

### Signout

Let's add signout by using Signout UI component.

Add `AmplifySignout` compoent somewhere in your page component. (e.g.
pages/index.js)

```js
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

/* UI 어딘가에 넣어주세요. */
<AmplifySignOut />;
```

> Sign Out UI Component doc [here](https://docs.amplify.aws/ui/auth/sign-out/q/framework/react)

Let's click on signout button, and make sure you can logout
successfully.

### Accessing User Data

When logged in, you can access authenticated user's information with `Auth.currentAuthenticatedUser()`

Let's update **pages/index.js** to print user information in console.

```diff
+ import { useEffect } from "react";
+ import { Auth } from "aws-amplify";

function Home() {
+ useEffect(() => {
+ checkUser(); // new function call
+ }, []);
+
+ async function checkUser() {
+   const user = await Auth.currentAuthenticatedUser();
+   console.log("user: ", user);
+   console.log("user attributes: ", user.attributes);
+ }

  /* 이전과 동일 */
}



```

Once you load the page with browser console opened, you will see the
authenticated user's information and attributes in the console.

## Implementing UI

Let's install additional packages for UI in devDependencies.

```sh
$ yarn add --dev @headlessui/react @heroicons/react
```

### UI with mocking data

Let's implement UI to display Topics and add a new Topic. For now, we will use hard-coded mocking data to display Topics.

Let's update **pages/index.js** as follows.

```javascript
import Head from "next/head";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { useEffect, useState, Fragment } from "react";
import { Auth } from "aws-amplify";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { ViewGridAddIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

const TOPICS = [
  {
    title: "Graph API",
    comments: { nextToken: null, items: [] },
  },
  {
    title: "Component Design",
    comments: { nextToken: null, items: [] },
  },
  {
    title: "Templates",
    comments: { nextToken: null, items: [] },
  },
  {
    title: "React Components",
    comments: { nextToken: null, items: [] },
  },
];

function Grid({ topics }) {
  return (
    <div>
      <ul className="grid grid-cols-1 gap-5 mt-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((topic) => (
          <li
            key={topic.title}
            className="flex col-span-1 rounded-md shadow-sm"
          >
            <div className="flex items-center justify-between flex-1 truncate bg-white border-t border-b border-r border-gray-200 rounded-r-md">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <Link href={`/topic/${topic.id}`}>
                  <a className="font-medium text-gray-900 hover:text-gray-600">
                    {topic.title}
                  </a>
                </Link>
                <p className="text-gray-500">{topic.updatedAt}</p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 bg-transparent bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open options</span>
                  <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Form({ formData, setFormData, handleSubmit, disableSubmit }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="bg-white sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          New Topic
        </h3>
        <div className="max-w-xl mt-2 text-sm text-gray-500">
          <p>새로운 주제를 생성해주세요.</p>
        </div>
        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="제목"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <button
            onClick={handleSubmit}
            type="button"
            className={`disabled:opacity-50 inline-flex items-center justify-center w-full px-4 py-2 mt-3 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
              disableSubmit && "cursor-not-allowed"
            }`}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

function Modal({ open, setOpen, children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function AddNewTopicButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <ViewGridAddIcon className="w-5 h-5 mr-3 -ml-1" aria-hidden="true" />
      Add New Topic
    </button>
  );
}

function Home() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const topics = TOPICS;

  useEffect(() => {
    checkUser(); // new function call
  }, []);

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log("user: ", user);
    console.log("user attributes: ", user.attributes);
  }

  const disableSubmit = formData.title.length === 0;

  console.log("topics = ", topics);

  return (
    <div>
      <Head>
        <title>Amplify Forum</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>"
        />
      </Head>

      <div className="container mx-auto">
        <main className="bg-white">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Amplify Forum
              </p>
              <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                Welcome to Amplify Forum
              </p>
              <Grid topics={topics} />
              <div className="mt-10" />
              <AddNewTopicButton onClick={() => setOpen(true)} />
            </div>
          </div>
          <Modal open={open} setOpen={setOpen}>
            <Form
              formData={formData}
              setFormData={setFormData}
              disableSubmit={disableSubmit}
            />
          </Modal>
        </main>
        <AmplifySignOut />
      </div>

      <footer></footer>
    </div>
  );
}

export default withAuthenticator(Home);
```

Once we changed code, let's run dev server and test in browser.

```sh
yarn dev
```

## Adding an AWS AppSync GraphQL API

To add GraphQL API, let's run `amplify add api`

```sh
$ amplify add api

? Please select from one of the below mentioned services: GraphQL
? Provide API name: amplifyforum
? Choose the default authorization type for the API Amazon Cognito User Pool
Use a Cognito user pool configured as a part of this project.
? Do you want to configure advanced settings for the GraphQL API No, I am done.
? Do you have an annotated GraphQL schema? No
? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)
```

> Please make sure you choose `Cognito UserPool` as default authorization type.

> Want to learn more about GraphQL? [GraphQL Official Site](https://graphql.org/)

> [GraphQL Explained in 100 seconds](https://www.youtube.com/watch?v=eIQh02xuVw4)

> [Building Modern APIs with GraphQL](https://www.youtube.com/watch?v=bRnu7xvU1_Y)

### Adding new models : Topic & Comment

Following authorization rules will be applied
- Authenticated users can CRUD their own Topic and Comment as a owner.
- Moderator group can Read/Update/Delete Topic and Comment.
- All authenticated users can only Read Topic and Comment.

Let's add following in **amplify/backend/api/petstagram/schema.graphql**

```graphql
type Topic
  @model
  @auth(
    rules: [
      { allow: owner }
      {
        allow: groups
        groups: ["Moderator"]
        operations: [read, update, delete]
      }
      { allow: private, operations: [read] }
    ]
  ) {
  id: ID!
  title: String!
  comments: [Comment] @connection(keyName: "topicComments", fields: ["id"])
}

type Comment
  @model
  @key(name: "topicComments", fields: ["topicId", "content"])
  @auth(
    rules: [
      { allow: owner }
      {
        allow: groups
        groups: ["Moderator"]
        operations: [read, update, delete]
      }
      { allow: private, operations: [read] }
    ]
  ) {
  id: ID!
  topicId: ID!
  content: String!
  topic: Topic @connection(fields: ["topicId"])
}
```

To apply the change, run `amplify push --y`

```sh
$ amplify push --y
```

## Using the GraphQL API in our app

Now, let's call GraphQL API to feftch data and display in UI.

### Fetching Topics list


Following code is where fetching data is happening with GraphQL API.

```javascript
const data = await API.graphql({ query: queries.listTopics });
```

> Data Fetching Query API 문서(https://docs.amplify.aws/lib/graphqlapi/query-data/q/platform/js)

**pages/index.js** 를 다음과 같이 변경합니다.

```diff
+ import { API } from "aws-amplify";
+ import * as queries from "../src/graphql/queries";

/* same as before */

function Home() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
- const topics = TOPICS
+ const [ topics, setTopics ] = useState([]);

  useEffect(() => {
    checkUser();
+   fetchTopics();
  }, []);

+ async function fetchTopics() {
+   try {
+     const data = await API.graphql({ query: queries.listTopics });
+     setTopics(data.data.listTopics.items);
+   } catch (err) {
+     console.log({ err });
+   }
+  }
}
```

### Adding a new Topic

Let's create a new Topic with GraphQL API.

Following code is used to create a new Topic with GraphQL API.

```javascript
const newData = await API.graphql({
  query: mutations.createTopic,
  variables: { input: formData },
});
```

> Data Mutation Query API doc(https://docs.amplify.aws/lib/graphqlapi/mutate-data/q/platform/js)

Let's update **pages/index.js**

```diff
import * as queries from "../src/graphql/queries";
+ import * as mutations from "../src/graphql/mutations";

/* same as before */

function Home() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [topics, setTopics] = useState([]);
+ const [createInProgress, setCreateInProgress] = useState(false);

  /* same as before */

+ async function createNewTopic() {
+   setCreateInProgress(true);
+   try {
+     const newData = await API.graphql({
+       query: mutations.createTopic,
+       variables: { input: formData },
+     });
+
+     console.log(newData);
+     alert("New Topic Created!");
+     setFormData({ title: "" });
+   } catch (err) {
+     console.log(err);
+     const errMsg = err.errors
+       ? err.errors.map(({ message }) => message).join("\n")
+       : "Oops! Something went wrong!";
+     alert(errMsg);
+   }
+   setOpen(false);
+   setCreateInProgress(false);
+ }

- const disableSubmit = formData.title.length === 0;
+ const disableSubmit = createInProgress || formData.title.length === 0;

  console.log("topics = ", topics);

  return (
    <div>
      <Head>
        <title>Amplify Forum</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>"
        />
      </Head>

      <div className="container mx-auto">
        <main className="bg-white">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Amplify Forum
              </p>
              <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                Welcome to Amplify Forum
              </p>
              <Grid topics={topics} />
              <div className="mt-10" />
              <AddNewTopicButton onClick={() => setOpen(true)} />
            </div>
          </div>
          <Modal open={open} setOpen={setOpen}>
            <Form
              formData={formData}
              setFormData={setFormData}
              disableSubmit={disableSubmit}
+             handleSubmit={createNewTopic}
            />
          </Modal>
        </main>
        <AmplifySignOut />
      </div>

      <footer></footer>
    </div>
  );
}
```

Start a dev server and test in your browser. Make sure a Topic gets created successfully.

```sh
yarn dev
```

A new Topic gets created, but it doesn't get updated in the UI.

What can we do about it? We have 2 answers. (1) Reload the whole page and re-fetech the data (2) Get updates via Subscription and update the UI accordingly.

GraphQL API provides Subscription. So let's utilize it!

## Update UI with Subscription

When a new Topic gets created, we receive `onCreateTopic` event via Subscription and update the UI accordingly.

Following code is the core for Subscription.

```javascript
const subscription = API.graphql({
  query: subscriptions.onCreateTopic,
}).subscribe({
  next: ({ provider, value }) => {
    console.log({ provider, value });
    const item = value.data.onCreateTopic;
    setTopics((topics) => [item, ...topics]);
  },
  error: (error) => console.warn(error),
});
```

> Subscription doc(https://docs.amplify.aws/lib/graphqlapi/subscribe-data/q/platform/js)

Let's create Subscription on `onCreatePost` event in **pages/index.js**

```diff
import * as queries from "../src/graphql/queries";
import * as mutations from "../src/graphql/mutations";
+ import * as subscriptions from "../src/graphql/subscriptions";

/* Same as before */

function Home() {
  /* Same as before */
  useEffect(() => {
    checkUser();
    fetchTopics();
+   const subscription = subscribeToOnCreateTopic();
+     return () => {
+       subscription.unsubscribe();
+     };
    }, []);


+ function subscribeToOnCreateTopic() {
+   const subscription = API.graphql({
+     query: subscriptions.onCreateTopic,
+   }).subscribe({
+     next: ({ provider, value }) => {
+       console.log({ provider, value });
+       const item = value.data.onCreateTopic;
+       setTopics((topics) => [item, ...topics]);
+     },
+     error: (error) => console.warn(error),
+   });

+   return subscription;
+ }

  /* Same as before */
}
```

Create a new Topic and make sure the UI gets updated correctly.
Open another brower to see changes.

## Topic Page with Dynamic Routes

Once users select a Topic, they need to be redirected to a page like `topic/1234567` that shows details about the Topic, including all the Comments in the Topic.

We will use Dynmic Routes(https://nextjs.org/docs/routing/dynamic-routes) from Next.js to implment that page.

The page will (1) show Topic's title and Comments (2) have a form to add a new Comment

Let's create **pages/topic/[id].js** file with following.

```javascript
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { API } from "aws-amplify";
import { ChatAltIcon, UserCircleIcon } from "@heroicons/react/solid";
import * as queries from "../../src/graphql/queries";
import * as mutations from "../../src/graphql/mutations";

function CommentList({ commentsItems }) {
  if (commentsItems.length === 0) {
    return (
      <div className="flow-root">
        <div className="text-center">
          <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
            No Comment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {commentsItems.map((commentItem, commentItemIdx) => (
          <li key={commentItem.id}>
            <div className="relative pb-8">
              {commentItemIdx !== commentItem.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <>
                  <div className="relative">
                    <UserCircleIcon
                      className="items-center justify-center w-10 h-10 text-gray-500"
                      aria-hidden="true"
                    />

                    <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                      <ChatAltIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {commentItem.owner}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Commented at {commentItem.createdAt}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{commentItem.content}</p>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentForm({ formData, setFormData, handleSubmit, disableSubmit }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div>
      <label
        htmlFor="content"
        className="block text-sm font-medium text-gray-700"
      >
        Comment
      </label>
      <div className="mt-1">
        <textarea
          id="content"
          name="content"
          rows={5}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.content}
          onChange={handleChange}
        />
      </div>
      <div className="mt-2" />
      <button
        type="button"
        onClick={handleSubmit}
        className={`inline-flex items-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          disableSubmit && "cursor-not-allowed"
        }`}
      >
        Add New Comment
      </button>
    </div>
  );
}

function TopicPage() {
  const router = useRouter();
  const { id: topicId } = router.query;
  const [topic, setTopic] = useState();
  const [formData, setFormData] = useState({ content: "" });
  const [createInProgress, setCreateInProgress] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentNextToken, setCommentNextToken] = useState();

  useEffect(() => {
    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  const fetchTopic = async () => {
    console.log("fetching with topicId = ", topicId);
    const data = await API.graphql({
      query: queries.getTopic,
      variables: { id: topicId },
    });
    setTopic(data.data.getTopic);
    setComments(data.data.getTopic.comments.items);
    setCommentNextToken(data.data.getTopic.comments.nextToken);
  };

  async function createNewComment() {
    setCreateInProgress(true);
    try {
      const newData = await API.graphql({
        query: mutations.createComment,
        variables: { input: { ...formData, topicId: topicId } },
      });

      console.log(newData);
      alert("New Comment Created!");
      setFormData({ content: "" });
    } catch (err) {
      console.log(err);
      const errMsg = err.errors
        ? err.errors.map(({ message }) => message).join("\n")
        : "Oops! Something went wrong!";

      alert(errMsg);
    }

    setCreateInProgress(false);
  }

  const disableSubmit = createInProgress || formData.content.length === 0;

  return (
    <div>
      <Head>
        <title>Amplify Forum</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>"
        />
      </Head>

      <div className="container mx-auto">
        <main className="bg-white">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                {!topic && "Loading..."}
                {topic && topic.title}
              </p>
            </div>
            {topic && (
              <>
                <div className="mt-10" />
                <CommentList commentsItems={comments} />
                <div className="mt-20" />
                <CommentForm
                  formData={formData}
                  setFormData={setFormData}
                  disableSubmit={disableSubmit}
                  handleSubmit={createNewComment}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default TopicPage;
```

Start a dev server and test in browser. Make sure a new Comment gets created correctly.

```sh
yarn dev
```

## Filtered Subscription

Let's add a Subscription so we can get an update when a new Comment gets created and update UI.

However, we will need to get an update only when a new Comment related to the TopicId is created.

To do that, let's create a new Subscription type **amplify/backend/api/petstagram/schema.graphql**

```graphql
type Subscription {
  onCreateCommentByTopicId(topicId: String!): Comment
    @aws_subscribe(mutations: ["createComment"])
}
```

> GraphQL Subscription by id doc(https://docs.amplify.aws/guides/api-graphql/subscriptions-by-id/q/platform/js)

To apply the change, run `amplify push --y`

```sh
$ amplify push --y
```

Let's update **pages/topic/[id].js**

```diff
import * as mutations from "../../src/graphql/mutations";
+ import * as subscriptions from "../../src/graphql/subscriptions";

/* Same as before */

function TopicPage() {
  /* Same as before */

  useEffect(() => {
    if (topicId) {
      fetchTopic();
+     const subscription = subscribeToOnCreateComment();
+     return () => {
+       subscription.unsubscribe();
+      };
    }
  }, [topicId]);

+  function subscribeToOnCreateComment() {
+    const subscription = API.graphql({
+      query: subscriptions.onCreateCommentByTopicId,
+      variables: {
+        topicId: topicId,
+      },
+    }).subscribe({
+      next: ({ provider, value }) => {
+        console.log({ provider, value });
+        const item = value.data.onCreateCommentByTopicId;
+        console.log("new comment = ", item);
+        setComments((comments) => [item, ...comments]);
+      },
+      error: (error) => console.warn(error),
+    });
+
+    return subscription;
+  }

  /* Same as before */
}
```

Create a new Comment and make sure UI gets updated correctly.
Open multiple browsers with different topic pages. Make sure only the pages with the same Topic gets updated.

## Delete Comment

Let's add a feature to delete a Comment

We need to add another Subscription `onDeleteCommentByTopicId` in **amplify/backend/api/petstagram/schema.graphql**

```diff
type Subscription {
  onCreateCommentByTopicId(topicId: String!): Comment
    @aws_subscribe(mutations: ["createComment"])
+ onDeleteCommentByTopicId(topicId: String!): Comment
+   @aws_subscribe(mutations: ["deleteComment"])
}
```

Apply the change with `amplify push --y`

```sh
$ amplify push --y
```

Let's add a delete button in **pages/topic/[id].js**

```diff
/* Same as before */

+ function DeleteCommentButton({ comment }) {
+   async function deleteComment() {
+     if (!confirm("Are you sure?")) {
+       return;
+     }
+
+     const deletedComment = await API.graphql({
+       query: mutations.deleteComment,
+       variables: { input: { id: comment.id } },
+     });
+
+     alert("Deleted a comment");
+     console.log("deletedComment = ", deletedComment);
+   }
+
+   return <button onClick={deleteComment}>delete</button>;
+ }

function TopicPage() {
  /* Same as before */

  useEffect(() => {
    if (topicId) {
      fetchTopic();
-      const subscription = subscribeToOnCreateComment();
+      const onCreateSubscription = subscribeToOnCreateComment();
+      const onDeleteSubscription = subscribeToOnDeleteComment();
+      return () => {
-        subscription.unsubscribe();
+        onCreateSubscription.unsubscribe();
+        onDeleteSubscription.unsubscribe();
+      };
    }
  }, [topicId]);

  /* Same as before */

+  function subscribeToOnDeleteComment() {
+    const subscription = API.graphql({
+      query: subscriptions.onDeleteCommentByTopicId,
+      variables: {
+        topicId: topicId,
+      },
+    }).subscribe({
+      next: ({ provider, value }) => {
+        console.log({ provider, value });
+        const item = value.data.onDeleteCommentByTopicId;
+        console.log("deleted comment = ", item);
+        setComments((comments) => comments.filter((c) => c.id !== item.id));
+      },
+      error: (error) => console.warn(error),
+    });
+
+    return subscription;
+  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {commentsItems.map((commentItem, commentItemIdx) => (
          <li key={commentItem.id}>
            <div className="relative pb-8">
              {commentItemIdx !== commentItem.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <>
                  <div className="relative">
                    <UserCircleIcon
                      className="items-center justify-center w-10 h-10 text-gray-500"
                      aria-hidden="true"
                    />

                    <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                      <ChatAltIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {commentItem.owner}
+                          <span className="float-right">
+                            <DeleteCommentButton comment={commentItem} />
+                          </span>
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Commented at {commentItem.createdAt}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{commentItem.content}</p>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  /* Same as before */
}
```

Delete a Comment and check if UI gets updated correctly.
To test better, open multiple browsers with different Topics loaded

## Local mocking

If you want to run API, database, storage in your local machine, run `amplify mock`

```sh
$ amplify mock
```

## Additional Tests + TODO's

- Users shall not be able to delete Comments by other users.
- Check current user with `Auth.currentAuthenticatedUser`, and hide delete button if Comment's owner is different from current user.
- Moderator users can update and delete Topic and Comment. Create additional users. Add them to Moderator group. Test with those users.
- When Comments cannot be fetched in a single API call, non-null nextToken will be returned. Use it to fetch addtional data.
- Comments inside Topic get returned unsorted. Do something to have Comments returned sorted by either `createdAt` or `updatedAt` field.

> Hints : When defining relations, `@connection` directive is used. There is an option you can give in that directive.

> @connection directive doc(https://docs.amplify.aws/cli/graphql-transformer/connection)

> [Common GraphQL Schemas for Amplify Applications](https://github.com/tkang/amplify-graphql-schemas/)

## Removing Services

If you want to remove one of the services you added with Amplify CLI, you can run `amplify remove`

For example, `amplify remove auth` will remove authentication feature.

```sh
$ amplify remove auth

$ amplify push
```

If you are not sure about which services you have enabled, you can check with `amplify status`

```sh
$ amplify status
```

### Deleting the Amplify project and all services

If you want to delete Amplify project completely, run `amplify delete`

```sh
$ amplify delete
```
