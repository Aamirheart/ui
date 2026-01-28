"use server"

import { sdk } from "@/lib/medusa"

export async function retrieveOrder(orderId: string) {
  return sdk.store.order.retrieve(orderId, {
    fields: "+items.metadata,+payment_collections,+shipping_address"
  })
}