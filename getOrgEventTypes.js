// getOrgEventTypes.js
const fetch = require("node-fetch");

const API_KEY =
  "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzUzMjI1NTA0LCJqdGkiOiJjMDMzMTlhMi1iMGI0LTRjM2UtOTVhNy03ODI3ODhhNDVkZDYiLCJ1c2VyX3V1aWQiOiJFREdCR0FIM09ES1lESkRVIn0.w_Y3ubad0CcvVPyo623RbGO5kVDTjL0q_UeDvgOq6vjxNp0HUZ9rZbMnzEuVPRq1Yg7q6c6btn0sQ59ZDzwv5g";
// ← your Calendly PAT
const ORG_URI = "https://api.calendly.com/organizations/FCCAGAG5LGODOMQQ";

async function getOrgEventTypes() {
  try {
    // Attach the org URI as a query parameter
    const url = `https://api.calendly.com/event_types?organization=${encodeURIComponent(
      ORG_URI
    )}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await res.json();

    if (data.collection && data.collection.length) {
      console.log("✅ Found these event types in your org:\n");
      data.collection.forEach((evt, i) => {
        console.log(`${i + 1}. ${evt.name}`);
        console.log(`   URI:      ${evt.uri}`);
        console.log(`   Duration: ${evt.duration} minutes`);
        console.log(`   Active:   ${evt.active}\n`);
      });
    } else {
      console.log("⚠️ No event types found under that organization.");
    }
  } catch (err) {
    console.error("❌ Error fetching org event types:", err.message);
  }
}

getOrgEventTypes();
