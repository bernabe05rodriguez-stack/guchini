import { MercadoPagoConfig, Preference, Payment } from "mercadopago"

function getClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  })
}

export function getPreferenceClient() {
  return new Preference(getClient())
}

export function getPaymentClient() {
  return new Payment(getClient())
}
