export default function TripCard({ trip, idx }) {
  const start = trip[0]?.timestamp || "N/A";
  const end = trip[trip.length - 1]?.timestamp || "N/A";
  const vehicle = trip[0]?.vehicle_id || `Trip ${idx + 1}`;
  const status = trip[trip.length - 1]?.event_type || "unknown";

  return (
    <div className="border border-gray-300 rounded-xl p-4 shadow-sm bg-black text-white">
      <h3 className="text-lg font-semibold mb-1">{vehicle}</h3>
      <p>Status: {status}</p>
      <p>Start: {start}</p>
      <p>End: {end}</p>
    </div>
  );
}
