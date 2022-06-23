import { gql } from "@apollo/client";

const CREATE_POST = gql`
  mutation createPost($file: Upload, $title: String, $description: String) {
    createPost(file: $file, title: $title, description: $description) {
      code
      message
      status
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($postId: Int) {
    deletePost(postId: $postId) {
      code
      message
      status
    }
  }
`;

const EDIT_POST = gql`
  mutation updatePost(
    $file: Upload!
    $postId: Int
    $title: String
    $description: String
  ) {
    updatePost(
      file: $file
      postId: $postId
      title: $title
      description: $description
    ) {
      code
      message
      status
    }
  }
`;


export { CREATE_POST, DELETE_POST, EDIT_POST };
