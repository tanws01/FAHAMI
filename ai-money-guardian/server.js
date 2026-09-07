import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);

const profile = {
  income_tier: 'RM5,000–RM7,999',
  monthly_commitments: 2200,
  safe_spend_limit: 1200,
  identity_status: 'verified',
  source: 'T3N selective-disclosure credential (demo)'
};

function assess(amount) {
  const approved = amount > 0 && amount <= profile.safe_spend_limit;
  return {
    decision: approved ? 'APPROVED' : 'DENIED',
    amount,
    safe_spend_limit: profile.safe_spend_limit,
    reason: approved
      ? `RM${amount.toLocaleString()} is within your verified safe-spend limit.`
      : `RM${amount.toLocaleString()} exceeds your verified safe-spend limit of RM${profile.safe_spend_limit.toLocaleString()}.`,
    disclosed: ['identity_status', 'income_tier', 'safe_spend_limit'],
    hidden: ['full_name', 'IC_number', 'bank_account_number', 'exact_salary', 'transaction_history'],
    agent_identity: 'T3N agent identity: authenticated',
    audit_id: `AMG-${Date.now().toString(36).toUpperCase()}`,
    policy: 'spend <= verified safe-spend limit'
  };
}

async function json(res, status, body) {
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store'});
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/profile') return json(res, 200, profile);
    if (req.method === 'POST' && req.url === '/api/assess') {
      let raw=''; for await (const chunk of req) raw += chunk;
      const input = JSON.parse(raw || '{}');
      const amount = Number(input.amount);
      if (!Number.isFinite(amount) || amount <= 0) return json(res, 400, {error:'Enter a valid purchase amount.'});
      return json(res, 200, assess(amount));
    }
    if (req.method === 'GET') {
      const requested = req.url === '/' ? '/index.html' : req.url;
      const safe = path.normalize(requested).replace(/^([.][.][\\/])+/, '');
      const file = path.join(root, safe);
      const data = await readFile(file);
      const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html';
      res.writeHead(200, {'content-type': `${type}; charset=utf-8`}); res.end(data); return;
    }
    json(res, 404, {error:'Not found'});
  } catch (e) { json(res, 500, {error:e.message}); }
});

server.listen(port, () => console.log(`AI Money Guardian running at http://localhost:${port}`));
