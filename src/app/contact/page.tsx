export default function ContactPage() {
  return (
    <div className="section">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-semibold text-brand-900">Contact us</h1>
        <p className="mt-2 text-sm text-brand-600">
          Reach out for order support, bulk requests, or product questions.
        </p>
        <form className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Full name" />
          <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Email" />
          <input className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm" placeholder="Phone" />
          <textarea
            className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm"
            rows={4}
            placeholder="How can we help?"
          ></textarea>
          <button className="rounded-full bg-brand-900 px-5 py-2 text-sm text-white">Send message</button>
        </form>
      </div>
    </div>
  );
}
