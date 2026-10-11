// Opt-in local QA transport. Never imported by the application.
// Start a separate localhost server with NODE_OPTIONS=--require <this file>.
const fs = require('node:fs');
const originalFetch = globalThis.fetch;
const log = process.env.QA_WRITE_LOG;
if (!log) throw new Error('QA_WRITE_LOG is required for the isolated QA server');
globalThis.fetch = async (input, init) => {
  const request = new Request(input, init);
  const url = new URL(request.url);
  const write = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  if (write && url.hostname.endsWith('.supabase.co') && url.pathname === '/rest/v1/contact_submissions') {
    fs.appendFileSync(log, JSON.stringify({ sink: 'contact_submissions', body: await request.json() }) + '\n');
    return new Response(null, { status: 201 });
  }
  if (write && url.hostname === 'api.resend.com' && url.pathname === '/emails') {
    const body = await request.json();
    fs.appendFileSync(log, JSON.stringify({ sink: 'email', subject: body.subject, html: body.html }) + '\n');
    return Response.json({ id: 'isolated-qa-email' });
  }
  if (write && !['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Unexpected external write blocked by QA transport');
  return originalFetch(input, init);
};
