/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCommentByTopicId = /* GraphQL */ `
  subscription OnCreateCommentByTopicId($topicId: String!) {
    onCreateCommentByTopicId(topicId: $topicId) {
      id
      topicId
      content
      topic {
        id
        title
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteCommentByTopicId = /* GraphQL */ `
  subscription OnDeleteCommentByTopicId($topicId: String!) {
    onDeleteCommentByTopicId(topicId: $topicId) {
      id
      topicId
      content
      topic {
        id
        title
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateTopic = /* GraphQL */ `
  subscription OnCreateTopic {
    onCreateTopic {
      id
      title
      comments {
        items {
          id
          topicId
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateTopic = /* GraphQL */ `
  subscription OnUpdateTopic {
    onUpdateTopic {
      id
      title
      comments {
        items {
          id
          topicId
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteTopic = /* GraphQL */ `
  subscription OnDeleteTopic {
    onDeleteTopic {
      id
      title
      comments {
        items {
          id
          topicId
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      topicId
      content
      topic {
        id
        title
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      topicId
      content
      topic {
        id
        title
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      topicId
      content
      topic {
        id
        title
        comments {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
