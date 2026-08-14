export type ZipLocation = {
  zip: string;
  city: string;
  state: string;
  stateAbbr: string;
  lat: number;
  lng: number;
};

const ZIP_GEOCODE_BASE_URL = process.env.ZIP_GEOCODE_BASE_URL ?? "https://api.zippopotam.us";

/** Zippopotam.us is free, keyless, and covers US ZIP codes — good enough for a fun MVP. */
export async function geocodeZip(rawZip: string): Promise<ZipLocation | null> {
  const zip = rawZip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(zip)) return null;

  const res = await fetch(`${ZIP_GEOCODE_BASE_URL}/us/${zip}`, {
    cache: "force-cache",
  });
  if (!res.ok) return null;

  const data = await res.json();
  const place = data?.places?.[0];
  if (!place) return null;

  return {
    zip,
    city: place["place name"],
    state: place["state"],
    stateAbbr: place["state abbreviation"],
    lat: parseFloat(place["latitude"]),
    lng: parseFloat(place["longitude"]),
  };
}
