import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="section">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-brand-100 p-6">
          <h1 className="text-2xl font-semibold text-brand-900">Login</h1>
          <form className="mt-4 space-y-4">
            <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Email" />
            <input
              type="password"
              className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm"
              placeholder="Password"
            />
            <button className="w-full rounded-full bg-brand-900 px-5 py-2 text-sm text-white">Login</button>
            <Link href="/forgot-password" className="text-xs text-brand-600 underline">
              Forgot password?
            </Link>
          </form>
        </div>
        <div className="rounded-2xl border border-brand-100 p-6">
          <h2 className="text-2xl font-semibold text-brand-900">Register</h2>
          <form className="mt-4 space-y-4">
            <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Full name" />
            <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Email" />
            <input
              type="password"
              className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm"
              placeholder="Create password"
            />
            <button className="w-full rounded-full border border-brand-200 px-5 py-2 text-sm text-brand-700">
              Create account
            </button>
          </form>
        </div>
      </div>
      <div className="container mt-10 rounded-2xl border border-brand-100 p-6">
        <h2 className="text-lg font-semibold text-brand-900">My orders</h2>
        <p className="mt-2 text-sm text-brand-600">Sign in to see your orders and saved addresses.</p>
      </div>
    </div>
  );
}
