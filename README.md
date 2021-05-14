# Build a Reddit-like Forum with Next.js and Amplify

본 워크샾에서는, [Amplify](https://docs.amplify.aws/), [Next.js](https://nextjs.org/), [GraphQL](https://graphql.org/) 을 이용하여 AWS 위에 full-stack serverless application 을 만들어 보려합니다. 우리가 만들 application 은 메시지 포럼 입니다.

## Features

구현할 기능들은 다음과 같습니다.

- 어플리케이션 호스팅
- 사용자 등록, 로그인
- 여러개의 Topic 이 있으며, 한개의 Topic 밑으로 다수의 Comment 들이 등록될수 있음
- 로그인된 사용자는 Topic 과 Comment를 생성하고 관리 가능 (Create, Read, Update, Delete) 단 본인이 생성한 데이터만 Update, Delete 가능함.
- Moderator 로 등록된 사용자들은 모든 Topic 과 Comment 를 관리 가능 (Read, Update, Delete)
- 로그인된 사용자들은 모든 Topic 과 Comment 를 읽을수 있음.

### Overview

[Create Next App](https://nextjs.org/docs/api-reference/create-next-app) 을 이용하여 새로운 next.js 프로젝트를 생성합니다. 그리고 [Amplify CLI](https://github.com/aws-amplify/amplify-cli) 를 이용하여 AWS Cloud 환경을 설정하고 [Amplify JS Libraries](https://github.com/aws-amplify/amplify-js) 를 이용하여 우리가 만든 next.js 앱을 AWS Cloud 와 연결해보려 합니다.

본 워크샾은 2~5시간 정도 걸릴것으로 예상됩니다.

[Demo](https://dev.d2lf8ywg8xsqzo.amplifyapp.com)

### 개발 환경 Environment

시작하기전에, 아래 패키지들을 설치해주세요.

- Node.js v10.x or later
- npm v5.x or later
- git v2.14.1 or later

터미널에서 [Bash shell](<https://en.wikipedia.org/wiki/Bash_(Unix_shell)>) 상에서 Amplify CLI 를 실행해서 infra를 생성하고, Next.js application 을 로컬에서 띄우고 브라우져 상에서 테스트 하려 합니다.

### Required Background / Level

본 워크샾은 full stack serverless 개발에 대해 알고 싶은 front-end 와 back-end 개발자들을 위해 만들어졌습니다.

React 와 GraphQL 에대한 지식이 있다면 도움이 되지만, 필수는 아닙니다.

### 본 가이드에서 다루어질 토픽들:

- Next.js application
- Web application Hosting (호스팅)
- Authentication (인증)
- GraphQL API : query, mutation, subscription, filtered subscription
- Deleting the resources (작업 후 리소스 삭제)

## 시작하기 - Next Application 생성

[Create Next App](https://nextjs.org/docs/api-reference/create-next-app) 을 이용하여 새로운 프로젝트를 생성해봅시다.

```sh
$ npx create-next-app amplify-graphql-schemas
```

생성된 디렉토리로 이동해서, aws-amplify 연관 패키지들을 설치해봅시다.

```sh
$ cd amplify-graphql-schemas
$ yarn add aws-amplify @aws-amplify/ui-react
```

### Styling with TailwindCSS

본 앱에서는 TailwindCSS 를 이용하여 스타일링을 해보려 합니다.

Tailwind CSS 관련 패키지를 설치합시다. devDependencies 에만 들어가도록 설치합니다.

```sh
$ yarn add --dev tailwindcss@latest postcss@latest autoprefixer@latest @tailwindcss/forms
```

Tailwind 관련 설정 파일들 (`tailwind.config.js` `postcss.config.js`) 생성을 위해 다음 명령어를 실행합니다.

```sh
$ npx tailwindcss init -p
```

`tailwind.config.js` 의 내용을 다음과 같이 변경합니다. (production builds 에서 사용되지 않는 스타일링을 tree-shake 하기 위해서입니다.)

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
  plugins: [],
}
```

Tailwind 의 base, component, utilties 스타일이 사용되도록 next.js 에서 생성된 `./styles/globals.css` 파일을 다음과 같이 변경합니다.

```
/* ./styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> TailwindCSS 설치에 대한 자세한 내용은, 다음 링크를 확인하세요. [here](https://tailwindcss.com/docs/guides/nextjs)

기본으로 생성된 **pages/index.js** 를 변경합니다.

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

문제없이 로딩이 되는지, `yarn dev` 명령어로 로컬에서 서버를 띄우고, 브라우져에서 확인해봅니다.

```sh
$ yarn dev
```

## git repostory 초기화

본 프로젝트를 위한 git repository를 하나 만들어주세요. (https://github.com/new)
repository 생성을 하였으면, 로컬에서 git 을 초기화 하고, 생성된 repository 의 url 을 추가해주세요.

```sh
$ git init
$ git remote add origin git@github.com:username/project-name.git
$ git add .
$ git commit -m 'initial commit'
$ git push origin main
```

## Amplify CLI 설치 & AWS Amplify Project 초기화

### Amplify CLI 설치

Amplify CLI 를 설치해봅시다.

```sh
$ npm install -g @aws-amplify/cli
```

다음은 CLI 에서 AWS credential 을 사용하도록 설정해봅시다.

> 이 과정에 대한 자세한 설명을 보고 싶으면, 비디오를 확인하세요. [here](https://www.youtube.com/watch?v=fWbM5DLh25U)

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

### Amplify Project 초기화

amplify 프로젝트를 초기화 해봅시다.

```sh
$ amplify init

- Enter a name for the project: amplifygraphqlschemas
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

> **Distribution Directory Path 는 꼭 `out` 으로 변경해주세요.** (next.js 에서 build 후 export 를 하면 out 디렉토리로 결과물이 들어갑니다.)

> `amplify init` 초기화가 끝나면, **amplify** 폴더가 생성되고 **src** 폴더아래 `aws-exports.js` 파일이 생성됩니다.

> **src/aws-exports.js** 는 amplify 의 설정값들이 들어있습니다.

> **amplify/team-provider-info.json** 파일에는 amplify 프로젝트의 back-end 환경(env) 관련 변수들이 들어가 있습니다. 다른 사람들과 동일한 백엔드 환경을 공유하고 싶다면, 이 파일을 공유하면 됩니다. 만약에 프로젝트를 공개하고 싶은 경우라면 이 파일은 빼주는게 좋습니다. (.gitignore 에 추가) [관련문서](https://docs.amplify.aws/cli/teams/shared)

amplify 프로젝트의 상태를 보고 싶다면 `amplify status` 명령어로 확인하실수 있습니다.

```sh
$ amplify status
```

amplify 프로젝트 상태를 Amplify console 로 확인하고 싶다면, `amplify console` 명령어로 확인할수 있습니다.

```sh
$ amplify console
```

## Configuring the Next applicaion with Amplify

API 가 생성되고 준비되었으니, app 을 통해 테스트 해봅시다.

우선 해야할일은, 우리가 만들고 있는 app 에서 Amplify project 에 대해 인식하도록 설정하는 것입니다. src 폴더 안에 자동생성된 `aws-exports.js` 파일을 참조하도록 추가해봅시다.

설정을 하기위해 **pages/\_app.js** 파일을 열고, 다음 코드를 추가합니다.

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

위 코드가 추가되면, app 에서 AWS service 를 이용할 준비가 됩니다.

## Hosting

Amplify Console 은 배포와 CI 를 위한 hosting 서비스 입니다.

우선 build 스크립트 변경을 위해 **package.json** 안의 내용중 `scripts` 부분을 다음과 같이 변경해주세요.

```diff
"scripts": {
  "dev": "next dev",
-  "build": "next build",
+  "build": "next build && next export",
  "start": "next start"
},
```

> `next export` 는 next.js app 을 static HTML 파일로 변환해줍니다. 따라서 Node 서버가 필요 없이 app 을 로딩할수 있습니다.

> Amplify hosting 에서는 2021년 4월 현재 static file 만 서빙 가능합니다. 하지만 곧 server-side rendering 을 지원할 예정입니다.

Hosting 을 추가하기 위해, 다음 명령어를 실행합니다.

```sh
$ amplify add hosting

? Select the plugin module to execute: Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
? Choose a type: Manual deployment
```

`amplify push` 명령어로 변경사항 (`add hosting`) 을 적용해봅니다.

```sh
$ amplify push
```

`amplify publish` 명령어로 hosting 으로 배포를 해봅니다.

```sh
$ amplify publish
```

배포가 완료되면, 브라우져에서 터미널에 출력된 url 로 들어가보셔서 next.js 앱이 정상적으로 로딩되는 것을 확인해주세요.

## Adding Authentication

다음과정은, authentication을 추가를 해보겠습니다.

authentication 추가를 위해, 다음 명령어를 실행합니다.

```sh
$ amplify add auth

? Do you want to use default authentication and security configuration? Default configuration
? How do you want users to be able to sign in when using your Cognito User Pool? Username
? Do you want to configure advanced settings? No, I am done.
```

authentication 적용을 위해 `amplify push` 명령어를 실행합니다.

```sh
$ amplify push

? Are you sure you want to continue? Yes
```

### withAuthenticator 를 이용하여 로그인된 사용자만 접근 가능한 페이지 구현

인증/로그인된 사용자들만 접근할수 있는 페이지에 `withAuthenticator` HOC (Higher Order Component) 를 적용하면 됩니다.

예를들어, **/pages/index.js** 페이지에 withAuthenticator 를 적용하면, 사용자는 반드시 로그인을 해야합니다. 로그인이 되어있지 않다면, 로그인 페이지로 이동하게 됩니다.

테스트를 위해 **/pages/index.js** 를 변경해봅시다.

```diff
/* pages/index.js */
import Head from "next/head";
+ import { withAuthenticator } from "@aws-amplify/ui-react";

- export default Home;
+ export default withAuthenticator(Home);
```

> Authenticator UI Component 관련 문서 [here](https://docs.amplify.aws/ui/auth/authenticator/q/framework/react)

코드를 변경했으면 브라우져에서 테스트 해봅시다.

```sh
yarn dev
```

로그인 프롬프트가 뜨는 것으로, Authentication 플로우가 app 에 추가된것을 확인할 수 있습니다.

일단, sign up 계정생성을 해봅시다.

계정 생성을 하면 입력한 이메일로 confirmation code 가 전송됩니다.

이메일로 받은 confirmation code 를 입력해서 계정 생성을 마무리 합니다.

auth console 로 들어가면 생성된 사용자를 확인할수 있습니다.

```sh
$ amplify console auth

> Choose User Pool
```

### Signout

Signout 기능을 Signout UI Compnonent 를 이용해 추가해봅시다.

```js
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

/* UI 어딘가에 넣어주세요. */
<AmplifySignOut />;
```

> Sign Out UI Component 문서 [here](https://docs.amplify.aws/ui/auth/sign-out/q/framework/react)

SignOut 버튼을 눌러서 로그아웃이 잘 되는지도 확인해보세요.

### Accessing User Data

로그인 상태에서 `Auth.currentAuthenticatedUser()` 로 사용자 정보를 가져올수 있습니다.

**pages/index.js** 파일을 변경해봅시다.

```diff
+ import { useEffect } from "react";
+ import { Auth } from "aws-amplify";


+ useEffect(() => {
+ checkUser(); // new function call
+ }, []);

+async function checkUser() {
+  const user = await Auth.currentAuthenticatedUser();
+  console.log("user: ", user);
+  console.log("user attributes: ", user.attributes);
+}
```

브라우져 콘솔을 열고 / 페이지를 로딩하면, 콘솔에 로그인된 사용자 정보들과 attributes 들이 출력되는걸 확인할수 있습니다.

## Adding an AWS AppSync GraphQL API

GraphQL API 를 추가하기 위해선, 다음 명령어를 실행합니다.

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

> 기본 인증 방식은 Cognito UserPool (로그인 사용자) 입니다.

## Topic & Comment 모델 추가

- 로그인된 사용자 (owner) 는 Topic 과 Comment CRUD 가능
- Moderator group 은 Topic 과 Comment Read/Update/Delete 가능
- 나머지 로그인 사용자들은 Topic 과 Comment Read 가능

**amplify/backend/api/petstagram/schema.graphql** 파일을 열어 다음 내용을 추가해줍니다.

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

변경 사항 적용을 위해 `amplify push --y` 명령어를 실행합니다.

```sh
$ amplify push --y
```

## Implementing UI

UI 구현에 필요한 패키지를 설치합니다. devDependencies 로 들어가도록 설치합니다.

```sh
$ yarn add --dev @headlessui/react @heroicons/react
```

### UI with mocking data

하드코딩된 mocking 데이터인 (`TOPICS`) 로 Topic 목록과 새로운 Topic 을 추가하는 화면을 구현해봅시다.

**pages/index.js** 를 다음과 같이 변경합니다.

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

코드를 변경했으면 개발 서버를 띄우고 브라우져에서 테스트 해봅시다.

```sh
yarn dev
```

## GraphQL API 와 연결

GraphQL API 를 이용하여 데이터를 가져와서 UI 에 보여줍시다.

### Topics 목록 가져오기

다음 코드가 API 를 이용하여 데이터를 가져오는 핵심 부분입니다.

```javascript
const data = await API.graphql({ query: queries.listTopics });
```

> Data Fetching Query API 문서(https://docs.amplify.aws/lib/graphqlapi/query-data/q/platform/js)

**pages/index.js** 를 다음과 같이 변경합니다.

```diff
+ import { API } from "aws-amplify";
+ import * as queries from "../src/graphql/queries";

/* 이전과 동일 */

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
+     setPosts(data.data.listTopics.items);
+   } catch (err) {
+     console.log({ err });
+   }
+  }
}
```

### 새로운 Topic 생성

새로운 Topic 을 생성하는 API 를 연동해봅시다.

다음 코드가 API 를 이용하여 데이터를 생성하는 핵심 부분입니다.

```javascript
const newData = await API.graphql({
  query: mutations.createTopic,
  variables: { input: formData },
});
```

> Data Mutation Query API 문서(https://docs.amplify.aws/lib/graphqlapi/mutate-data/q/platform/js)

**pages/index.js** 를 다음과 같이 변경합니다.

```diff
import * as queries from "../src/graphql/queries";
+ import * as mutations from "../src/graphql/mutations";

/* 이전과 동일 */

function Home() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [topics, setTopics] = useState([]);
+ const [createInProgress, setCreateInProgress] = useState(false);

  /* 이전과 동일 */

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

개발 서버를 띄우고 브라우져에서 테스트 해봅시다. Topic 데이터가 잘 생성되는지도 테스트 해봅시다.

```sh
yarn dev
```

새로운 Topic 생성이 잘 되지만, 화면에 업데이트 되지는 않습니다.

어떻게 하면 좋을까요? 두가지 방법이 있습니다. (1) 화면 리로딩을 하고 전체 데이터 로딩 (2) Subscription 을 통한 업데이트.

GraphQL API 에서는 Subscription 기능도 제공합니다. 따라서 Subsription 을 이용해보도록 하겠습니다.

## Subscription 을 통한 업데이트

Topic 생성시 GraphQL Subscription 을 통해 업데이트를 받고, 화면 업데이트 해봅시다.

다음 코드가 Subscription 의 핵심 코드입니다.

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

> Subscription 문서(https://docs.amplify.aws/lib/graphqlapi/subscribe-data/q/platform/js)

**pages/index.js** 에서 onCreatePost 이벤트에 subscription 을 생성합니다.

```diff
import * as queries from "../src/graphql/queries";
import * as mutations from "../src/graphql/mutations";
+ import * as subscriptions from "../src/graphql/subscriptions";

/* 이전과 동일 */

useEffect(() => {
  checkUser();
  fetchTopics();
+ const subscription = subscribeToOnCreateTopic();
+   return () => {
+     subscription.unsubscribe();
+   };
  }, []);

/* 이전과 동일 */

function Home() {
  /* 이전과 동일 */

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

  /* 이전과 동일 */
}
```

Topic 을 생성해보고, 화면 업데이트가 잘 되는지 확인해주세요. 브라우져를 하나 더 띄워놓고 확인해보는 것도 방법입니다.

## Topic Page

토픽 목록 페이지에서 토픽을 선택하면 `topic/12311231231` 와 같은 상세페이지로 넘어가고, Comment 들을 포함한 상세 내용을 보여줘야 합니다.

이번에는 Next.js 의 Dynamic Routes(https://nextjs.org/docs/routing/dynamic-routes) 을 이용하여, (1) 토픽의 제목과 토픽내 코멘트들을 보여주고 (2) 새로운 토픽을 추가할수 있는 페이지를 만들어보겠습니다.

**pages/topic/[id].js** 파일을 생성하고, 다음과 같이 채워줍시다.

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
            등록된 글이 없습니다.
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

function TopicForm({ formData, setFormData, handleSubmit, disableSubmit }) {
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
                <TopicForm
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

이번에도 개발 서버를 띄우고 브라우져에서 테스트 해봅시다. Topic 데이터가 잘 생성되는지도 테스트 해봅시다.

```sh
yarn dev
```

### Filtered Subscription 추가

이번에도 역시 새로운 데이터가 (Comment) 추가될때 화면이 업데이트 될수 있도록 Subscription 을 추가하도록 하겠습니다. 하지만 이번에는 TopicId 와 관련된 Comment 들만 업데이트 받도록 해보겠습니다.

**amplify/backend/api/petstagram/schema.graphql** 파일을 열어 다음 내용을 추가해줍니다

```graphql
type Subscription {
  onCreateCommentByTopicId(topicId: String!): Comment
    @aws_subscribe(mutations: ["createComment"])
}
```

> GraphQL Subscription by id 문서 (https://docs.amplify.aws/guides/api-graphql/subscriptions-by-id/q/platform/js)

`amplify push --y` 명령어로 변경사항을 적용해봅니다.

```sh
$ amplify push --y
```

**pages/topic/[id].js** 을 다음과 같이 변경해주세요.

```diff
import * as mutations from "../../src/graphql/mutations";
+ import * as subscriptions from "../../src/graphql/subscriptions";

/* 이전과 동일 */

function TopicPage() {
  /* 이전과 동일 */

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

  /* 이전과 동일 */
}
```

Comment 를 생성해보고, 화면 업데이트가 잘 되는지 확인해주세요. 브라우져를 여러개 띄우고 여러개의 토픽 페이지를 띄우고 테스트 해보세요.

## Comment 삭제

Comment 삭제기능도 추가해봅시다.

**amplify/backend/api/petstagram/schema.graphql** 파일을 열어 `onDeleteCommentByTopicId` subscription 도 추가해줍니다.

```diff
type Subscription {
  onCreateCommentByTopicId(topicId: String!): Comment
    @aws_subscribe(mutations: ["createComment"])
+ onDeleteCommentByTopicId(topicId: String!): Comment
+   @aws_subscribe(mutations: ["deleteComment"])
}
```

`amplify push --y` 명령어로 변경사항을 적용해봅니다.

```sh
$ amplify push --y
```

**pages/topic/[id].js** 에 delete button 을 추가해줍니다.

```diff
/* 이전과 동일 */

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
  /* 이전과 동일 */

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

  /* 이전과 동일 */

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

  /* 이전과 동일 */
}
```

Comment 를 삭제해보고, 화면 업데이트가 잘 되는지 확인해주세요. 브라우져를 여러개 띄우고 여러개의 토픽 페이지를 띄우고 테스트 해보세요.

## Local mocking

API, database, storage 를 로컬에서 mock 으로 띄우려면 `amplify mock` 을 실행하면 됩니다.

```sh
$ amplify mock
```

## 추가적인 테스트 케이스들 + TODO's

- 다른 사람이 작성한 코멘트는 삭제되면 안됩니다. `Auth.currentAuthenticatedUser` 로 현재 사용자를 확인후, 본인의 코멘트가 아닌경우 UI 에서 삭제 버튼이 보이지 않게 구현해보세요.
- Moderator 는 Topic 과 Comment 을 Update/Delete 할수 있습니다. 새로운 사용자를 등록하고, Moderator 그룹으로 등록하고 테스트 해보세요.
- Comment 의 갯수가 많은경우는 nextToken 을 파라미터로 주어서 데이터를 가져와야 합니다. 이 경우도 테스트를 해주세요.
- Topic 안의 comments 는 정렬이 안된 상태로 넘어옵니다. `createdAt` 혹은 `updatedAt` 으로 정렬된 상태로 넘어오게 변경해보세요.

> 힌트 : schema.graphql 에서 Topic 내 comments relation 을 정의할때 `@connection` directive 를 사용하게 됩니다. 여기에 옵션으로 줄수 있는 파라미터가 있습니다.

> @connection directive 관련 문서(https://docs.amplify.aws/cli/graphql-transformer/connection)

> [Common GraphQL Schemas for Amplify Applications](https://github.com/tkang/amplify-graphql-schemas/)

## Removing Services

만약에 프로젝트와 어카운트에서 서비스를 삭제하고 싶으면 `amplify remove` 명령어로 수행할수 있습니다.

```sh
$ amplify remove auth

$ amplify push
```

어떤 서비스가 enabled 되어있는지 모르겠으면 `amplify status` 로 확인할수 있습니다.

```sh
$ amplify status
```

### Deleting the Amplify project and all services

프로젝트를 모두 지우고 싶다면 `amplify delete` 명령어로 할수 있습니다.

```sh
$ amplify delete
```
