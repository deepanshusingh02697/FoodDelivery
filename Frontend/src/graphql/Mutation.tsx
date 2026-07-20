import { gql } from "@apollo/client";

export const signUpUser_Mutation = gql`
  mutation Mutation(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    SignUp(
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
    ) {
      success
      msg
    }
  }
`;
export const RegisterRestaurant_Mutation = gql`
  mutation Mutation(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $phone: String!
    $restaurantName: String!
    $cuisine: String!
    $address: String!
    $fssaiNumber: String
    $gstNumber: String
  ) {
    RegisterRestaurantOwner(
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
      phone: $phone
      restaurantName: $restaurantName
      cuisine: $cuisine
      address: $address
      fssaiNumber: $fssaiNumber
      gstNumber: $gstNumber
    ) {
      success
      msg
      restaurant {
        id
        restaurantName
        cuisine
        address
        phone
        fssaiNumber
        gstNumber
        status
        ownerId
        approvedBy
        approvedAt
        createdAt
        updatedAt
      }
    }
  }
`;
export const logInUser_Mutation = gql`
  mutation LogIn($email: String!, $password: String!) {
    LogIn(email: $email, password: $password) {
      success
      msg
      user {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;

export const ownerLogIn_Mutation = gql`
  mutation OwnerLogIn($email: String!, $password: String!) {
    OwnerLogIn(email: $email, password: $password) {
      success
      msg
      user {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;

export const adminLogIn_Mutation = gql`
  mutation AdminLogIn($email: String!, $password: String!) {
    AdminLogIn(email: $email, password: $password) {
      success
      msg
      user {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;