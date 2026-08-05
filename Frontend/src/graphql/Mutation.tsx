import { gql } from "@apollo/client";

export const signUpUser_Mutation = gql`
  mutation SignUp($input: SignUpInput!) {
    SignUp(input:$input) {
      success
      msg
    }
  }
`;
export const RegisterRestaurant_Mutation = gql`
mutation Mutation($input: RegisterRestaurantOwnerInput!) {
  RegisterRestaurantOwner(input: $input) {
      success
      msg
      restaurant {
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
  }
`;
export const logInUser_Mutation = gql`
  mutation Mutation($input: LoginInput!) {
  LogIn(input: $input) {
      success
      msg
      user {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;

export const ownerLogIn_Mutation = gql`
  mutation OwnerLogIn($email: String!, $password: String!) {
    OwnerLogIn(email: $email, password: $password) {
      success
      msg
      user {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;

export const adminLogIn_Mutation = gql`
  mutation AdminLogIn($email: String!, $password: String!) {
    AdminLogIn(email: $email, password: $password) {
      success
      msg
      user {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;

export const deliveryLogIn_Mutation = gql`
  mutation DeliveryPartnerLogIn($email: String!, $password: String!) {
    DeliveryPartnerLogIn(email: $email, password: $password) {
      success
      msg
      user {
        id
        firstname
        lastname
        email
        role
      }
    }
  }
`;

export const logout_Auth_Mutation = gql`
  mutation Mutation {
    LogOut {
      success
      msg
      user {
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
  }
`;

export const ADD_TO_CART_Mutation = gql`
  mutation AddToCart($menuItemId: ID!, $quantity: Int!) {
    AddToCart(menuItemId: $menuItemId, quantity: $quantity) {
      success
      msg
      cart {
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
  }
`;

export const DECREASE_CART_ITEM_Mutation = gql`
  mutation DecreaseCartItem($cartItemId: ID!) {
    DecreaseCartItem(cartItemId: $cartItemId) {
      success
      msg
      cart {
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
  }
`;

export const REMOVE_FROM_CART_Mutation = gql`
  mutation RemoveFromCart($cartItemId: ID!) {
    RemoveFromCart(cartItemId: $cartItemId) {
      success
      msg
      cart {
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
  }
`;

export const PLACE_ORDER_Mutation = gql`
  mutation PlaceOrder($cartId: ID!, $addressId: ID!) {
    PlaceOrder(cartId: $cartId, addressId: $addressId) {
      success
      msg
      order {
        id
        status
        subtotal
        deliveryFee
        totalAmount
        placedAt
        items {
          id
          nameSnapshot
          priceSnapshot
          quantity
        }
      }
    }
  }
`;
export const CLEAR_CART_Mutation = gql`
  mutation ClearCart($cartId: ID!) {
    ClearCart(cartId: $cartId) {
      success
      msg
      cart {
        id
        restaurantId
        items {
          id
        }
      }
    }
  }
`;

export const CREATE_MENU_ITEM_Mutation = gql`
  mutation CreateMenuItem(
    $name: String!
    $description: String
    $price: Float!
    $category: String!
    $isVeg: Boolean!
    $imageUrl: String
    $trackStock: Boolean
    $stockQuantity: Int
  ) {
    CreateMenuItem(
      name: $name
      description: $description
      price: $price
      category: $category
      isVeg: $isVeg
      imageUrl: $imageUrl
      trackStock: $trackStock
      stockQuantity: $stockQuantity
    ) {
      success
      msg
      menuItem {
        id
        name
        price
        category
        isVeg
        imageUrl
        trackStock
        stockQuantity
      }
    }
  }
`;

export const TOGGLE_MENU_ITEM_AVAILABILITY_Mutation = gql`
  mutation ToggleMenuItemAvailability($menuItemId: ID!) {
    ToggleMenuItemAvailability(menuItemId: $menuItemId) {
      success
      msg
      menuItem {
        id
        isAvailable
      }
    }
  }
`;

export const UPDATE_STOCK_Mutation = gql`
  mutation UpdateStock($menuItemId: ID!, $stockQuantity: Int!) {
    UpdateStock(menuItemId: $menuItemId, stockQuantity: $stockQuantity) {
      success
      msg
      menuItem {
        id
        stockQuantity
      }
    }
  }
`;

export const DELETE_MENU_ITEM_Mutation = gql`
  mutation DeleteMenuItem($menuItemId: ID!) {
    DeleteMenuItem(menuItemId: $menuItemId) {
      success
      msg
    }
  }
`;

export const ASSIGN_DELIVERY_PARTNER_Mutation = gql`
  mutation AssignDeliveryPartner($orderId: ID!, $deliveryPartnerId: ID!) {
    AssignDeliveryPartner(
      orderId: $orderId
      deliveryPartnerId: $deliveryPartnerId
    ) {
      success
      msg
      order {
        id
        status
        deliveryPartner {
          id
          firstname
          lastname
        }
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS_Mutation = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: OrderStatus!) {
    UpdateOrderStatus(orderId: $orderId, status: $status) {
      success
      msg
      order {
        id
        status
      }
    }
  }
`;

export const PAY_ORDER_Mutation = gql`
  mutation PayOrder($orderId: ID!) {
    PayOrder(orderId: $orderId) {
      success
      msg
      razorpayOrder {
        id
        amount
        currency
      }
    }
  }
`;

export const VERIFY_PAYMENT_Mutation = gql`
  mutation VerifyPayment(
    $orderId: ID!
    $razorpayOrderId: String!
    $razorpayPaymentId: String!
    $razorpaySignature: String!
  ) {
    VerifyPayment(
      orderId: $orderId
      razorpayOrderId: $razorpayOrderId
      razorpayPaymentId: $razorpayPaymentId
      razorpaySignature: $razorpaySignature
    ) {
      success
      msg
      order {
        id
        status
      }
    }
  }
`;

export const APPROVE_RESTAURANT_Mutation = gql`
  mutation ApproveRestaurant($restaurantId: ID!) {
    ApproveRestaurant(restaurantId: $restaurantId) {
      success
      msg
    }
  }
`;

export const REJECT_RESTAURANT_Mutation = gql`
  mutation RejectRestaurant($restaurantId: ID!) {
    RejectRestaurant(restaurantId: $restaurantId) {
      success
      msg
    }
  }
`;

export const ADD_ADDRESS_Mutation = gql`
  mutation AddAddress(
    $label: String
    $addressLine1: String!
    $city: String!
    $state: String!
    $pincode: String!
    $isDefault: Boolean
  ) {
    AddAddress(
      label: $label
      addressLine1: $addressLine1
      city: $city
      state: $state
      pincode: $pincode
      isDefault: $isDefault
    ) {
      success
      msg
      address {
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
  }
`;

export const SUBMIT_REVIEW = gql`
  mutation SubmitReview($restaurantId: ID!, $rating: Int!, $comment: String) {
    SubmitReview(restaurantId: $restaurantId, rating: $rating, comment: $comment) {
      success
      msg
      review {
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
  }
`;
export const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $rating: Int, $comment: String) {
    UpdateReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
      success
      msg
      review {
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
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    DeleteReview(reviewId: $reviewId) {
      success
      msg
    }
  }
`;

export const UPDATE_ADDRESS_Mutation = gql`
  mutation UpdateAddress(
    $addressId: ID!
    $addressLine1: String
    $city: String
    $state: String
    $pincode: String
  ) {
    UpdateAddress(
      addressId: $addressId
      addressLine1: $addressLine1
      city: $city
      state: $state
      pincode: $pincode
    ) {
      success
      msg
      address {
        id
        addressLine1
        city
        state
        pincode
      }
    }
  }
`;

export const DELETE_ADDRESS_Mutation = gql`
  mutation DeleteAddress($addressId: ID!) {
    DeleteAddress(addressId: $addressId) {
      success
      msg
    }
  }
`;