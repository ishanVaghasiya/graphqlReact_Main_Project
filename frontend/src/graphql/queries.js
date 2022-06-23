import { gql } from "@apollo/client";

const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      data {
        user_id
        first_name
        last_name
        email_id
      }
    }
  }
`;

const GET_ALL_POST = gql`
  query {
    getAllPosts {
      data {
        title
        image
        description
        post_id
      }
    }
  }
`;

const GET_MY_POST = gql`
  query {
    getMyPost {
      status
      code
      message
      data{
            title
            description
            image  
            post_id
        }
    }
  }
`;

export { GET_ALL_USERS, GET_ALL_POST, GET_MY_POST };
