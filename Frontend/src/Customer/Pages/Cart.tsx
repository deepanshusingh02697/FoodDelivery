import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import type {
  Clear_Cart_Interface,
  DecreaseCartItem_Mutation_Interface,
  GetCart_Query_Interface,
  MyAddresses_Query_Interface,
  AddAddress_Mutation_Interface,
  UpdateAddress_Mutation_Interface,
  DeleteAddress_Mutation_Interface,
  PayOrder_Mutation_Interface,
  PlaceOrder_Mutation_Interface,
  PostAdd_To_Cart_Interface,
  VerifyPayment_Mutation_Interface,
} from "../../graphql/Client";
import { GET_CART_Query, MY_ADDRESSES_Query } from "../../graphql/Query";
import { clearCartLocal, setCart } from "../../Redux/Slices/cartSlice";
import {
  ADD_TO_CART_Mutation,
  ADD_ADDRESS_Mutation,
  UPDATE_ADDRESS_Mutation,
  DELETE_ADDRESS_Mutation,
  CLEAR_CART_Mutation,
  DECREASE_CART_ITEM_Mutation,
  PAY_ORDER_Mutation,
  PLACE_ORDER_Mutation,
  VERIFY_PAYMENT_Mutation,
} from "../../graphql/Mutation";
import {
  FaRupeeSign,
  FaMapMarkerAlt,
  FaPlus,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { useEffect } from "react";

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartId = useAppSelector((state) => state.cart.cartId);
  const restaurantId = useAppSelector((state) => state.cart.restaurantId);
  const restaurantName = useAppSelector((state) => state.cart.restaurantName);
  const cartItems = useAppSelector((state) => state.cart.items);

  const user = useAppSelector((state) => state.auth.user);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );

  const { data } = useQuery<GetCart_Query_Interface>(GET_CART_Query, {
    variables: { restaurantId },
    skip: !restaurantId,
    fetchPolicy: "network-only",
  });

  const { data: addressData, refetch: refetchAddresses } =
    useQuery<MyAddresses_Query_Interface>(MY_ADDRESSES_Query, {
      fetchPolicy: "network-only",
    });

  const addresses = addressData?.MyAddresses ?? [];

  useEffect(() => {
    if (data?.GetCart) {
      dispatch(setCart(data.GetCart));
    }
  }, [data, dispatch]);

  const firstAddressId = useMemo(() => {
    if (addresses.length === 0) return null;
    return addresses[0].id;
  }, [addresses]);

  const existAdd = selectedAddressId ?? firstAddressId;

  const isAddressFormVisible = showAddressForm || addresses.length === 0;

  const [addToCartMutation] =
    useMutation<PostAdd_To_Cart_Interface>(ADD_TO_CART_Mutation);
  const [decreaseCartItemMutation] =
    useMutation<DecreaseCartItem_Mutation_Interface>(
      DECREASE_CART_ITEM_Mutation,
    );
  const [clearCartMutation] =
    useMutation<Clear_Cart_Interface>(CLEAR_CART_Mutation);
  const [placeOrderMutation] =
    useMutation<PlaceOrder_Mutation_Interface>(PLACE_ORDER_Mutation);
  const [addAddressMutation] =
    useMutation<AddAddress_Mutation_Interface>(ADD_ADDRESS_Mutation);
  const [updateAddressMutation] = useMutation<UpdateAddress_Mutation_Interface>(
    UPDATE_ADDRESS_Mutation,
  );
  const [deleteAddressMutation] = useMutation<DeleteAddress_Mutation_Interface>(
    DELETE_ADDRESS_Mutation,
  );

  const [payOrderMutation] =
    useMutation<PayOrder_Mutation_Interface>(PAY_ORDER_Mutation);

  const [verifyPaymentMutation] = useMutation<VerifyPayment_Mutation_Interface>(
    VERIFY_PAYMENT_Mutation,
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0,
  );
  const deliveryFee = cartItems.length > 0 ? 29 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  const handleIncrease = async (menuItemId: string) => {
    try {      
      const { data } = await addToCartMutation({
        variables: { input: { menuItemId, quantity: 1 } },
      });
      if (data?.AddToCart?.success) {
        dispatch(setCart(data.AddToCart.cart));
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update quantity");
    }
  };

  const handleDecrease = async (cartItemId: string) => {
    try {
      const { data } = await decreaseCartItemMutation({
        variables: { cartItemId },
      });
      if (data?.DecreaseCartItem?.success) {
        dispatch(setCart(data.DecreaseCartItem.cart));
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update quantity");
    }
  };

  const handleClearCart = async () => {
    if (!cartId) return;
    try {
      const { data } = await clearCartMutation({ variables: { cartId } });
      if (data?.ClearCart?.success) {
        dispatch(clearCartLocal());
        toast.info("Cart cleared");
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't clear cart");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const openAddAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm({ addressLine1: "", city: "", state: "", pincode: "" });
    setShowAddressForm(true);
  };

  const openEditAddressForm = (addr: {
    id: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      addressLine1: addr.addressLine1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    const { addressLine1, city, state, pincode } = addressForm;
    if (
      !addressLine1.trim() ||
      !city.trim() ||
      !state.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    if(!/^\d{6}$/.test(pincode)){
      toast.error("Fill in a valid address (6-digit pincode required)");
      return
    }
    setSavingAddress(true);
    try {
      if (editingAddressId) {
        const { data } = await updateAddressMutation({
          variables: {
            input: {
              addressId: editingAddressId,
              ...addressForm,
            },
          },
        });

        if (data?.UpdateAddress?.success) {
          toast.success("Address updated");
          resetAddressForm();
          await refetchAddresses();
        } else {
          toast.error(data?.UpdateAddress?.msg ?? "Couldn't update address");
        }
      } else {
        const { data } = await addAddressMutation({
          variables: { input:addressForm},
        });

        if (data?.AddAddress?.success) {
          toast.success("Address saved");
          setSelectedAddressId(data.AddAddress.address.id);
          resetAddressForm();
          await refetchAddresses();
        } else {
          toast.error(data?.AddAddress?.msg ?? "Couldn't save address");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        editingAddressId ? "Couldn't update address" : "Couldn't save address",
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );
    if (!confirmed) return;

    setDeletingAddressId(addressId);
    try {
      const { data } = await deleteAddressMutation({
        variables: { addressId },
      });

      if (data?.DeleteAddress?.success) {
        toast.success("Address deleted");
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
        if (editingAddressId === addressId) {
          resetAddressForm();
        }
        await refetchAddresses();
      } else {
        toast.error(data?.DeleteAddress?.msg ?? "Couldn't delete address");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Couldn't delete address",
      );
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cartId) return;
    if (!existAdd) {
      toast.error("Please select a delivery address");
      return;
    }

    setPlacingOrder(true);
    try {
      const { data: placeData } = await placeOrderMutation({
        variables: {
          input: {
            cartId,
            addressId: existAdd,
          },
        },
      });

      if (!placeData?.PlaceOrder?.success) {
        throw new Error(placeData?.PlaceOrder?.msg || "Couldn't place order");
      }

      const orderId = placeData.PlaceOrder.order.id;

      const { data: payData } = await payOrderMutation({
        variables: { orderId },
      });

      if (!payData?.PayOrder?.success) {
        throw new Error(payData?.PayOrder?.msg || "Couldn't start payment");
      }

      const razorpayOrder = payData.PayOrder.razorpayOrder;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Zomato Clone",
        description: `Order #${orderId}`,
        order_id: razorpayOrder.id,

        prefill: {
          name: user ? `${user.firstname} ${user.lastname}` : "",
          email: user?.email ?? "",
          contact: "",
        },

        theme: {
          color: "#ef4444",
        },

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const { data: verifyData } = await verifyPaymentMutation({
              variables: {
                input: {
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              },
            });

            if (verifyData?.VerifyPayment?.success) {
              dispatch(clearCartLocal());
              toast.success("Payment successful!");
              navigate(`/orders/${orderId}`);
            } else {
              toast.error(
                verifyData?.VerifyPayment?.msg ??
                  "Payment verification failed.",
              );
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed.");
          } finally {
            setPlacingOrder(false);
          }
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled.");
            setPlacingOrder(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Couldn't place order.",
      );
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-bold mt-6">Your cart is empty</h2>
        <p className="text-gray-400 mt-2">
          Add some delicious items to get started
        </p>
        <button
          onClick={() => navigate("/discover")}
          className="mt-6 bg-red-500 px-6 py-3 rounded-xl font-bold hover:bg-red-600"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10 mx-auto w-full">
      <h1 className="text-2xl font-bold">Cart & Checkout</h1>
      <p className="text-gray-400 mt-1">
        {restaurantName ?? "Restaurant"} · {cartItems.length} item
        {cartItems.length > 1 ? "s" : ""}
      </p>

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1d1816] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">Order Items</h2>
              <span className="bg-red-500/20 text-red-400 text-sm px-3 py-1 rounded-full">
                {cartItems.length} items
              </span>
            </div>

            <div className="divide-y divide-white/10">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-4"
                >
                  <div>
                    <p className="font-semibold">{item.menuItem.name}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <FaRupeeSign /> {item.priceAtAdd} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-red-500 rounded-lg px-4 py-2">
                    <button onClick={() => handleDecrease(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.menuItem.id)}>
                      +
                    </button>
                  </div>

                  <span className="font-bold w-16 text-right flex items-center">
                    <FaRupeeSign />
                    {item.priceAtAdd * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleClearCart}
              className="mt-4 text-sm text-gray-400 hover:text-red-400"
            >
              Clear cart
            </button>
          </div>

          <div className="bg-[#1d1816] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" /> Deliver to
              </h2>
              {addresses.length > 0 && !isAddressFormVisible && (
                <button
                  onClick={openAddAddressForm}
                  className="text-sm text-red-400 hover:underline flex items-center gap-1"
                >
                  <FaPlus size={10} /> Add new
                </button>
              )}
            </div>

            {!isAddressFormVisible ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedAddressId(addr.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedAddressId(addr.id);
                      }
                    }}
                    className={`w-full text-left rounded-xl p-4 border transition-colors cursor-pointer ${
                      existAdd === addr.id
                        ? "border-red-500 bg-red-500/10"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold">Address</span>
                        <p className="text-gray-400 text-sm mt-1">
                          {addr.addressLine1}, {addr.city}, {addr.state}{" "}
                          {addr.pincode}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditAddressForm(addr);
                          }}
                          className=" text-white"
                          aria-label="Edit address"
                        >
                          <FaPen size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);
                          }}
                          disabled={deletingAddressId === addr.id}
                          className="text-white

                          disabled:opacity-50"
                          aria-label="Delete address"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  placeholder="Enter Full address (AddressLine)"
                  value={addressForm.addressLine1}
                  onChange={(e) =>
                    setAddressForm((f) => ({
                      ...f,
                      addressLine1: e.target.value,
                    }))
                  }
                  className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-red-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-red-500"
                  />
                  <input
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm((f) => ({ ...f, state: e.target.value }))
                    }
                    className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-red-500"
                  />
                </div>
                <input
                  placeholder="Pincode"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm((f) => ({ ...f, pincode: e.target.value }))
                  }
                  maxLength={6}
                  className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-red-500"
                />

                <div className="flex gap-3 pt-1">
                  {addresses.length > 0 && (
                    <button
                      onClick={resetAddressForm}
                      className="flex-1 border border-white/10 rounded-lg py-2.5 text-sm text-gray-300 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    className="flex-1 bg-red-500 rounded-lg py-2.5 text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
                  >
                    {savingAddress
                      ? "Saving..."
                      : editingAddressId
                        ? "Update address"
                        : "Save address"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky top-24 h-fit bg-[#1d1816] rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-xl">Order Summary</h2>

          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span className="flex items-center">
                <FaRupeeSign />
                {subtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="flex items-center">
                <FaRupeeSign />
                {deliveryFee}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Charges (5%)</span>
              <span className="flex items-center">
                <FaRupeeSign />
                {taxes}
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
            <span>Total to Pay</span>
            <span className="flex items-center">
              <FaRupeeSign />
              {total}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder || !existAdd}
            className="w-full bg-red-500 py-4 rounded-xl font-bold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-1"
          >
            Place order{" "}
            <span className="flex items-center justify-center gap-1">
              <FaRupeeSign /> {total}
            </span>
          </button>
          {!existAdd && (
            <p className="text-xs text-red-400 text-center">
              Select a delivery address to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
