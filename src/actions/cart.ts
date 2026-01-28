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

export async function initPaymentSession(cartId: string, providerId: string) {
  return sdk.store.paymentCollection.managePaymentSession(cartId, {
      provider_id: providerId
  })
}