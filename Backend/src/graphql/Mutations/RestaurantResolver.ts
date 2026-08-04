import { RestaurantResponse } from "../../Types/RestaurantResponse.js";
import {
  restaurantRepository,
  userRepository,
} from "../../repositories/repository.js";
import {
  checkAddress,
  checkCuisine,
  checkemail,
  checkFirstName,
  checkFssaiNumber,
  checkGstNumber,
  checkLastName,
  checkPassword,
  checkPhone,
  checkRestaurantName,
} from "../../../Validation/validate.js";
import {
  Restaurant,
  RestaurantStatus,
} from "../../entity/Restaurant.entity.js";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../config/data-source.js";
import { Role, User } from "../../entity/User.entity.js";
import { Arg, Ctx, ID, Int, Mutation, Resolver } from "type-graphql";
import { Context, isAdmin } from "../../../graphql/context.js";

@Resolver()
export class RestaurantResolver {
  @Mutation(() => RestaurantResponse)
  async RegisterRestaurantOwner(
    @Arg("firstname", () => String) firstname: string,
    @Arg("lastname", () => String) lastname: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("phone", () => String) phone: string,
    @Arg("restaurantName", () => String) restaurantName: string,
    @Arg("cuisine", () => String) cuisine: string,
    @Arg("address", () => String) address: string,
    @Arg("fssaiNumber", () => String, { nullable: true }) fssaiNumber?: string,
    @Arg("gstNumber", () => String, { nullable: true }) gstNumber?: string,
  ) {
    checkFirstName(firstname);
    checkLastName(lastname);
    checkemail(email);
    checkPhone(phone);
    checkPassword(password);
    checkRestaurantName(restaurantName);
    checkCuisine(cuisine);
    checkAddress(address);
    checkFssaiNumber(fssaiNumber);
    checkGstNumber(gstNumber);

    const existUser = await userRepository.findOneBy({ email: email });
    if (existUser) {
      throw new Error("An account already exists with this email");
    }
    let existingRestaurant = null;
    if (fssaiNumber?.trim()) {
      existingRestaurant = await restaurantRepository.findOneBy({
        fssaiNumber: fssaiNumber.trim(),
      });
    }
    if (!existingRestaurant && gstNumber?.trim()) {
      existingRestaurant = await restaurantRepository.findOneBy({
        gstNumber: gstNumber.trim(),
      });
    }

    if (existingRestaurant) {
      switch (existingRestaurant.status) {
        case RestaurantStatus.PENDING:
          throw new Error(
            "This restaurant application is already under review.",
          );

        case RestaurantStatus.APPROVED:
          throw new Error("This restaurant is already registered.");

        case RestaurantStatus.REJECTED:
          throw new Error(
            "This restaurant application was rejected and cannot be submitted again.",
          );
      }
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await AppDataSource.transaction(async (tx) => {
      const user = tx.create(User, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashPassword,
        phone: phone,
      });
      await tx.save(user);

      const restaurant = tx.create(Restaurant, {
        restaurantName: restaurantName,
        cuisine: cuisine,
        address: address,
        phone: phone,
        fssaiNumber: fssaiNumber,
        gstNumber: gstNumber,
        ownerId: user.id,
        status: RestaurantStatus.PENDING,
      });
      await tx.save(restaurant);

      return { user, restaurant };
    });
    return {
      success: true,
      msg: "Account created and submitted — you'll be notified once reviewed",
      restaurant: result.restaurant,
    };
  }
  @Mutation(() => RestaurantResponse)
  async ApproveRestaurant(
    @Arg("restaurantId", () => ID) restaurantId: string,
    @Ctx() ctx: Context,
  ) {
    isAdmin(ctx);

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const restaurantRepository =
        queryRunner.manager.getRepository(Restaurant);

      const userRepository = queryRunner.manager.getRepository(User);

      const restaurant = await restaurantRepository.findOne({
        where: {
          id: Number(restaurantId),
        },
      });

      if (!restaurant) {
        throw new Error("NOT_FOUND");
      }

      if (restaurant.status !== RestaurantStatus.PENDING) {
        throw new Error("Already processed!");
      }

      restaurant.status = RestaurantStatus.APPROVED;
      restaurant.approvedBy = ctx.userId!;
      restaurant.approvedAt = new Date();

      const updated = await restaurantRepository.save(restaurant);

      const owner = await userRepository.findOne({
        where: {
          id: restaurant.ownerId,
        },
      });

      if (!owner) {
        throw new Error("Restaurant owner not found");
      }

      owner.role = Role.OWNER;

      await userRepository.save(owner);

      await queryRunner.commitTransaction();

      return {
        success: true,
        msg: "Approved",
        restaurant: updated,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Mutation(() => RestaurantResponse)
  async RejectRestaurant(
    @Arg("restaurantId", () => ID) restaurantId: number,
    @Ctx() ctx: Context,
  ) {
    isAdmin(ctx);

    const restaurant = await restaurantRepository.findOne({
      where: {
        id: Number(restaurantId),
      },
    });

    if (!restaurant) {
      throw new Error("NOT_FOUND");
    }

    if (restaurant.status !== RestaurantStatus.PENDING) {
      throw new Error("Already processed!");
    }

    restaurant.status = RestaurantStatus.REJECTED;
    restaurant.approvedBy = ctx.userId!;
    restaurant.approvedAt = new Date();

    const updated = await restaurantRepository.save(restaurant);

    return {
      success: true,
      msg: "Rejected",
      restaurant: updated,
    };
  }
}
