"use client";

import { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useRazorpay } from "react-razorpay";
import { retrieveCart, applyPromotion, initPaymentSession } from "@/actions/cart";
import { completeBookingOrder } from "@/actions/booking";
import { Loader2, Tag, Calendar, MapPin, User, CheckCircle, TicketPercent } from "lucide-react";

const formatPrice = (amount: number, currency: string) => {
  if (!currency) return "";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount); 
};

export default function BookingSummary({ cartId, onBack }: { cartId: string, onBack: () => void }) {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Coupon State
  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Payment State
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { Razorpay } = useRazorpay();

  const refreshCart = async () => {
    try {
      const data = await retrieveCart(cartId);
      const fetchedCart = data.cart || data; 
      setCart(fetchedCart);
      
      const collection = fetchedCart.payment_collection;
      
      // 1. Check if we have sessions
      if (collection && collection.payment_sessions?.length > 0) {
        const activeSession = collection.payment_sessions.find((s: any) => s.status === "pending");
        if (activeSession) {
          setSelectedProvider(activeSession.provider_id);
        }
      } 
      // 2. If collection exists but NO sessions, we MUST initialize them
      else if (collection && (!collection.payment_sessions || collection.payment_sessions.length === 0)) {
         console.log("Collection exists but no sessions found. Initializing...");
         // ✅ FIX: Use the correct provider ID
         await initPaymentSession(cartId, "pp_razorpay_razorpay");
         const { cart: updatedCart } = await retrieveCart(cartId);
         setCart(updatedCart);
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [cartId]);

  const handleApplyCoupon = async () => {
    if (!promoCode) return;
    setIsApplying(true);
    setPromoError(null);
    
    const res = await applyPromotion(cartId, promoCode);
    if (res.success) {
      await refreshCart();
      setPromoCode("");
    } else {
      setPromoError(res.message || "Invalid coupon code");
    }
    setIsApplying(false);
  };

  const selectProvider = async (providerId: string) => {
    if (selectedProvider === providerId) return;

    console.log("Attempting to select provider:", providerId);
    setLoading(true);
    try {
      await initPaymentSession(cartId, providerId);
      await refreshCart();
      setSelectedProvider(providerId);
    } catch (e) {
      alert("Failed to select payment method");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cart || !selectedProvider) return;
    setIsProcessing(true);

    try {
      const session = cart.payment_collection.payment_sessions.find((s: any) => s.provider_id === selectedProvider);
      
      if (!session) throw new Error("Payment session invalid. Please refresh.");

      // ✅ FIX: Check using .includes() to handle prefixed IDs
      if (selectedProvider.includes('razorpay')) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
          amount: session.amount,
          currency: cart.currency_code.toUpperCase(),
          name: "Heart It Out",
          description: "Therapy Session",
          order_id: session.data.id,
          handler: async () => {
            const result = await completeBookingOrder(cart.id);
            if(result.type === "order") {
                window.location.href = `/booking/success?order_id=${result.order.id}`;
            } else {
                alert("Payment captured but order incomplete. Please contact support.");
            }
          },
          prefill: {
            name: `${cart.shipping_address?.first_name}`,
            email: cart.email,
            contact: cart.shipping_address?.phone
          },
          theme: { color: "#01818C" }
        };
        const rzp = new Razorpay(options);
        rzp.open();
      } 
      
      // --- CASHFREE ---
      else if (selectedProvider.includes('cashfree')) {
        const cashfree = await load({ mode: "sandbox" }); 
        cashfree.checkout({
          paymentSessionId: session.data.payment_session_id,
          returnUrl: `${window.location.origin}/booking/success?cart_id=${cart.id}`,
        });
      }

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !cart) return (
    <div className="flex flex-col items-center justify-center h-[300px]">
      <Loader2 className="animate-spin text-[#01818C] w-8 h-8"/>
      <p className="text-gray-400 text-xs mt-2">Loading details...</p>
    </div>
  );

  const item = cart.items?.[0];
  const metadata = item?.metadata || {};
  const customer = cart.shipping_address;
  const sessions = cart.payment_collection?.payment_sessions || [];

  return (
    <div className="animate-slot-fade space-y-5">
      <h2 className="text-center font-bold text-lg text-[#043953]">Review & Pay</h2>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm">
        <div className="flex items-start gap-3 border-b border-dashed border-slate-300 pb-3 mb-3">
            <div className="bg-white p-2 rounded-lg shadow-sm text-[#01818C]">
                <Calendar size={18} />
            </div>
            <div>
                <h3 className="font-bold text-[#043953]">Therapy Session</h3>
                <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                    <MapPin size={10}/> {metadata.appointment_slot || "Slot Selected"}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
            <User size={12}/> 
            <span>{customer?.first_name}</span> • <span>{cart.email}</span>
        </div>
      </div>

      <div>
        <div className="flex gap-2">
            <div className="relative flex-1">
                <TicketPercent className="absolute left-3 top-2.5 text-gray-400" size={14} />
                <input 
                    placeholder="Promo Code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#01818C]"
                />
            </div>
            <button 
                onClick={handleApplyCoupon}
                disabled={!promoCode || isApplying}
                className="bg-black text-white px-4 rounded-xl text-xs font-bold disabled:opacity-50"
            >
                {isApplying ? "..." : "Apply"}
            </button>
        </div>
        {promoError && <p className="text-red-500 text-[10px] mt-1 ml-1">{promoError}</p>}
        
        {cart.promotions?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
                {cart.promotions.map((p: any) => (
                    <span key={p.id} className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                        <Tag size={10}/> {p.code} applied
                    </span>
                ))}
            </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Payment Method</h3>
        <div className="space-y-2">
            {sessions.length === 0 && <p className="text-xs text-red-400">No payment options available.</p>}
            
           {sessions.map((s: any) => (
            <div 
                key={s.provider_id}
                onClick={() => selectProvider(s.provider_id)} 
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all
                    ${selectedProvider === s.provider_id 
                        ? "border-[#01818C] bg-[#E5F7F9] ring-1 ring-[#01818C]" 
                        : "border-gray-200 hover:border-gray-300 bg-white"}`}
            >
                <span className="text-sm font-medium capitalize text-slate-700">
                    {s.provider_id.includes('razorpay') 
                        ? 'Razorpay (UPI / Card)' 
                        : s.provider_id.includes('cashfree') 
                            ? 'Cashfree Payments' 
                            : s.provider_id}
                </span>
                {selectedProvider === s.provider_id && <CheckCircle size={16} className="text-[#01818C]"/>}
            </div>
        ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-end mb-4">
            <span className="text-sm text-slate-500">Total Amount</span>
            <span className="text-xl font-extrabold text-[#01818C]">
                {formatPrice(cart.total / 100, cart.currency_code)}
            </span>
        </div>
        
        <button 
            onClick={handlePayment}
            disabled={!selectedProvider || isProcessing}
            className="w-full bg-[#01818C] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#016d75] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center gap-2"
        >
            {isProcessing ? <Loader2 className="animate-spin" /> : "Secure Pay"}
        </button>
        
        <button onClick={onBack} className="w-full text-center text-slate-400 text-xs mt-3 hover:text-slate-600">
            Back to Details
        </button>
      </div>
    </div>
  );
}