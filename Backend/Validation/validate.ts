import { GraphQLError } from "graphql";

export const checkFirstName = (name: string) => {
  name = name.trim();
  if (!name) {
    throw new GraphQLError("First name is required", {
      extensions: {
        code: "Bad Input",
        field: "firstname",
      },
    });
  }
  if (name.length < 2) {
    throw new GraphQLError("First name must be atleast two character long", {
      extensions: {
        code: "Bad Input",
        field: "firstname",
      },
    });
  }
  if (name.length > 30) {
    throw new GraphQLError("First name cannot exceed 30 characters", {
      extensions: {
        code: "Bad Input",
        field: "firstname",
      },
    });
  }
  const pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  if (!pattern.test(name)) {
    throw new GraphQLError(
      "First name can only contain letters, spaces and hyphens (-) only",
      {
        extensions: {
          code: "Bad Input",
          field: "firstname",
        },
      },
    );
  }
  return name;
};

export const checkLastName = (name: string) => {
  name = name.trim();
  if (!name) {
    throw new GraphQLError("Last name is required", {
      extensions: {
        code: "Bad Input",
        field: "lastname",
      },
    });
  }
  if (name.length < 2) {
    throw new GraphQLError("Last name must be atleast two character long", {
      extensions: {
        code: "Bad Input",
        field: "lastname",
      },
    });
  }
  if (name.length > 30) {
    throw new GraphQLError("Last name cannot exceed 30 characters.", {
      extensions: {
        code: "Bad Input",
        field: "lastname",
      },
    });
  }
  const pattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  if (!pattern.test(name)) {
    throw new GraphQLError(
      "Last name can only contain letters, spaces and hyphens (-) only",
      {
        extensions: {
          code: "Bad Input",
          field: "lastname",
        },
      },
    );
  }
  return name;
};

export const checkemail = (email: string): string => {
  email = email.trim();
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!email.trim()) {
    throw new GraphQLError("Email is required", {
      extensions: {
        code: "Bad Input",
        field: "email",
      },
    });
  }

  if (!emailRegex.test(email.trim())) {
    throw new GraphQLError("Enter a valid email address", {
      extensions: {
        code: "Bad Input",
        field: "email",
      },
    });
  }

  return email.trim().toLowerCase();
};

export const checkPassword = (password: string): string => {
  password = password.trim();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!password.trim()) {
    throw new GraphQLError("Password is required", {
      extensions: {
        code: "Bad Input",
        field: "password",
      },
    });
  }
  if (!passwordRegex.test(password)) {
    throw new GraphQLError(
      "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.",
      {
        extensions: {
          code: "Bad Input",
          field: "password",
        },
      },
    );
  }

  return password.trim();
};

export const checkPhone = (phone: string): string => {
  phone = phone.trim();
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) {
    throw new GraphQLError("Phone number is required", {
      extensions: {
        code: "Bad Input",
        field: "phone",
      },
    });
  }
  console.log(phone);

  if (!phoneRegex.test(phone)) {
    throw new GraphQLError("Enter a valid 10-digit phone number", {
      extensions: {
        code: "BAD INPUT",
        field: "phone",
      },
    });
  }
  return phone;
};
export const checkRestaurantName = (restaurantName: string): string => {
  restaurantName = restaurantName.trim();

  if (!restaurantName) {
    throw new GraphQLError("Restaurant name is required", {
      extensions: {
        code: "Bad Input",
        field: "restaurantName",
      },
    });
  }

  if (restaurantName.length < 3) {
    throw new GraphQLError(
      "Restaurant name must be at least 3 characters long",
      {
        extensions: {
          code: "Bad Input",
          field: "restaurantName",
        },
      },
    );
  }

  if (restaurantName.length > 100) {
    throw new GraphQLError("Restaurant name cannot exceed 100 characters", {
      extensions: {
        code: "Bad Input",
        field: "restaurantName",
      },
    });
  }

  return restaurantName;
};

export const checkCuisine = (cuisine: string): string => {
  cuisine = cuisine.trim();

  if (!cuisine) {
    throw new GraphQLError("Cuisine is required", {
      extensions: {
        code: "Bad Input",
        field: "cuisine",
      },
    });
  }

  if (cuisine.length < 3) {
    throw new GraphQLError("Cuisine must be at least 3 characters long", {
      extensions: {
        code: "Bad Input",
        field: "cuisine",
      },
    });
  }

  return cuisine;
};
export const checkAddress = (address: string): string => {
  address = address.trim();

  if (!address) {
    throw new GraphQLError("Restaurant address is required", {
      extensions: {
        code: "Bad Input",
        field: "address",
      },
    });
  }
  if (address.length < 10) {
    throw new GraphQLError("Address must be at least 10 characters long", {
      extensions: {
        code: "Bad Input",
        field: "address",
      },
    });
  }

  if (address.length > 250) {
    throw new GraphQLError("Address cannot exceed 250 characters", {
      extensions: {
        code: "Bad Input",
        field: "address",
      },
    });
  }
  return address;
};
export const checkFssaiNumber = (fssaiNumber?: string): string | undefined => {
  if (!fssaiNumber?.trim()) return undefined;
  const value = fssaiNumber.trim();
  if (!/^\d{14}$/.test(value)) {
    throw new GraphQLError("FSSAI number must contain exactly 14 digits", {
      extensions: {
        code: "BAD_USER_INPUT",
        field: "fssaiNumber",
      },
    });
  }
  return value;
};
export const checkGstNumber = (gstNumber?: string): string | undefined => {
  if (!gstNumber?.trim()) return undefined;
  const value = gstNumber.trim().toUpperCase();
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  if (!gstRegex.test(value)) {
    throw new GraphQLError("Enter a valid GST number", {
      extensions: {
        code: "BAD_USER_INPUT",
        field: "gstNumber",
      },
    });
  }
  return value;
};

export const checkName = (name: string): string => {
  name = name.trim();

  if (!name) {
    throw new GraphQLError("name is required", {
      extensions: {
        code: "Bad Input",
        field: "name",
      },
    });
  }

  if (name.length < 3) {
    throw new GraphQLError("name must be at least 3 characters long", {
      extensions: {
        code: "Bad Input",
        field: "name",
      },
    });
  }

  if (name.length > 100) {
    throw new GraphQLError("name cannot exceed 100 characters", {
      extensions: {
        code: "Bad Input",
        field: "name",
      },
    });
  }

  return name;
};
export const checkDescription = (description?: string): string | undefined => {
  if (!description?.trim()) return undefined;

  const value = description.trim();

  if (value.length > 500) {
    throw new GraphQLError("Description cannot exceed 500 characters", {
      extensions: {
        code: "Bad Input",
        field: "description",
      },
    });
  }

  return value;
};

export const checkPrice = (price: number): number => {
  if (price === undefined || price === null) {
    throw new GraphQLError("Price is required", {
      extensions: {
        code: "Bad Input",
        field: "price",
      },
    });
  }

  if (Number.isNaN(price)) {
    throw new GraphQLError("Price must be a valid number", {
      extensions: {
        code: "BAD_USER_INPUT",
        field: "price",
      },
    });
  }

  if (price <= 0) {
    throw new GraphQLError("Price must be greater than 0", {
      extensions: {
        code: "BAD_USER_INPUT",
        field: "price",
      },
    });
  }

  return price;
};
export const checkCategory = (category: string): string => {
  const value = category.trim();

  if (!value) {
    throw new GraphQLError("Category is required", {
      extensions: {
        code: "Bad Input",
        field: "category",
      },
    });
  }

  if (value.length < 2) {
    throw new GraphQLError("Category must be at least 2 characters", {
      extensions: {
        code: "Bad Input",
        field: "category",
      },
    });
  }

  if (value.length > 30) {
    throw new GraphQLError("Category cannot exceed 30 characters", {
      extensions: {
        code: "Bad Input",
        field: "category",
      },
    });
  }

  return value;
};

export const checkImageUrl = (imageUrl?: string): string | undefined => {
  if (!imageUrl?.trim()) return undefined;

  const value = imageUrl.trim();

  try {
    new URL(value);
  } catch {
    throw new GraphQLError("Please provide a valid image URL", {
      extensions: {
        code: "BAD_USER_INPUT",
        field: "imageUrl",
      },
    });
  }

  return value;
};
