export default function SizeGuidePage() {
  return (
    <div className="section">
      <div className="container max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-brand-900">Size Guide</h1>
        <p className="text-sm text-brand-600">
          Use the chart below to find your perfect Pillaa fit. If you are between sizes, choose the larger size
          for comfort.
        </p>
        <table className="w-full text-sm text-brand-700">
          <thead className="bg-brand-50 text-brand-500">
            <tr>
              <th className="p-3 text-left">UK Size</th>
              <th className="p-3 text-left">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {["6", "7", "8", "9", "10", "11", "12"].map((size, index) => (
              <tr key={size} className="border-t border-brand-100">
                <td className="p-3">{size}</td>
                <td className="p-3">{24.5 + index * 0.6}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
