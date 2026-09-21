// Pull opening hours for each shop from Google (Places API, New) and write hours.json.
// Runs nightly via .github/workflows/update-hours.yml. Needs GOOGLE_MAPS_API_KEY.
// Fails (non-zero exit, hours.json untouched) if any shop can't be matched, so bad data never lands.

import { readFileSync, writeFileSync } from "node:fs";

const KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!KEY) { console.error("GOOGLE_MAPS_API_KEY is not set"); process.exit(1); }

const SHOPS = [
  { key: "brunswick", name: "Yo More Brunswick", query: "Yo More, 377 Sydney Rd, Brunswick VIC 3056", mustMatch: "377 Sydney" },
  { key: "geelong",   name: "Yo More Geelong",   query: "Yo More, 85 Ryrie St, Geelong VIC 3220",     mustMatch: "85 Ryrie" },
];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

async function lookup(shop) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.regularOpeningHours,places.businessStatus",
    },
    body: JSON.stringify({ textQuery: shop.query, languageCode: "en-AU", regionCode: "AU", maxResultCount: 3 }),
  });
  if (!res.ok) throw new Error(`${shop.key}: HTTP ${res.status} ${await res.text()}`);
  const { places = [] } = await res.json();
  const place = places.find(p => (p.formattedAddress || "").includes(shop.mustMatch));
  if (!place) throw new Error(`${shop.key}: no result matching "${shop.mustMatch}" (got ${places.map(p => p.formattedAddress).join(" | ") || "nothing"})`);
  if (!place.regularOpeningHours?.periods?.length) throw new Error(`${shop.key}: Google returned no opening hours`);
  return place;
}

// "2 – 9:30 pm" style, matching the site's existing format.
function fmtTime(h, m, withSuffix) {
  const suffix = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  const t = m ? `${hr}:${String(m).padStart(2, "0")}` : `${hr}`;
  return withSuffix ? `${t} ${suffix}` : t;
}
function fmtPeriod(p) {
  const o = p.open, c = p.close;
  if (!c) return "Open 24 hours";
  const sameHalf = (o.hour >= 12) === (c.hour >= 12);
  return `${fmtTime(o.hour, o.minute || 0, !sameHalf)} – ${fmtTime(c.hour, c.minute || 0, true)}`;
}

function toDays(periods) {
  const byDay = Array.from({ length: 7 }, () => []);
  for (const p of periods) if (p.open) byDay[p.open.day].push(p);
  // Site lists Monday first.
  return [1,2,3,4,5,6,0].map(d => ({
    day: DAYS[d],
    hours: byDay[d].length ? byDay[d].map(fmtPeriod).join(", ") : "Closed",
    periods: byDay[d].map(p => ({
      open:  `${String(p.open.hour).padStart(2,"0")}:${String(p.open.minute||0).padStart(2,"0")}`,
      close: p.close ? `${String(p.close.hour).padStart(2,"0")}:${String(p.close.minute||0).padStart(2,"0")}` : null,
      closeDay: p.close ? p.close.day : null,
    })),
  }));
}

const out = { updated: new Date().toISOString(), source: "google", shops: {} };
for (const shop of SHOPS) {
  const place = await lookup(shop);
  out.shops[shop.key] = {
    name: shop.name,
    placeId: place.id,
    address: place.formattedAddress,
    businessStatus: place.businessStatus || null,
    days: toDays(place.regularOpeningHours.periods),
  };
  console.log(`${shop.key}: ${place.formattedAddress}`);
  for (const d of out.shops[shop.key].days) console.log(`  ${d.day.padEnd(10)} ${d.hours}`);
}

// Don't churn a commit on the timestamp alone.
let prev = null;
try { prev = JSON.parse(readFileSync("hours.json", "utf8")); } catch {}
const same = prev && JSON.stringify(prev.shops) === JSON.stringify(out.shops);
if (same) { console.log("No change in hours."); process.exit(0); }
writeFileSync("hours.json", JSON.stringify(out, null, 2) + "\n");
console.log("hours.json updated.");
