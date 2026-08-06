import { AddAddressInput, UpdateAddressInput } from "../Input/address.input.js";
import { Context } from "../middleware/context.js";
import { addressRepository } from "../repositories/repository.js";

export class AddressService {
  async addAddress(input: AddAddressInput, ctx: Context) {
    const address = addressRepository.create({
      userId: ctx.userId!,
      addressLine1: input.addressLine1,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      country: input.country ?? "India",
      lat: input.lat,
      lng: input.lng,
      isDefault: input.isDefault ?? false,
    });

    return await addressRepository.save(address);
  }

  async updateAddress(input: UpdateAddressInput, ctx: Context) {
    const existing = await addressRepository.findOne({
      where: {
        id: Number(input.addressId),
      },
    });

    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    if (existing.userId !== ctx.userId) {
      throw new Error("Not your address");
    }

    Object.assign(existing, {
      addressLine1: input.addressLine1 ?? existing.addressLine1,
      city: input.city ?? existing.city,
      state: input.state ?? existing.state,
      pincode: input.pincode ?? existing.pincode,
      lat: input.lat ?? existing.lat,
      lng: input.lng ?? existing.lng,
    });

    return await addressRepository.save(existing);
  }

  async deleteAddress(addressId: string, ctx: Context) {
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

    return true;
  }

  async getMyAddresses(ctx: Context) {
    return await addressRepository.find({
      where: {
        userId: ctx.userId!,
      },
      // order: {
      //   isDefault: "DESC",
      //   createdAt: "DESC",
      // },
    });
  }
}

export const addressService = new AddressService();
