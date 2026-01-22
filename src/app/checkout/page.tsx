import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="section">
      <div className="container grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Checkout</h1>
          <form className="mt-6 space-y-6">
            <div className="rounded-2xl border border-brand-100 p-6">
              <h2 className="text-lg font-semibold text-brand-900">Shipping address</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Full name" />
                <input className="rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Phone" />
                <input className="md:col-span-2 rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Address line 1" />
                <input className="md:col-span-2 rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Address line 2" />
                <input className="rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="City" />
                <input className="rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="State" />
                <input className="rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Pincode" />
                <input className="rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Email (for order updates)" />
              </div>
            </div>

            <div className="rounded-2xl border border-brand-100 p-6">
              <h2 className="text-lg font-semibold text-brand-900">Payment</h2>
              <div className="mt-4 space-y-3 text-sm text-brand-700">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" defaultChecked /> Razorpay (UPI, Card, NetBanking)
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" /> Cash on Delivery (COD)
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
          <h2 className="text-lg font-semibold text-brand-900">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm text-brand-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹5,598</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹99</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-₹200</span>
            </div>
            <div className="border-t border-brand-200 pt-3 font-semibold text-brand-900">
              <div className="flex justify-between">
                <span>Total</span>
                <span>₹5,497</span>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold text-white">
            Pay secure
          </button>
          <Link href="/cart" className="mt-3 inline-flex text-sm text-brand-600 underline">
            Edit cart
          </Link>
        </div>
      </div>
    </div>
  );
}
