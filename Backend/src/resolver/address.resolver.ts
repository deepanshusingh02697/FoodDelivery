import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { AddressResponse } from "../types/AddressResponse.js";
import { Context, isAuth } from "../middleware/context.js";
import { AddAddressInput, UpdateAddressInput } from "../Input/address.input.js";
import { Address } from "../entity/address.entity.js";
import { addressService } from "../services/address.service.js";

@Resolver()
export class AddressResolver {
  @Mutation(() => AddressResponse)
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
}
