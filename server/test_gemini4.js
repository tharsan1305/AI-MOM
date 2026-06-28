const fetch = require('node-fetch'); // node v22 has global fetch, we don't need require.

async function listModels() {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6JUyFUIqv6KExsk1ZwRZAMnCbc8Bcx-O5yPSmc_tz_w8w');
    const data = await res.json();
    console.log(data);
  } catch(e) {
    console.error(e.message);
  }
}
listModels();
