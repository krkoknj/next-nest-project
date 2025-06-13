export interface User {
    id: number;
    email: string;
  }
  
  export interface Board {
    id: number;
    title: string;
    content: string;
    author: User;
    createdAt: string;
  }