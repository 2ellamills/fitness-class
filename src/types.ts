export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface ClassPass {
  id: string;
  userId: string;
  type: 'single' | '5-class' | '10-class' | 'unlimited';
  remainingSessions: number;
  expiryDate: string;
}

export interface Class {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: number; // in minutes
  capacity: number;
  participants: string[]; // array of user IDs
  imageUrl: string;
}