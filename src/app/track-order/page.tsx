export default function TrackOrderPage() {
  return (
    <div className="section">
      <div className="container max-w-xl">
        <h1 className="text-3xl font-semibold text-brand-900">Track your order</h1>
        <p className="mt-2 text-sm text-brand-600">Enter your order ID and phone/email to track shipment.</p>
        <form className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Order ID" />
          <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Phone or email" />
          <button className="w-full rounded-full bg-brand-900 px-5 py-2 text-sm text-white">Track order</button>
        </form>
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm text-brand-700">
          <p>Status: Packed</p>
          <p>Courier: To be assigned</p>
          <p>Tracking link: Available after dispatch</p>
        </div>
      </div>
    </div>
  );
}
