import { Arg, Ctx, Float, ID, Int, Mutation, Resolver } from "type-graphql";
import { AddressResponse } from "../../Types/AddressResponse.js";
import { Context, isAuth } from "../../../graphql/context.js";
import { addressRepository } from "../../repositories/repository.js";

@Resolver()
export class AddressResolver {
  @Mutation(() => AddressResponse)
  async AddAddress(
    @Arg("label", () => String, { nullable: true })
    label: string | undefined,

    @Arg("addressLine1", () => String)
    addressLine1: string,

    @Arg("city", () => String)
    city: string,

    @Arg("state", () => String)
    state: string,

    @Arg("pincode", () => String)
    pincode: string,

    @Arg("country", () => String, { nullable: true })
    country: string | undefined,

    @Arg("lat", () => Float, { nullable: true })
    lat: number | undefined,

    @Arg("lng", () => Float, { nullable: true })
    lng: number | undefined,

    @Arg("isDefault", () => Boolean, { nullable: true })
    isDefault: boolean | undefined,

    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const address = addressRepository.create({
      userId: ctx.userId!,
      addressLine1: addressLine1,
      city: city,
      state: state,
      pincode: pincode,
      country: country ?? "India",
      lat: lat,
      lng: lng,
      isDefault: isDefault ?? false,
    });

    const savedAddress = await addressRepository.save(address);

    return {
      success: true,
      msg: "Address added",
      address: savedAddress,
    };
  }

  @Mutation(() => AddressResponse)
  async UpdateAddress(
    @Arg("addressId", () => ID) addressId: string,
    @Arg("addressLine1", () => String, { nullable: true })
    addressLine1: string | undefined,
    @Arg("city", () => String, { nullable: true })
    city: string | undefined,
    @Arg("state", () => String, { nullable: true })
    state: string | undefined,
    @Arg("pincode", () => String, { nullable: true })
    pincode: string | undefined,
    @Arg("lat", () => Float, { nullable: true })
    lat: number | undefined,
    @Arg("lng", () => Float, { nullable: true })
    lng: number | undefined,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const existing = await addressRepository.findOne({
      where: {
        id: Number(addressId),
      },
    });

    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    if (existing.userId !== ctx.userId) {
      throw new Error("Not your address");
    }

    if (addressLine1 !== undefined) {
      existing.addressLine1 = addressLine1;
    }

    if (city !== undefined) {
      existing.city = city;
    }

    if (state !== undefined) {
      existing.state = state;
    }

    if (pincode !== undefined) {
      existing.pincode = pincode;
    }

    if (lat !== undefined) {
      existing.lat = lat;
    }

    if (lng !== undefined) {
      existing.lng = lng;
    }

    const updated = await addressRepository.save(existing);

    return {
      success: true,
      msg: "Address updated",
      address: updated,
    };
  }

  @Mutation(() => AddressResponse)
  async DeleteAddress(
    @Arg("addressId", () => ID) addressId: string,
    @Ctx() ctx: Context,
  ) {
    isAuth(ctx);

    const existing = await addressRepository.findOne({
      where: {
        id: Number(addressId),
      },
    });

    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    if (existing.userId !== ctx.userId) {
      throw new Error("Not your address");
    }

    try {
      await addressRepository.remove(existing);
    } catch (err) {
      throw new Error("can't delete this address because it linked with order");
    }

    return {
      success: true,
      msg: "Address deleted",
      address: null,
    };
  }
}
