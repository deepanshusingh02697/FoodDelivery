import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { Context, isAuth } from "../middleware/context.js";
import { AddAddressInput, UpdateAddressInput } from "../Input/address.input.js";
import { Address } from "../entity/address.entity.js";
import { addressService } from "../services/address.service.js";
import { AddressResponse } from "../Types/AddressResponse.js";
import { User } from "../entity/user.entity.js";
import { Order } from "../entity/order.entity.js";

@Resolver(()=>Address)
export class AddressResolver {
  @Mutation(() => AddressResponse)
  async AddAddress(
    @Arg("input", () => AddAddressInput) input: AddAddressInput,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const address = await addressService.addAddress(input, ctx);

    return {
      success: true,
      msg: "Address added",
      address,
    };
  }

  @Mutation(() => AddressResponse)
  async UpdateAddress(
    @Arg("input", () => UpdateAddressInput) input: UpdateAddressInput,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const address = await addressService.updateAddress(input, ctx);

    return {
      success: true,
      msg: "Address updated",
      address,
    };
  }

  @Mutation(() => AddressResponse)
  async DeleteAddress(
    @Arg("addressId", () => ID) addressId: string,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    await addressService.deleteAddress(addressId, ctx);

    return {
      success: true,
      msg: "Address deleted",
      address: null,
    };
  }

  @Query(() => [Address])
  async MyAddresses(@Ctx() ctx: Context) {
    isAuth(ctx);

    return addressService.getMyAddresses(ctx);
  }

  @FieldResolver(() => [Order])
  async orders(
    @Root() address: Address,
    @Ctx() ctx: Context
  ) {
    console.log("Address orders resolver:", address.id);

    return ctx.loaders.ordersByAddressLoader.load(address.id);
  }

  @FieldResolver(() => User)
  async user(
    @Root() address: Address,
    @Ctx() ctx: Context
  ) {
    console.log("Order resolver called", address.id);
    return ctx.loaders.userLoader.load(address.userId);
  }
}
