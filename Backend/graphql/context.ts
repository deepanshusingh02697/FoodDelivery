import { Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwtCookie";
import { GraphQLError } from "graphql/error";

export type Context = {
  userId: number | null;
  req: Request;
  res: Response;
  role: "CUSTOMER" | "OWNER" | "ADMIN" | "DELIVERY_PARTNER" | null;
};

export const createCheckAuth = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> => {
  let userId: number | null = null;
  let role: Context["role"] = null;

  const accessToken = req.cookies?.accessToken;

  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken);
      userId = decoded.userId;
      role = decoded.role;
    } catch (error) {
      userId = null;
    }
  }
  return { req, res, userId, role };
};

export const isAuth = (ctx: Context) => {
  
  if (!ctx.userId || ctx.role!=="CUSTOMER") {
    throw new GraphQLError("Not authenticated — please log in first", {
      extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
    });
  }
};

export const isOwner = (ctx: Context) => {
  if (ctx.role !== "OWNER") {
    throw new GraphQLError("You don't have access — owners only", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }
};

export const isAdmin = (ctx: Context) => {
  if (ctx.role !== "ADMIN") {
    throw new GraphQLError("You don't have access — admins only", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }
};

export const checkemail = (email: string): string => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email.trim())) {
    throw new Error("Please enter a valid email address.");
  }

  return email.trim().toLowerCase();
};

export const checkPassword = (password: string): string => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.",
    );
  }

  return password.trim();
};

export const checkPhone=(phone: string): string=>{
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number");
  }
  return phone
}

