export const typeDefs = `#graphql

enum Role {
  CUSTOMER
  OWNER
  ADMIN
  DELIVERY_PARTNER
}
enum RestaurantStatus {
  PENDING
  APPROVED
  REJECTED
}

enum OrderStatus {
  PLACED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELED
}

type User {
  id: ID!
  firstname: String!
  lastname: String!
  email: String!
  phone: String
  phoneVerified: Boolean!

  role: Role!

  restaurant: [Restaurant!]!
  approved: [Restaurant!]!
  created_at: String!
}

type Restaurant {
  id: ID!
  restaurantName: String!
  cuisine: String!
  address: String!
  phone:String!
  fssaiNumber: String
  gstNumber: String
  status: RestaurantStatus!

  ownerId: ID!
  owner: User!

  approvedBy: ID
  approvedAt: String
  admin: User

  createdAt: String!
  updatedAt: String!
}
type MenuItem {
  id: ID!
  name: String!
  description: String
  price:       Float!
  category:    String!
  isVeg:     Boolean!
  imageUrl:    String
  isAvailable: Boolean!
  
  trackStock: Boolean    
  stockQuantity: Int 

  createdAt:   String!

  restaurantId: ID!
  restaurant: Restaurant!

  cartItems: [CartItem!]!
}

type Cart {
  id: ID!

  userId: ID!
  user:  User!

  restaurantId: ID!
  restaurant:   Restaurant!

  items: [CartItem!]!
}

type CartItem {
  id:ID!
  
  quantity:Int!
  priceAtAdd:Float!

  cartId:ID!
  cart: Cart!

  menuItemId: ID!
  menuItem:MenuItem!
}



type OrderItem {
  id: ID!
  nameSnapshot: String!
  priceSnapshot: Float!
  quantity: Int!
  menuItem: MenuItem
}

type Order {
  id: ID!
  userId: ID!
  user: User!
  restaurantId: ID!
  restaurant: Restaurant!
  status: OrderStatus!
  subtotal: Float!
  deliveryFee: Float!
  totalAmount: Float!
  placedAt: String!
  deliveredAt: String
  items: [OrderItem!]!
  deliveryPartnerId: ID
  deliveryPartner: User
  deliveryTracking: DeliveryTracking
}
type DeliveryTracking {
  id: ID!
  lat: Float!
  lng: Float!
  updatedAt: String!
}




type OrderPayload {
  success: Boolean!
  msg: String!
  order: Order
}

type UserPayload {
  success:Boolean!
  msg:String!
  user:User
}
type RestaurantPayload {
  success:Boolean!
  msg:String!
  restaurant:Restaurant
}
type MenuItemPayload {
  success: Boolean!
  msg: String!
  menuItem: MenuItem
}
type CartPayload {
  success: Boolean!
  msg: String!
  cart: Cart
}

type Query {
  GetCurrentUser: User!
  GetPendingRestaurants: [Restaurant!]!
  MyRestaurantMenu: [MenuItem!]!
  MyOrders:[Order!]!
  RestaurantOrders: [Order!]!
  GetRestaurants: [Restaurant!]!
  FilterRestaurants(search: String, cuisine: String, vegOnly: Boolean): [Restaurant!]!
  # OrderTracking(orderId: ID!): DeliveryTracking
}

type Mutation {
  SignUp(
    firstname: String!
    lastname: String!
    email: String!
    password: String!
    phone: String
  ): UserPayload!

  LogIn(email: String!, password: String!): UserPayload!
  OwnerLogIn(email:String!,password:String!):UserPayload!
  AdminLogIn(email: String!, password: String!): UserPayload!
  LogOut: UserPayload!

  DeliveryPartnerSignUp(firstname: String!, lastname: String!, email: String!, password: String!, phone: String!): UserPayload!
  DeliveryPartnerLogIn(email: String!, password: String!): UserPayload!

  RegisterRestaurantOwner(
    firstname: String!
    lastname: String!
    email: String!
    password: String!
    phone: String!
    restaurantName: String!
    cuisine: String!
    address: String!
    fssaiNumber: String
    gstNumber: String
  ): RestaurantPayload!


  # OWNER
  CreateMenuItem(name: String!, description: String, price: Float!, category: String!, isVeg: Boolean!, imageUrl: String, trackStock: Boolean, stockQuantity: Int): MenuItemPayload!

  UpdateMenuItem(menuItemId: ID!, name: String, price: Float, category: String, isVeg: Boolean, description: String, imageUrl: String): MenuItemPayload!

  ToggleMenuItemAvailability(menuItemId: ID!): MenuItemPayload!
  UpdateStock(menuItemId: ID!, stockQuantity: Int!): MenuItemPayload!

  DeleteMenuItem(menuItemId: ID!): MenuItemPayload!



  # CUSTOMER
  AddToCart(menuItemId: ID!, quantity: Int!): CartPayload!
  RemoveFromCart(cartItemId: ID!): CartPayload!
  ClearCart(cartId: ID!): CartPayload!

  PlaceOrder(cartId: ID!): OrderPayload!
  UpdateOrderStatus(orderId: ID!, status: OrderStatus!): OrderPayload!


  # ADMIN
  ApproveRestaurant(restaurantId: ID!): RestaurantPayload!
  RejectRestaurant(restaurantId: ID!): RestaurantPayload!

  # Delivery man
  AssignDeliveryPartner(orderId: ID!, deliveryPartnerId: ID!): OrderPayload!
  UpdateDeliveryLocation(orderId: ID!, lat: Float!, lng: Float!): DeliveryTracking!
  MarkDelivered(orderId: ID!): OrderPayload!
}
`;
