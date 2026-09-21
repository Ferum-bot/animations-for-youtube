import type {CodeToken} from '../../shared/code/types';

/** User snippet, formatted into shorter lines without changing its behavior. */
export const reservationLua = `-- KEYS[1] = stock:42
-- KEYS[2] = holders:42
-- ARGV[1] = user_id
-- ARGV[2] = ttl

if redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 1 then
  return -1  -- уже держит
end
local s = tonumber(redis.call('GET', KEYS[1]))
if not s or s <= 0 then
  return 0   -- sold out
end

redis.call('DECR', KEYS[1])
redis.call('SADD', KEYS[2], ARGV[1])
return 1`;

const keywords = new Set(['if', 'then', 'return', 'end', 'local', 'not', 'or']);
const functions = new Set(['call', 'tonumber']);
const tokenize = (line: string): readonly CodeToken[] =>
  (line.match(/--.*|'(?:[^'\\]|\\.)*'|\b\d+\b|\b[a-z_]+\b|[^\w'-]+|./gi) ?? []).map((text) => {
    if (text.startsWith('--')) return {text, kind: 'comment'};
    if (text.startsWith("'")) return {text, kind: 'string'};
    if (/^\d+$/.test(text)) return {text, kind: 'number'};
    if (keywords.has(text)) return {text, kind: 'keyword'};
    if (functions.has(text)) return {text, kind: 'function'};
    if (text === 'KEYS' || text === 'ARGV') return {text, kind: 'parameter'};
    if (text === 's') return {text, kind: 'column'};
    if (text === 'redis') return {text, kind: 'cte'};
    return {text, kind: 'plain'};
  });

export const luaLines = reservationLua.split('\n').map(tokenize);
