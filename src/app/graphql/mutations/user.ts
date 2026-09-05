import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      username
      isActive
      registeredAt
      profile {
        id
        firstName
        lastName
        email
        phone
        bio
        birthDate
        age
        salary
        company
        jobTitle
        skills
      }
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;

