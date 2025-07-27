import { Session, AdapterUser } from "next-auth";
import "next-auth";
import { Account as AccountType } from "next-auth/providers/oauth";
declare module "next-auth" {
  interface Session extends Session {
    user: {
      id: string;
    };
  }
  interface User extends AdapterUser {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  }

  interface Account extends AccountType {}
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string; // UUID from database
  }
}
