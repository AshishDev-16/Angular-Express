export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  department?: string;
  position?: string;
  status?: 'active' | 'inactive' | 'pending';
  profileImage?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
} 