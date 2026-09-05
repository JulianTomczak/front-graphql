import { gql } from '@apollo/client';

export const GET_HELLO = gql`
  query GetHello {
    hello
  }
`;

export const GET_GREETING = gql`
  query GetGreeting($name: String!) {
    greeting(name: $name)
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      isActive
      registeredAt
      lastLogin
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
        isVerified
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_BASIC_USERS = gql`
  query GetBasicUsers {
    users {
      id
      username
      isActive
      registeredAt
      profile {
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_DETAILED_USERS = gql`
  query GetDetailedUsers {
    users {
      id
      username
      isActive
      registeredAt
      lastLogin
      profile {
        firstName
        lastName
        email
        phone
        jobTitle
        company
        isVerified
      }
    }
  }
`;
