const fetch = require('node-fetch');
async function listModels() {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6JUyFUIqv6KExsk1ZwRZAMnCbc8Bcx-O5yPSmc_tz_w8w');
  const data = await res.json();
  data.models.forEach(m => console.log(m.name));
}
listModels();
