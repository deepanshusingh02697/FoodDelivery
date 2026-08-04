import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { authService } from "../../services/auth.service.js";
import {
  checkemail,
  checkFirstName,
  checkLastName,
  checkPassword,
} from "../../../Validation/validate.js";
import { Context } from "../../../graphql/context.js";
import { accessCookieOptions, setToken } from "../../../lib/jwtCookie.js";
import { AuthResponse } from "../../Types/AuthResponse.js";


@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async SignUp(
    @Arg("firstname", () => String) firstname: string,
    @Arg("lastname", () => String) lastname: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
  ) {
    checkFirstName(firstname);
    checkLastName(lastname);
    checkemail(email);
    checkPassword(password);

    const user = await authService.signUp({
      firstname,
      lastname,
      email,
      password,
    });

    return { success: true, msg: "user signup successfully", user };
  }
  @Mutation(() => AuthResponse)
  async LogIn(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: Context,
  ) {
    checkemail(email);
    checkPassword(password);

    const user = await authService.login({ email, password });

    setToken(ctx.res, user.id, user.role);

    return { success: true, msg: "Login successfully", user };
  }
  @Mutation(() => AuthResponse)
  async OwnerLogIn(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: Context,
  ) {
    checkemail(email);
    checkPassword(password);

    const owner = await authService.ownerLogin({ email, password });

    setToken(ctx.res, owner.id, owner.role);

    return {
      success: true,
      msg: "login successfully as owner",
      user: owner,
    };
  }
  @Mutation(() => AuthResponse)
  async AdminLogIn(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: Context,
  ) {
    checkemail(email);
    checkPassword(password);

    const admin = await authService.adminLogin({ email, password });
    setToken(ctx.res, admin.id, admin.role);

    return {
      success: true,
      msg: "login successfully as admin",
      user: admin,
    };
  }
  @Mutation(() => AuthResponse)
  async DeliveryPartnerSignUp(
    @Arg("firstname", () => String) firstname: string,
    @Arg("lastname", () => String) lastname: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("phone", () => String) phone: string,
  ) {
    const user = await authService.deliveryPartnerSignUp({
      firstname,
      lastname,
      email,
      password,
      phone,
    });

    return {
      success: true,
      msg: "Delivery partner account created",
      user,
    };
  }
  @Mutation(() => AuthResponse)
  async DeliveryPartnerLogIn(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: Context,
  ) {
    checkemail(email);
    checkPassword(password);
    const partner = await authService.partnerLogin({ email, password });

    setToken(ctx.res, partner.id, partner.role);

    return {
      success: true,
      msg: "login successfully as delivery partner",
      user: partner,
    };
  }

  @Mutation(() => AuthResponse)
  async LogOut(@Ctx() ctx: Context) {
    if (!ctx.userId) {
      throw new Error("You are not authenticated to logout");
    }
    ctx.res.clearCookie("accessToken", accessCookieOptions);
    return { success: true, msg: "You loged out successfully" };
  }
}
