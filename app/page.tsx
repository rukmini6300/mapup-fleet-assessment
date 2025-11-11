"use client";

import { useEffect, useState } from "react";
import MapView from "../src/components/MapView";
import TripCard from '../src/components/TripCard'
// Type for a single fleet event
interface FleetEvent {
  timestamp: string;
  vehicle_id: string;
  event_type: string;
  location: { lat: number; lng: number };
}

export default function Home() {
  // ✅ Fixed: explicitly cast the initial state
  const [trips, setTrips] = useState<FleetEvent[][]>([] as FleetEvent[][]);
  const [insights, setInsights] = useState({
    halfComplete: 0,
    completed: 0,
    cancelled: 0,
    active: 0,
  });

  // 🧠 Load all trip JSONs
  useEffect(() => {
    const files = [
      "/data/trip_1_cross_country.json",
      "/data/trip_2_urban_dense.json",
      "/data/trip_3_mountain_cancelled.json",
      "/data/trip_4_southern_technical.json",
      "/data/trip_5_regional_logistics.json",
    ];

    Promise.all(
      files.map((file) =>
        fetch(file)
          .then((res) => res.json())
          .catch(() => [])
      )
    ).then((allTrips) => setTrips(allTrips));
  }, []);

  // 🧮 Compute Fleet-wide Insights
  useEffect(() => {
    if (trips.length === 0) return;

    let completed = 0;
    let cancelled = 0;
    let halfComplete = 0;
    let active = 0;

    trips.forEach((trip) => {
      if (trip.length === 0) return;

      const lastEvent = trip[trip.length - 1]?.event_type;
      const progress = (trip.length / 1000) * 100; // fake % (for demo)

      if (lastEvent === "trip_completed") completed++;
      else if (lastEvent === "trip_cancelled") cancelled++;
      else active++;

      if (progress >= 50) halfComplete++;
    });

    setInsights({ completed, cancelled, halfComplete, active });
  }, [trips]);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        Fleet Tracker Dashboard
      </h1>

      {/* 🧭 Fleet-wide Insights */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-white shadow-sm p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm text-gray-500">Trips ≥ 50% Complete</h3>
          <p className="text-2xl font-bold text-blue-700">
            {insights.halfComplete} / {trips.length}
          </p>
        </div>

        <div className="bg-white shadow-sm p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{insights.completed}</p>
        </div>

        <div className="bg-white shadow-sm p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm text-gray-500">Cancelled</h3>
          <p className="text-2xl font-bold text-red-500">{insights.cancelled}</p>
        </div>

        <div className="bg-white shadow-sm p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-yellow-500">{insights.active}</p>
        </div>
      </section>

      {/* Map */}
      <MapView trips={trips} />

      {/* Trip Details */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {trips.map((trip, idx) => {
          const start = trip[0]?.timestamp || "N/A";
          const end = trip[trip.length - 1]?.timestamp || "N/A";
          const vehicle = trip[0]?.vehicle_id || `Trip ${idx + 1}`;
          const status = trip[trip.length - 1]?.event_type || "unknown";

          return (
            <div
              key={idx}
              className="border border-gray-300 rounded-xl p-4 shadow-sm bg-black text-white"
            >
              <h3 className="text-lg font-semibold mb-1">{vehicle}</h3>
              <p>Status: {status}</p>
              <p>Start: {start}</p>
              <p>End: {end}</p>
            </div>
          );
        })}
      </section>
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
  {trips.map((trip, idx) => (
    <TripCard key={idx} trip={trip} idx={idx} />
  ))}
</section>
    </main>
  );
}
