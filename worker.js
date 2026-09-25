// worker.js
// The whole server. Read it before you deploy it.
//
// One function. Cloudflare calls it with every request that reaches your
// workers.dev URL and sends back whatever Response you return.
//
// Four things to recognize here, because you will need to recognize them
// later in code you did not write:
//   env.DB      the D1 binding from wrangler.toml (no connection string, nothing to leak)
//   bind(?)     the user's value goes in as a parameter, never pasted into the SQL
//   status 400  the EARS "unwanted behavior" row, executable
//   CORS        headers that tell the browser your page is allowed to call this Worker

// Allow requests from the Codespaces Live Server page.
const CORS = {
  "access-control-allow-origin": "https://aaronsarasota04.github.io",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

export default {
  async fetch(request, env) {
    // Anything that throws below becomes a readable 500 instead of a bare
    // "Error 1101: Worker threw exception". The message names the cause,
    // which is what your verification table needs.
    try {
      return await handle(request, env);
    } catch (err) {
      return new Response("server error: " + err.message, { status: 500, headers: CORS });
    }
  },
};

async function handle(request, env) {
  const url = new URL(request.url);

  // Browsers send an OPTIONS "preflight" before a JSON POST from another
  // origin. Answer it with the CORS headers and nothing else.
  // (Not on the Session B slide; it is the one line the slide left out.)
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // The most common Session B failure: the D1 binding did not attach because
  // wrangler.toml still says PASTE_ID_HERE or the id was pasted badly.
  if (!env.DB) {
    return new Response(
      "server error: no D1 binding. Check database_id in wrangler.toml and redeploy.",
      { status: 500, headers: CORS });
  }

  if (request.method === "GET" && url.pathname === "/entries") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM entries ORDER BY id").all();
    return Response.json(results, { headers: CORS });
  }

  if (request.method === "POST" && url.pathname === "/entries") {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("body must be JSON", { status: 400, headers: CORS });
    }
    if (!body.text) {
      return new Response("text required", { status: 400, headers: CORS });
    }
    let parsedEntry = null;
    try {
      parsedEntry = JSON.parse(body.text);
    } catch {
      parsedEntry = null;
    }

    const fieldTooLong = parsedEntry && typeof parsedEntry === "object"
      ? [parsedEntry.userSkills, parsedEntry.jobText]
        .some(value => typeof value === "string" && value.length > 2000)
      : typeof body.text === "string" && body.text.length > 2000;

    if (fieldTooLong) {
      return new Response("text entry is too long", { status: 400, headers: CORS });
    }
    await env.DB.prepare("INSERT INTO entries (text) VALUES (?)")
      .bind(body.text).run();
    return new Response(null, { status: 201, headers: CORS });
  }

  return new Response("not found", { status: 404, headers: CORS });
}
