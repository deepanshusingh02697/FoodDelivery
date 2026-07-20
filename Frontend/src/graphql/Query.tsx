import { gql } from "@apollo/client";

export const GET_CURRENT_USER_QUERY = gql`
  query Query {
    GetCurrentUser {
      id
      firstname
      lastname
      email
      phone
      phoneVerified
      role
      created_at
    }
  }
`;
