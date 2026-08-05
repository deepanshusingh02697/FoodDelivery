import { Ctx, Query, Resolver } from "type-graphql";
import { Address } from "../../entity/address.entity.js";
import { Context, isAuth } from "../../middleware/context.js";
import { addressRepository } from "../../repositories/repository.js";

@Resolver()
export class AddressQuery {
  @Query(() => [Address])
  async MyAddresses(@Ctx() ctx: Context): Promise<Address[]> {
    isAuth(ctx);

    return await addressRepository.find({
      where: {
        userId: ctx.userId!,
      },
      order: {
        isDefault: "DESC",
        createdAt: "DESC",
      },
    });
  }
}
