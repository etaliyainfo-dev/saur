export default function AdminPage() {
  return (
    <div className="section">
      <div className="container space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Admin dashboard</h1>
          <p className="mt-2 text-sm text-brand-600">Manage products, orders, and performance.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Orders", value: "128" },
            { label: "Revenue", value: "₹3,42,990" },
            { label: "Conversion", value: "2.4%" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-brand-100 p-5">
              <div className="text-sm text-brand-500">{stat.label}</div>
              <div className="mt-2 text-2xl font-semibold text-brand-900">{stat.value}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-brand-100 p-6">
          <h2 className="text-lg font-semibold text-brand-900">Orders</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-brand-100">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 text-brand-500">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((order) => (
                  <tr key={order} className="border-t border-brand-100">
                    <td className="p-3">PIL-10{order}</td>
                    <td className="p-3">ankit@pillaa.com</td>
                    <td className="p-3">Packed</td>
                    <td className="p-3">₹5,497</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-brand-100 p-6">
          <h2 className="text-lg font-semibold text-brand-900">Product management</h2>
          <p className="mt-2 text-sm text-brand-600">
            Use the admin API to create, edit, and manage inventory per size.
          </p>
        </div>
      </div>
    </div>
  );
}
