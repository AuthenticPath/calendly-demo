// decisionEngine.js

const fetch = require("node-fetch");

/**
 * Fetches available time slots for a given Calendly event type.
 *
 * @param {string} eventTypeApiUrl – The Calendly API URL for the event type
 *   (e.g. https://api.calendly.com/event_types/{UUID})
 * @param {string} startIso – ISO timestamp for the start of the window
 * @param {string} endIso – ISO timestamp for the end of the window
 * @param {string} apiKey – Your Calendly personal access token
 * @returns {Promise<Array>} – An array of available time slots
 * @throws – If Calendly responds with a non-2xx status
 */
async function getSlots(eventTypeApiUrl, startIso, endIso, apiKey) {
  const url =
    "https://api.calendly.com/event_type_available_times" +
    `?event_type=${encodeURIComponent(eventTypeApiUrl)}` +
    `&start_time=${encodeURIComponent(startIso)}` +
    `&end_time=${encodeURIComponent(endIso)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Calendly API Error: ${res.status} – ${errorBody}`);
  }

  const data = await res.json();
  return Array.isArray(data.collection) ? data.collection : [];
}

/**
 * Chooses which embed URL to use based on which calendar has availability.
 *
 * @param {string} eventTypeUriA – API URI for calendar A
 * @param {string} eventTypeUriB – API URI for calendar B
 * @param {string} embedUrlA – Public embed link for calendar A
 * @param {string} embedUrlB – Public embed link for calendar B
 * @param {string} apiKey – Your Calendly personal access token
 * @returns {Promise<{winner: string, widgetUrl: string}>}
 */
async function choosePreferredCalendar(
  eventTypeUriA,
  eventTypeUriB,
  embedUrlA,
  embedUrlB,
  apiKey
) {
  // 1 minute from now, to satisfy "start_time must be in the future"
  const startDate = new Date(Date.now() + 1 * 60 * 1000);
  // Cap the window at 7 days (maximum allowed by Calendly)
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const endDate = new Date(startDate.getTime() + sevenDaysMs);

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

  // Fetch availability for both calendars in parallel
  const [slotsA, slotsB] = await Promise.all([
    getSlots(eventTypeUriA, startIso, endIso, apiKey),
    getSlots(eventTypeUriB, startIso, endIso, apiKey),
  ]);

  // Decide which to use
  if (slotsA.length > 0) {
    return { winner: "A", widgetUrl: embedUrlA };
  } else if (slotsB.length > 0) {
    return { winner: "B", widgetUrl: embedUrlB };
  } else {
    // No slots — fall back to B
    return { winner: "none", widgetUrl: embedUrlB };
  }
}

module.exports = { choosePreferredCalendar };
