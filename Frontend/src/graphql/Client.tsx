export interface GET_CURRENT_USER_Interface {
  GetCurrentUser: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    phoneVerified: boolean;
    role: string;
    created_at: string;
  };
}

export interface Get_Login_Interface {
  LogIn: {
    success: boolean;
    msg: string;
  };
}
export interface Post_Signup_Interface {
  SignUp: {
    success: boolean;
    msg: string;
  };
}
export interface Post_RegisterRestaurant_Interface {
  RegisterRestaurantOwner: {
    success: boolean;
    msg: string;
    restaurant: {
      id: string;
      restaurantName: string;
      cuisine: string;
      address: string;
      phone: string;
      fssaiNumber: string;
      gstNumber: string;
      status: string;
      ownerId: string;
      approvedBy: string;
      approvedAt: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}
export interface Post_Login_Interface {
  LogIn: {
    success: boolean;
    msg: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: string;
    } | null;
  };
}

export interface Post_OwnerLogin_Interface {
  OwnerLogIn: Post_Login_Interface["LogIn"];
}

export interface Post_AdminLogin_Interface {
  AdminLogIn: Post_Login_Interface["LogIn"];
}