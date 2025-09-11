export interface Profile {
  id: number; 
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  age?: number;
  salary?: number;
  company?: string;
  jobTitle?: string;
  skills?: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}
