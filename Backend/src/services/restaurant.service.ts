import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source.js";
import {
  restaurantRepository,
  userRepository,
} from "../repositories/repository.js";

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
} from "../../validation/validate.js";

import { Restaurant, RestaurantStatus } from "../entity/restaurant.entity.js";

import { Role, User } from "../entity/user.entity.js";

import { Context, isAdmin, isAuth } from "../middleware/context.js";

import {
  FilterRestaurantsInput,
  RegisterRestaurantOwnerInput,
} from "../Input/restaurant.input.js";

export class RestaurantService {
  async RegisterRestaurantOwner(input: RegisterRestaurantOwnerInput) {
    checkFirstName(input.firstname);
    checkLastName(input.lastname);
    checkemail(input.email);
    checkPhone(input.phone);
    checkPassword(input.password);
    checkRestaurantName(input.restaurantName);
    checkCuisine(input.cuisine);
    checkAddress(input.address);
    checkFssaiNumber(input.fssaiNumber);
    checkGstNumber(input.gstNumber);

    const existUser = await userRepository.findOneBy({
      email: input.email,
    });

    if (existUser) {
      throw new Error("An account already exists with this email");
    }

    let existingRestaurant = null;

    if (input.fssaiNumber?.trim()) {
      existingRestaurant = await restaurantRepository.findOneBy({
        fssaiNumber: input.fssaiNumber.trim(),
      });
    }

    if (!existingRestaurant && input.gstNumber?.trim()) {
      existingRestaurant = await restaurantRepository.findOneBy({
        gstNumber: input.gstNumber.trim(),
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

    const hashPassword = await bcrypt.hash(input.password, 10);

    const result = await AppDataSource.transaction(async (tx) => {
      const user = tx.create(User, {
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        password: hashPassword,
        phone: input.phone,
      });

      await tx.save(user);

      const restaurant = tx.create(Restaurant, {
        restaurantName: input.restaurantName,
        cuisine: input.cuisine,
        address: input.address,
        phone: input.phone,
        fssaiNumber: input.fssaiNumber,
        gstNumber: input.gstNumber,
        ownerId: user.id,
        status: RestaurantStatus.PENDING,
      });

      await tx.save(restaurant);

      return {
        user,
        restaurant,
      };
    });

    return {
      success: true,
      msg: "Account created and submitted — you'll be notified once reviewed",
      restaurant: result.restaurant,
    };
  }

  async ApproveRestaurant(restaurantId: string, ctx: Context) {
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

  async RejectRestaurant(restaurantId: number, ctx: Context) {
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

  async GetPendingRestaurants(ctx: Context) {
    isAdmin(ctx);

    return await restaurantRepository.find({
      where: {
        status: RestaurantStatus.PENDING,
      },

      relations: {
        owner: true,
        admin: true,
      },
    });
  }

  async FilterRestaurants(input: FilterRestaurantsInput, ctx: Context) {
    isAuth(ctx);

    let restaurants = await restaurantRepository.find({
      where: {
        status: RestaurantStatus.APPROVED,
      },

      relations: {
        menus: true,
        reviews: true,
      },
    });

    if (input.search) {
      restaurants = restaurants.filter((restaurant) =>
        restaurant.restaurantName
          .toLowerCase()
          .includes(input.search!.toLowerCase()),
      );
    }

    if (input.cuisine) {
      restaurants = restaurants.filter((restaurant) =>
        restaurant.cuisine.toLowerCase().includes(input.cuisine!.toLowerCase()),
      );
    }

    if (input.vegOnly) {
      restaurants = restaurants.filter((restaurant) =>
        restaurant.menus.some((menu) => menu.isVeg && menu.isAvailable),
      );
    }

    if (input.rating !== undefined) {
      restaurants = restaurants.filter((restaurant) => {
        if (restaurant.reviews.length === 0) {
          return false;
        }

        let totalRating = 0;

        for (const review of restaurant.reviews) {
          totalRating += review.rating;
        }

        const averageRating = totalRating / restaurant.reviews.length;

        return averageRating >= input.rating!;
      });
    }

    return restaurants;
  }

  async GetRestaurants() {
    return await restaurantRepository.find({
      where: {
        status: RestaurantStatus.APPROVED,
      },

      relations: {
        menus: true,
        reviews: true,
      },
    });
  }

  async GetRestaurantDetail(restaurantId: number, ctx: Context) {
    isAuth(ctx);

    const restaurant = await restaurantRepository.findOne({
      where: {
        id: restaurantId,
      },

      relations: {
        menus: true,

        reviews: {
          user: true,
        },

        owner: true,
      },
    });

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return restaurant;
  }
}
