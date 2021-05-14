import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { API } from "aws-amplify";
import { ChatAltIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";
import * as queries from "../../src/graphql/queries";
import * as mutations from "../../src/graphql/mutations";
import * as subscriptions from "../../src/graphql/subscriptions";

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
                          <span className="float-right">
                            <DeleteCommentButton comment={commentItem} />
                          </span>
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

function DeleteCommentButton({ comment }) {
  async function deleteComment() {
    if (!confirm("Are you sure?")) {
      return;
    }

    const deletedComment = await API.graphql({
      query: mutations.deleteComment,
      variables: { input: { id: comment.id } },
    });

    alert("Deleted a comment");
    console.log("deletedComment = ", deletedComment);
  }

  return <button onClick={deleteComment}>delete</button>;
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
      const onCreateSubscription = subscribeToOnCreateComment();
      const onDeleteSubscription = subscribeToOnDeleteComment();
      return () => {
        onCreateSubscription.unsubscribe();
        onDeleteSubscription.unsubscribe();
      };
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

  function subscribeToOnCreateComment() {
    const subscription = API.graphql({
      query: subscriptions.onCreateCommentByTopicId,
      variables: {
        topicId: topicId,
      },
    }).subscribe({
      next: ({ provider, value }) => {
        console.log({ provider, value });
        const item = value.data.onCreateCommentByTopicId;
        console.log("new comment = ", item);
        setComments((comments) => [item, ...comments]);
      },
      error: (error) => console.warn(error),
    });

    return subscription;
  }

  function subscribeToOnDeleteComment() {
    const subscription = API.graphql({
      query: subscriptions.onDeleteCommentByTopicId,
      variables: {
        topicId: topicId,
      },
    }).subscribe({
      next: ({ provider, value }) => {
        console.log({ provider, value });
        const item = value.data.onDeleteCommentByTopicId;
        console.log("deleted comment = ", item);
        setComments((comments) => comments.filter((c) => c.id !== item.id));
      },
      error: (error) => console.warn(error),
    });

    return subscription;
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
