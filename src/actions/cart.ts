"use server"

import { sdk } from "@/lib/medusa"
import { revalidateTag } from "next/cache"

export async function retrieveCart(cartId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  // Explicitly fetch with fresh data and expanded payment fields
  const res = await fetch(
    `${backendUrl}/store/carts/${cartId}?fields=+items.metadata,+payment_collection,+payment_collection.payment_sessions,+promotions`, 
    {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      cache: "no-store", // Force fresh data
      next: { tags: ["cart"] }
    }
  )

  if (!res.ok) {
    throw new Error("Failed to retrieve cart")
  }

  return await res.json()
}

export async function applyPromotion(cartId: string, code: string) {
  try {
    await sdk.store.cart.update(cartId, { promo_codes: [code] })
    revalidateTag("cart")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// src/actions/cart.ts
// src/actions/cart.ts

export async function initPaymentSession(cartId: string, providerId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  // 1. Get the cart to find the actual payment_collection.id
  const cartData = await retrieveCart(cartId);
  const cart = cartData.cart || cartData;
  const paymentCollectionId = cart.payment_collection?.id;

  if (!paymentCollectionId) {
    throw new Error("No payment collection found for this cart. Ensure initPaymentSessions(cartId) was called first.");
  }

  // 2. Use the paymentCollectionId in the URL, not the cartId
  const res = await fetch(`${backendUrl}/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
    body: JSON.stringify({ 
      provider_id: providerId 
      // Note: Some v2 setups also require 'amount' here if not already set
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Backend Error Details:", errorText);
    throw new Error(`Failed to initialize payment session: ${errorText}`);
  }

  return await res.json()
}