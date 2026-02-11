import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="section">
      <div className="container max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-brand-900">Order confirmed!</h1>
        <p className="mt-2 text-sm text-brand-600">
          Thank you for shopping with Pillaa. Your order ID is <strong>PIL-10294</strong>.
        </p>
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-6 text-left">
          <h2 className="text-lg font-semibold text-brand-900">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm text-brand-700">
            <div className="flex justify-between">
              <span>Items</span>
              <span>2</span>
            </div>
            <div className="flex justify-between">
              <span>Total paid</span>
              <span>₹5,497</span>
            </div>
            <div className="flex justify-between">
              <span>Tracking</span>
              <span>Pending</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/track-order" className="rounded-full bg-brand-900 px-5 py-2 text-sm text-white">
            Track your order
          </Link>
          <Link href="/shop" className="rounded-full border border-brand-200 px-5 py-2 text-sm text-brand-700">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
