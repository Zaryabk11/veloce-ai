import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "ADMIN" | "REVIEWER";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "REVIEWER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "REVIEWER";
  }
}