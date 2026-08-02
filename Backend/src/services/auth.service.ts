import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/repository.js";
import { Role } from "../entity/User.entity.js";

export class AuthService {
  async signUp(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) {
    const existingUser = await userRepository.findOne({
      where: {
        email: data.email.toLowerCase().trim(),
      },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = userRepository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
    });
    await userRepository.save(user);

    return user;
  }
  async login(data: { email: string; password: string }) {
    const user = await userRepository.findOne({
      where: {
        email: data.email.toLowerCase().trim(),
      },
      relations: {
        restaurant: true,
        approvedRestaurants: true,
      },
    });
    if (!user) {
      throw new Error("Email does not exist");
    }
    if (user.role !== Role.CUSTOMER) {
      throw new Error("Please use the owner or admin login");
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  async ownerLogin(data: { email: string; password: string }) {
    const owner = await userRepository.findOne({
      where: {
        email: data.email.toLowerCase().trim(),
      },
    });

    if (!owner) throw new Error("Invalid credentials");
    if (owner.role !== Role.OWNER)
      throw new Error("Invalid credentials to login as owner");

    const passwordMatch = await bcrypt.compare(data.password, owner.password);
    if (!passwordMatch)
      throw new Error("Invalid credentials to login as owner");
    return owner;
  }

  async adminLogin(data: { email: string; password: string }) {
    const admin = await userRepository.findOne({
      where: {
        email: data.email.toLowerCase().trim(),
      },
    });

    if (!admin) throw new Error("Invalid credentials");
    if (admin.role !== Role.ADMIN)
      throw new Error("Invalid credentials to login as owner");

    const passwordMatch = await bcrypt.compare(data.password, admin.password);
    if (!passwordMatch)
      throw new Error("Invalid credentials to login as owner");
    return admin;
  }
  
  async partnerLogin(data: { email: string; password: string }) {
    const partner = await userRepository.findOne({
      where: {
        email: data.email.toLowerCase().trim(),
      },
    });
    if (!partner) throw new Error("Invalid credentials");
    if (partner.role !== Role.ADMIN)
      throw new Error("Invalid credentials to login as owner");

    const passwordMatch = await bcrypt.compare(data.password, partner.password);
    if (!passwordMatch)
      throw new Error("Invalid credentials to login as owner");
    return partner;
  }
}
export const authService = new AuthService();
