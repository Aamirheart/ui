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
export async function initPaymentSession(cartId: string, providerId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  const cartData = await retrieveCart(cartId);
  const cart = cartData.cart || cartData;
  const paymentCollectionId = cart.payment_collection?.id;

  if (!paymentCollectionId) {
    throw new Error("DEBUG: No payment collection found. Check if the cart has an address and email.");
  }

  const res = await fetch(`${backendUrl}/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
    body: JSON.stringify({ provider_id: providerId }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Unknown Error" }));
    console.error("DEBUG: Backend Error Full Body:", errorData);
    
    // This will throw the specific Medusa error message (e.g., "Could not resolve razorpay")
    throw new Error(`Backend Error (${res.status}): ${errorData.message || JSON.stringify(errorData)}`);
  }

  return await res.json();
}