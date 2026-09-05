import { gql } from "@apollo/client";

export const CREATE_PROFILE = gql`
  mutation CreateProfile($createProfileInput: CreateProfileInput!) {
    createProfile(createProfileInput: $createProfileInput) {
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

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: ID!, $updateProfileInput: UpdateProfileInput!) {
    updateProfile(id: $id, updateProfileInput: $updateProfileInput) {
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

export const REMOVE_PROFILE = gql`
  mutation RemoveProfile($id: ID!) {
    removeProfile(id: $id)
  }
`;

export const VERIFY_PROFILE = gql`
  mutation VerifyProfile($id: ID!, $isVerified: Boolean!) {
    verifyProfile(id: $id, isVerified: $isVerified) {
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
