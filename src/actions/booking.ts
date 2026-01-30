"use server"

import { sdk } from "@/lib/medusa"

// 1. Create a Cart
export async function createBookingCart(data: { 
  variantId: string; 
  countryCode: string; 
  therapistId: string; 
  slot: string 
}) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  const res = await fetch(`${backendUrl}/store/custom/add-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
    body: JSON.stringify({
      variant_id: data.variantId,
      quantity: 1,
      country_code: data.countryCode,
      therapist_id: data.therapistId,
      metadata: { appointment_slot: data.slot }
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to create booking cart")
  }
  
  return await res.json() 
}

// 2. Update Customer Details
export async function updateBookingCustomer(cartId: string, customer: any) {
  return sdk.store.cart.update(cartId, {
    email: customer.email,
    shipping_address: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      phone: customer.phone,
      address_1: "Digital Booking",
      city: "Bangalore",
      country_code: "in",
      postal_code: "560001"
    },
    billing_address: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      address_1: "Digital Booking",
      city: "Bangalore",
      country_code: "in",
      postal_code: "560001"
    }
  })
}

// 3. Initialize Payment Sessions (FIXED: Uses fetch)
export async function initPaymentSessions(cartId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  const res = await fetch(`${backendUrl}/store/payment-collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
    body: JSON.stringify({ cart_id: cartId }),
    cache: "no-store",
  })

  if (!res.ok) {
    console.error("Payment Init Failed", await res.text())
    throw new Error("Failed to initialize payment sessions")
  }
  
  return await res.json()
}

// 4. Complete Order (Retain this)

import { revalidateTag } from "next/cache"

export async function completeBookingOrder(cartId: string) {
  try {
    // 1. Fetch available shipping options for this specific cart
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
      cart_id: cartId
    });

    if (!shipping_options || shipping_options.length === 0) {
      throw new Error("No shipping options found. Please create at least one 'Manual' shipping option in Medusa Admin.");
    }

    /** * 2. Map through required shipping profiles.
     * To satisfy the error "shipping profiles not satisfied", we ensure 
     * that for every unique shipping profile required by the items, 
     * a method is added. 
     */
    const uniqueProfileIds = Array.from(new Set(shipping_options.map(opt => opt.service_zone_id)));

    for (const profileId of uniqueProfileIds) {
      const option = shipping_options.find(opt => opt.service_zone_id === profileId) || shipping_options[0];
      
      await sdk.store.cart.addShippingMethod(cartId, {
        option_id: option.id,
      });
    }

    // 3. Complete the cart to create the order
    const response = await sdk.store.cart.complete(cartId);
    
    // In Medusa V2, successful completion returns { type: "order", order: ... }
    if (response.type === "order") {
      console.log("✅ Order Successful:", response.order.id);
      console.log("Order Total:", response.order.total);
      console.log("Customer Email:", response.order.email);
    }

    revalidateTag("cart");
    return response;
  } catch (error: any) {
    console.error("Order Completion Error:", error.message);
    throw error;
  }
}