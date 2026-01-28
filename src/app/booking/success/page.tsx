import { retrieveOrder } from "@/actions/order";
import { completeBookingOrder } from "@/actions/booking";
import { CheckCircle, Calendar, User, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BookingSuccessPage({ 
  searchParams 
}: { 
  searchParams: { order_id?: string; cart_id?: string } 
}) {
  let order;

  // 1. If we have an Order ID, fetch it directly
  if (searchParams.order_id) {
    try {
      const res = await retrieveOrder(searchParams.order_id);
      order = res.order;
    } catch (e) {
      console.error("Order fetch failed", e);
    }
  } 
  // 2. If we only have a Cart ID (Cashfree flow), complete the cart to get the order
  else if (searchParams.cart_id) {
    try {
      const res = await completeBookingOrder(searchParams.cart_id);
      if (res.type === "order") {
        order = res.order;
      }
    } catch (e) {
      console.error("Cart completion failed", e);
    }
  }

  // 3. Error State
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-[#01818C] mb-2" />
        <p className="text-gray-500">Processing your booking...</p>
        <p className="text-xs text-gray-400 mt-2">If this takes too long, check your email for confirmation.</p>
      </div>
    );
  }

  // 4. Extract Data for UI
  const item = order.items?.[0];
  const metadata = item?.metadata || {};
  const dateStr = metadata.appointment_slot as string;
  
  // Format Date
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Success Header */}
        <div className="bg-[#01818C] p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="text-white/80 text-sm mt-1">Order #{order.display_id}</p>
        </div>

        {/* Order Details */}
        <div className="p-6 space-y-6">
          
          <div className="text-center border-b border-gray-100 pb-6">
            <p className="text-gray-500 text-sm mb-1">Total Amount Paid</p>
            <p className="text-3xl font-extrabold text-[#043953]">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency_code.toUpperCase() }).format(order.total / 100)}
            </p>
          </div>

          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-2.5 rounded-xl text-[#01818C]">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date & Time</p>
                <p className="font-semibold text-gray-800">{formattedDate}</p>
                <p className="text-sm text-gray-500">{formattedTime}</p>
              </div>
            </div>

            {/* Patient */}
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Patient Details</p>
                <p className="font-semibold text-gray-800">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                <p className="text-sm text-gray-500">{order.email}</p>
                <p className="text-sm text-gray-500">{order.shipping_address?.phone}</p>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-start gap-4">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Service</p>
                <p className="font-semibold text-gray-800">{item?.title}</p>
                <p className="text-sm text-gray-500">Therapist ID: {metadata.therapist_id}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl text-center transition-colors">
              Book Another Session
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}