export async function loadTripData() {
  const files = [
    "trip_1_cross_country.json",
    "trip_2_urban_dense.json",
    "trip_3_mountain_cancelled.json",
    "trip_4_southern_technical.json",
    "trip_5_regional_logistics.json",
  ];

  const promises = files.map(async (file) => {
    const res = await fetch(`/data/${file}`);
    const data = await res.json();
    return { id: file, events: data };
  });

  return Promise.all(promises);
}
