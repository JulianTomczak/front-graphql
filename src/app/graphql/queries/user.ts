import { gql } from '@apollo/client';

// Query básica de usuarios
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

// Query detallada de usuarios
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
