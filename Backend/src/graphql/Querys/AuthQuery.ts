import { Ctx, Query, Resolver } from "type-graphql";
import { Role, User } from "../../entity/User.entity.js";
import { Context, isAuth, isOwner } from "../../../graphql/context.js";
import { userRepository } from "../../repositories/repository.js";

@Resolver()
export class AuthQuery {
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
