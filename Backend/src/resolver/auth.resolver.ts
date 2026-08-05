import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { authService } from "../services/auth.service.js";
import {
  checkemail,
  checkFirstName,
  checkLastName,
  checkPassword,
} from "../../validation/validate.js";
import { Context, isAuth, isOwner } from "../middleware/context.js";
import { accessCookieOptions, setToken } from "../../utils/jwt.cookie.js";
import { AuthResponse } from "../types/AuthResponse.js";
import { DeliveryPartnerSignUpInput, LoginInput, SignUpInput } from "../Input/auth.input.js";
import { Role, User } from "../entity/user.entity.js";
import { userRepository } from "../repositories/repository.js";


@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async SignUp(
    @Arg("input",() => SignUpInput) input: SignUpInput,
  ) {
    checkFirstName(input.firstname);
    checkLastName(input.lastname);
    checkemail(input.email);
    checkPassword(input.password);

    const user = await authService.signUp(input);

    return { success: true, msg: "user signup successfully", user };
  }
  @Mutation(() => AuthResponse)
  async LogIn(
    @Arg("input",() => LoginInput) input:LoginInput,
    @Ctx() ctx: Context,
  ) {
    checkemail(input.email);
    checkPassword(input.password);

    const user = await authService.login(input);

    setToken(ctx.res, user.id, user.role);

    return { success: true, msg: "Login successfully", user };
  }
  @Mutation(() => AuthResponse)
  async OwnerLogIn(
    @Arg("input",() => LoginInput) input:LoginInput,
    @Ctx() ctx: Context,
  ) {
    checkemail(input.email);
    checkPassword(input.password);

    const owner = await authService.ownerLogin(input);

    setToken(ctx.res, owner.id, owner.role);

    return {
      success: true,
      msg: "login successfully as owner",
      user: owner,
    };
  }
  @Mutation(() => AuthResponse)
  async AdminLogIn(
    @Arg("input",() => LoginInput)input:LoginInput,
    @Ctx() ctx: Context,
  ) {
    checkemail(input.email);
    checkPassword(input.password);

    const admin = await authService.adminLogin(input);
    setToken(ctx.res, admin.id, admin.role);

    return {
      success: true,
      msg: "login successfully as admin",
      user: admin,
    };
  }
  @Mutation(() => AuthResponse)
  async DeliveryPartnerSignUp(
    @Arg("input",() => DeliveryPartnerSignUpInput)input:DeliveryPartnerSignUpInput
  ) {
    const user = await authService.deliveryPartnerSignUp(input);

    return {
      success: true,
      msg: "Delivery partner account created",
      user,
    };
  }
  @Mutation(() => AuthResponse)
  async DeliveryPartnerLogIn(
    @Arg("input",()=>LoginInput)input:LoginInput,
    @Ctx() ctx: Context,
  ) {
    checkemail(input.email);
    checkPassword(input.password);
    const partner = await authService.partnerLogin(input);

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
  @Query(() => User)
    async GetCurrentUser(@Ctx() ctx: Context) {
      isAuth(ctx);
      return await userRepository.findOne({
        where: {
          id: ctx.userId!,
        },
      });
    }
  
    @Query(() => [User])
    async AvailableDeliveryPartners(@Ctx() ctx: Context) {
      isOwner(ctx);
  
      return await userRepository.find({
        where: {
          role: Role.DELIVERY_PARTNER,
        },
      });
    }
}
