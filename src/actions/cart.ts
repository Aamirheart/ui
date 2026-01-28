"use server"

import { sdk } from "@/lib/medusa"
import { revalidateTag } from "next/cache"

export async function retrieveCart(cartId: string) {
  // Fetch cart with all necessary relations for the summary
  return sdk.store.cart.retrieve(cartId, {
    fields: "+items.metadata,+payment_collection.payment_sessions,+promotions"
  })
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
  try {
    const res = await sdk.store.payment.initiatePaymentSession(cartId, {
      provider_id: providerId
    })
    revalidateTag("cart")
    return res
  } catch (error: any) {
    console.error("Payment Init Error:", error)
    throw new Error(error.message)
  }
}