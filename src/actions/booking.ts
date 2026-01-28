"use server"

import { sdk } from "@/lib/medusa"

// 1. Create a Cart with Therapist Metadata
export async function createBookingCart(data: { 
  variantId: string; 
  countryCode: string; 
  therapistId: string; 
  slot: string 
}) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  // Hit your custom backend endpoint
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

  if (!res.ok) throw new Error("Failed to create booking cart")
  
  return await res.json() // Returns { cart_id: "..." }
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

// 3. Initialize Payment Sessions
export async function initPaymentSessions(cartId: string) {
  return sdk.store.payment.initiatePaymentSession(cartId, {
     provider_id: "cashfree" // Initialize mostly used one, or handle generic
  })
}

// 4. Retrieve Full Cart
export async function getCart(cartId: string) {
  return sdk.store.cart.retrieve(cartId, {
    fields: "*payment_collection.payment_sessions,*items,*region"
  })
}

// 5. Complete Order
export async function completeBookingOrder(cartId: string) {
  return sdk.store.cart.complete(cartId)
}