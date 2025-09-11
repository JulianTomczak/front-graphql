import { gql } from "@apollo/client";

export const CHECK_EMAIL = gql`
  query CheckEmail($email: String!) {
    profileByEmail(email: $email) {
      id
      email
    }
  }
`;

export const GET_PROFILES = gql`
  query GetProfiles {
    profiles {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      company
      isVerified
      createdAt
    }
  }
`;

export const GET_FULL_PROFILES = gql`
  query GetFullProfiles {
    profiles {
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
`;