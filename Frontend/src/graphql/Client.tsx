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
export interface Logout_Mutation_Interface {
  LogOut: {
    success: boolean;
    msg: string;
  };
}

export interface Crestuarant_Query_Interface {
  GetRestaurants: [
    {
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
      reviews: [
        {
          rating: number;
        },
      ];
    },
  ];
}
export interface menuCard_Interface {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  imageUrl: string;
  isAvailable: boolean;
  trackStock: boolean;
  stockQuantity: number;
  createdAt: string;
  restaurantId: string;
}

export interface CrestruarantMenus_Query_Interface {
  GetMenuItems: [menuCard_Interface];
}

export interface CartItem_Interface {
  id: string;
  quantity: number;
  priceAtAdd: number;
  menuItem: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
    isVeg: boolean;
    imageUrl: string | null;
    isAvailable: boolean;
    restaurantId: string;
  };
}

export interface Cart_Interface {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem_Interface[];
}

export interface GetCart_Query_Interface {
  GetCart: Cart_Interface | null;
}

export interface PostAdd_To_Cart_Interface {
  AddToCart: {
    success: boolean;
    msg: string;
    cart: Cart_Interface;
  };
}

export interface DecreaseCartItem_Mutation_Interface {
  DecreaseCartItem: {
    success: boolean;
    msg: string;
    cart: Cart_Interface;
  };
}

export interface REMOVE_FROM_CART_Interface {
  RemoveFromCart: {
    success: boolean;
    msg: string;
    cart: Cart_Interface;
  };
}

export interface Clear_Cart_Interface {
  ClearCart: {
    success: boolean;
    msg: string;
    cart: Cart_Interface;
  };
}

export interface PlaceOrder_Mutation_Interface {
  PlaceOrder: {
    success: boolean;
    msg: string;
    order: {
      id: string;
      status: string;
      subtotal: number;
      deliveryFee: number;
      totalAmount: number;
      placedAt: string;
      items: {
        id: string;
        nameSnapshot: string;
        priceSnapshot: number;
        quantity: number;
      }[];
    };
  };
}

export interface Order_Interface {
  id: string;
  status:
    | "PLACED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELED";
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  placedAt: string;
  deliveredAt: string | null;
  restaurant: {
    id: string;
    restaurantName: string;
    cuisine: string;
  };
  items: {
    id: string;
    nameSnapshot: string;
    priceSnapshot: number;
    quantity: number;
  }[];
}

export interface MyOrders_Query_Interface {
  MyOrders: Order_Interface[];
}

export interface CreateMenuItem_Mutation_Interface {
  CreateMenuItem: {
    success: boolean;
    msg: string;
    menuItem: {
      id: string;
      name: string;
      price: number;
      category: string;
      isVeg: boolean;
      imageUrl: string | null;
      trackStock: boolean;
      stockQuantity: number | null;
    };
  };
}

export interface MenuItem_Interface {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isVeg: boolean;
  imageUrl: string | null;
  isAvailable: boolean;
  trackStock: boolean;
  stockQuantity: number | null;
}

export interface MyRestaurantMenu_Query_Interface {
  MyRestaurantMenu: MenuItem_Interface[];
}

export interface ToggleMenuItemAvailability_Mutation_Interface {
  ToggleMenuItemAvailability: {
    success: boolean;
    msg: string;
    menuItem: { id: string; isAvailable: boolean };
  };
}

export interface UpdateStock_Mutation_Interface {
  UpdateStock: {
    success: boolean;
    msg: string;
    menuItem: { id: string; stockQuantity: number };
  };
}

export interface DeleteMenuItem_Mutation_Interface {
  DeleteMenuItem: {
    success: boolean;
    msg: string;
  };
}

export interface DeliveryPartner_Interface {
  id: string;
  firstname: string;
  lastname: string;
  phone: string | null;
}

export interface AvailableDeliveryPartners_Query_Interface {
  AvailableDeliveryPartners: DeliveryPartner_Interface[];
}

export interface AssignDeliveryPartner_Mutation_Interface {
  AssignDeliveryPartner: {
    success: boolean;
    msg: string;
    order: {
      id: string;
      status: string;
      deliveryPartner: {
        id: string;
        firstname: string;
        lastname: string;
      } | null;
    };
  };
}

export interface RestaurantOrder_Interface {
  id: string;
  status:
    | "PLACED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELED";
  totalAmount: number;
  placedAt: string;
  items: { id: string; nameSnapshot: string; quantity: number }[];
}

export interface RestaurantOrders_Query_Interface {
  RestaurantOrders: RestaurantOrder_Interface[];
}

export interface UpdateOrderStatus_Mutation_Interface {
  UpdateOrderStatus: {
    success: boolean;
    msg: string;
    order: { id: string; status: string };
  };
}

export interface PayOrder_Mutation_Interface {
  PayOrder: {
    success: boolean;
    msg: string;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
    };
  };
}

export interface VerifyPayment_Mutation_Interface {
  VerifyPayment: {
    success: boolean;
    msg: string;
    order: {
      id: string;
      status: string;
    };
  };
}

export interface DeliveryTracking_Interface {
  id: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

export interface OrderTracking_Query_Interface {
  OrderTracking: DeliveryTracking_Interface | null;
}
export interface Order_Interface {
  id: string;
  status:
    | "PLACED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELED";
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  placedAt: string;
  deliveredAt: string | null;
  restaurant: { id: string; restaurantName: string; cuisine: string };
  items: {
    id: string;
    nameSnapshot: string;
    priceSnapshot: number;
    quantity: number;
  }[];
  deliveryPartner: {
    id: string;
    firstname: string;
    lastname: string;
    phone: string | null;
  } | null;
}

export interface PendingRestaurant_Interface {
  id: string;
  restaurantName: string;
  cuisine: string;
  address: string;
  phone: string;
  fssaiNumber: string | null;
  gstNumber: string | null;
  createdAt: string;
  owner: { firstname: string; lastname: string; email: string };
}

export interface GetPendingRestaurants_Query_Interface {
  GetPendingRestaurants: PendingRestaurant_Interface[];
}

export interface ApproveRestaurant_Mutation_Interface {
  ApproveRestaurant: { success: boolean; msg: string };
}

export interface RejectRestaurant_Mutation_Interface {
  RejectRestaurant: { success: boolean; msg: string };
}

export interface Address {
  id: string;
  label?: string | null;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface MyAddresses_Query_Interface {
  MyAddresses: Address[];
}

export interface AddAddress_Mutation_Interface {
  AddAddress: {
    success: boolean;
    msg: string;
    address: Address;
  };
}

export interface Post_DeliveryLogin_Interface {
  DeliveryPartnerLogIn: {
    success: boolean;
    msg: string;
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      phone: string;
      phoneVerified: boolean;
      role: string;
      created_at: string;
    };
  };
}

export interface Review_Interface {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
  };
}
export interface GetRestaurantReviews_Query_Interface {
  GetRestaurantReviews: Review_Interface[];
}

export interface SubmitReview_Mutation_Interface {
  SubmitReview: {
    success: boolean;
    msg: string;
    review: Review_Interface | null;
  };
}
export interface UpdateReview_Mutation_Interface {
  UpdateReview: {
    success: boolean;
    msg: string;
    review: {
      id: string;
      rating: number;
      comment: string | null;
      createdAt: string;
      user: { id: string; firstname: string; lastname: string };
    } | null;
  };
}

export interface DeleteReview_Mutation_Interface {
  DeleteReview: {
    success: boolean;
    msg: string;
  };
}

export interface GetRestaurant_Detail_Interface {
  GetReaturantDetail: {
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
}

export interface ADMIN_DASHBOARD_Interface {
  GetAdminDahsboard: {
    totalRevenue: number;
    totalOrders: number;
    totalRestaurants: number;
    totalCustomers: number;
    pendingRestaurants: number;
    ordersByStatus: [
      {
        status: string;
        count: number;
      },
    ];
  };
}
export interface FilterRestaurants_Query_Interface {
  FilterRestaurants: {
    id: string;
    restaurantName: string;
    cuisine: string;
    address: string;
    status: string;
    reviews: { id: string; rating:number }[];
  }[];
}

export interface FilterRestaurants_Vars {
  search?: string;
  cuisine?: string;
  vegOnly?: boolean;
  rating?: number;
}


export interface UpdateAddress_Mutation_Interface {
  UpdateAddress: {
    success: boolean;
    msg: string;
    address: {
      id: string;
      addressLine1: string;
      city: string;
      state: string;
      pincode: string;
    } | null;
  };
}

export interface DeleteAddress_Mutation_Interface {
  DeleteAddress: {
    success: boolean;
    msg: string;
  };
}