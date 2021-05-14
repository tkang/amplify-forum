import Head from "next/head";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { useEffect, useState, Fragment } from "react";
import { Auth } from "aws-amplify";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { ViewGridAddIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { API } from "aws-amplify";
import * as queries from "../src/graphql/queries";
import * as mutations from "../src/graphql/mutations";
import * as subscriptions from "../src/graphql/subscriptions";

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

function Modal({ open, onClose, children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={onClose}
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
  const [topics, setTopics] = useState([]);
  const [createInProgress, setCreateInProgress] = useState(false);

  useEffect(() => {
    checkUser();
    fetchTopics();
    const subscription = subscribeToOnCreateTopic();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log("user: ", user);
    console.log("user attributes: ", user.attributes);
  }

  async function fetchTopics() {
    try {
      const data = await API.graphql({ query: queries.listTopics });
      setTopics(data.data.listTopics.items);
    } catch (err) {
      console.log({ err });
    }
  }

  async function createNewTopic() {
    setCreateInProgress(true);
    try {
      const newData = await API.graphql({
        query: mutations.createTopic,
        variables: { input: formData },
      });

      console.log(newData);
      alert("New Topic Created!");
      setFormData({ title: "" });
    } catch (err) {
      console.log(err);
      const errMsg = err.errors
        ? err.errors.map(({ message }) => message).join("\n")
        : "Oops! Something went wrong!";

      alert(errMsg);
    }
    setOpen(false);
    setCreateInProgress(false);
  }

  function subscribeToOnCreateTopic() {
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

    return subscription;
  }

  const disableSubmit = createInProgress || formData.title.length === 0;

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
          <Modal open={open} onClose={() => setOpen(false)}>
            <Form
              formData={formData}
              setFormData={setFormData}
              handleSubmit={createNewTopic}
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
