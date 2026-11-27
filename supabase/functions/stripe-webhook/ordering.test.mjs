// Run with: node --test supabase/functions/stripe-webhook/ordering.test.mjs  (Node 22.18+ / 24; no Deno or install needed)
// Loads the Deno handler as-is, with its remote imports and Deno.env stubbed.
import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

// Tiny in-memory stand-in for the supabase-js query builder (update/eq/or/is/lt) used by the handler.
function makeDb(tables) {
  const matchOr = (row, expr) =>
    expr.split(',').some((cond) => {
      const [col, op, ...rest] = cond.split('.');
      const val = rest.join('.');
      if (op === 'is' && val === 'null') return row[col] == null;
      if (op === 'lt') {
        if (row[col] == null) return false;
        return !isNaN(Number(row[col])) && !isNaN(Number(val)) ? Number(row[col]) < Number(val) : new Date(row[col]) < new Date(val);
      }
      if (op === 'eq') return String(row[col]) === val;
      return false;
    });
  return {
    from(name) {
      return {
        insert: async () => ({ data: null, error: null }),
        update(values) {
          const eqs = [];
          let orExpr = null;
          const q = {
            eq(c, v) { eqs.push([c, v]); return q; },
            or(e) { orExpr = e; return q; },
            then(res, rej) {
              for (const r of tables[name]) {
                if (eqs.every(([c, v]) => r[c] === v) && (!orExpr || matchOr(r, orExpr))) Object.assign(r, values);
              }
              return Promise.resolve({ data: null, error: null }).then(res, rej);
            },
          };
          return q;
        },
      };
    },
  };
}

const stubs = {
  'https://deno.land/std@0.190.0/http/server.ts': 'export const serve = (h) => { globalThis.__handler = h }',
  'https://esm.sh/stripe@14.21.0': 'export default class Stripe { webhooks = { constructEventAsync: async (body) => JSON.parse(body) } }',
  'https://esm.sh/@supabase/supabase-js@2.45.0': 'export const createClient = () => globalThis.__db',
}
registerHooks({
  resolve(spec, ctx, next) {
    return stubs[spec] ? { url: 'stub:' + spec, shortCircuit: true } : next(spec, ctx)
  },
  load(url, ctx, next) {
    return url.startsWith('stub:')
      ? { format: 'module', source: stubs[url.slice(5)], shortCircuit: true }
      : next(url, ctx)
  },
})
const env = { STRIPE_SECRET_KEY: 'sk_test', STRIPE_WEBHOOK_SECRET: 'whsec_test', SUPABASE_URL: 'http://localhost', SUPABASE_SERVICE_ROLE_KEY: 'k' }
globalThis.Deno = { env: { get: (k) => env[k] } }
await import('./index.ts')

let profiles
beforeEach(() => {
  profiles = [{ id: 'u1', stripe_subscription_id: 'sub_1', subscription_status: 'active', subscription_type: 'premium', last_stripe_event_created: null }]
  globalThis.__db = makeDb({ profiles })
})

let n = 0
function send(type, created, status) {
  const event = { id: 'evt_' + ++n, type, created, data: { object: { id: 'sub_1', customer: 'cus_1', status, current_period_end: 1893456000 } } }
  return globalThis.__handler(new Request('http://localhost/', { method: 'POST', headers: { 'stripe-signature': 't=1,v1=x' }, body: JSON.stringify(event) }))
}

test('a delayed older update does not undo a newer cancellation', async () => {
  await send('customer.subscription.deleted', 200, 'canceled')
  await send('customer.subscription.updated', 100, 'active') // arrives late
  assert.equal(profiles[0].subscription_status, 'canceled')
  assert.equal(profiles[0].subscription_type, 'free')
})

test('events delivered in order are still applied', async () => {
  await send('customer.subscription.updated', 100, 'active')
  assert.equal(profiles[0].subscription_type, 'premium')
  await send('customer.subscription.deleted', 200, 'canceled')
  assert.equal(profiles[0].subscription_type, 'free')
})
