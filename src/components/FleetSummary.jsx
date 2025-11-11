export default function FleetSummary({ events }) {
  const completed = events.filter((e) => e.event_type === "trip_completed").length;
  const cancelled = events.filter((e) => e.event_type === "trip_cancelled").length;

  return (
    <div className="mt-4 bg-white shadow p-4 rounded-lg flex justify-between text-sm font-medium">
      <span>Total Events: {events.length}</span>
      <span>Completed Trips: {completed}</span>
      <span>Cancelled: {cancelled}</span>
    </div>
  );
}
