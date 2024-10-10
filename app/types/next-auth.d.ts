// types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userId?: string;
      email: string;
      name: string;
      role: number;
      status: boolean;
    };
  }

  interface User {
    id: string;
    userId?: string;
    email: string;
    name: string;
    role: number;
    status: boolean;
  }
}
