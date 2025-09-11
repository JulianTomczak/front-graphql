import { gql } from "@apollo/client";

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
