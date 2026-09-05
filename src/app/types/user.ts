import { Profile } from "./profile";

export interface UserFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  birthDate: string;
  salary: string;
  company: string;
  jobTitle: string;
  skills: string;
}

export type User = {
  id: string;
  username: string;
  isActive: boolean;
  registeredAt: string;
  lastLogin?: string;
  profile: Profile;
};
