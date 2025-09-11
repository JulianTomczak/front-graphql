import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      username
      isActive
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

