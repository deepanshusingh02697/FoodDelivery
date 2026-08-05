import { Request, Response } from "express";
import { verifyAccessToken } from "../../utils/jwt.cookie.js";
import { GraphQLError } from "graphql";

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



