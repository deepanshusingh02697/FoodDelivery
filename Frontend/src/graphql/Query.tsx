import { gql } from "@apollo/client";

export const GET_CURRENT_USER_QUERY = gql`
  query Query {
    GetCurrentUser {
      id
      firstname
      lastname
      email
      phone
      phoneVerified
      role
      created_at
    }
  }
`;
export const Crestuarant_Query = gql`
  query Query {
    GetRestaurants {
      id
      restaurantName
      cuisine
      address
      phone
      fssaiNumber
      gstNumber
      status
      ownerId
      approvedBy
      approvedAt
      createdAt
      updatedAt
      reviews {
        rating
      }
    }
  }
`;
export const CrestruarantMenus_Query = gql`
  query Query($restaurantId: Int!) {
    GetMenuItems(restaurantID: $restaurantId) {
      id
      name
      description
      price
      category
      isVeg
      imageUrl
      isAvailable
      trackStock
      stockQuantity
      createdAt
      restaurantId
    }
  }
`;

export const GET_CART_Query = gql`
  query GetCart($restaurantId: ID!) {
    GetCart(restaurantId: $restaurantId) {
      id
      restaurantId
      items {
        id
        quantity
        priceAtAdd
        menuItem {
          id
          name
          description
          price
          category
          isVeg
          imageUrl
          isAvailable
          restaurantId
        }
      }
    }
  }
`;

export const MY_ORDERS_Query = gql`
  query MyOrders {
    MyOrders {
      id
      status
      subtotal
      deliveryFee
      totalAmount
      placedAt
      deliveredAt
      restaurant {
        id
        restaurantName
        cuisine
      }
      items {
        id
        nameSnapshot
        priceSnapshot
        quantity
      }
      deliveryPartner {
        id
        firstname
        lastname
        phone
      }
    }
  }
`;

export const MY_RESTAURANT_MENU_Query = gql`
  query MyRestaurantMenu {
    MyRestaurantMenu {
      id
      name
      description
      price
      category
      isVeg
      imageUrl
      isAvailable
      trackStock
      stockQuantity
    }
  }
`;

export const AVAILABLE_DELIVERY_PARTNERS_Query = gql`
  query AvailableDeliveryPartners {
    AvailableDeliveryPartners {
      id
      firstname
      lastname
      phone
    }
  }
`;

export const RESTAURANT_ORDERS_Query = gql`
  query RestaurantOrders {
    RestaurantOrders {
      id
      status
      totalAmount
      placedAt
      items {
        id
        nameSnapshot
        quantity
      }
    }
  }
`;

export const ORDER_TRACKING_Query = gql`
  query OrderTracking($orderId: ID!) {
    OrderTracking(orderId: $orderId) {
      id
      lat
      lng
      updatedAt
    }
  }
`;

export const GET_PENDING_RESTAURANTS_Query = gql`
  query GetPendingRestaurants {
    GetPendingRestaurants {
      id
      restaurantName
      cuisine
      address
      phone
      fssaiNumber
      gstNumber
      createdAt
      owner {
        firstname
        lastname
        email
      }
    }
  }
`;

export const MY_ADDRESSES_Query = gql`
  query MyAddresses {
    MyAddresses {
      id
      label
      addressLine1
      city
      state
      pincode
      country
      isDefault
    }
  }
`;

export const GET_RESTAURANT_REVIEWS = gql`
  query GetRestaurantReviews($restaurantId: ID!) {
    GetRestaurantReviews(restaurantId: $restaurantId) {
      id
      rating
      comment
      createdAt
      user {
        id
        firstname
        lastname
      }
    }
  }
`;

export const Restaurant_Detail_Query = gql`
  query Query($restaurantId: Int!) {
    GetReaturantDetail(restaurantID: $restaurantId) {
      id
      restaurantName
      cuisine
      address
      phone
      fssaiNumber
      gstNumber
      status
      ownerId
      approvedBy
      approvedAt
      createdAt
      updatedAt
    }
  }
`;

export const ADMIN_DASHBOARD_INTERFACE = gql`
  query Query {
    GetAdminDahsboard {
      totalRevenue
      totalOrders
      totalRestaurants
      totalCustomers
      pendingRestaurants
      ordersByStatus {
        status
        count
      }
    }
  }
`;
export const FILTER_RESTAURANTS_Query = gql`
  query FilterRestaurants(
    $search: String
    $cuisine: String
    $vegOnly: Boolean
    $rating: Float
  ) {
    FilterRestaurants(
      search: $search
      cuisine: $cuisine
      vegOnly: $vegOnly
      rating: $rating
    ) {
      id
      restaurantName
      cuisine
      address
      menus {
        id
        name
        isVeg
        isAvailable
      }
      reviews {
        rating
      }
    }
  }
`;
