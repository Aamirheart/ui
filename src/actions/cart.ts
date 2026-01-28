"use server"

import { sdk } from "@/lib/medusa"
import { revalidateTag } from "next/cache"

export async function retrieveCart(cartId: string) {
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
  // This is for selecting a specific one if needed, but Step 1 usually handles init
  return sdk.store.paymentCollection.managePaymentSession(cartId, {
      provider_id: providerId
  })
}