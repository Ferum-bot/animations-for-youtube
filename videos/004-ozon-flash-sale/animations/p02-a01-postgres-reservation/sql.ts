/** The supplied SQL; only Markdown/HTML escaping and indentation are normalized. */
export const reservationSql = `-- резервация (PostgreSQL)
BEGIN ISOLATION LEVEL READ COMMITTED;

WITH dec AS (
  UPDATE items
     SET stock = stock - 1
   WHERE id = 42
     AND stock > 0
     AND now() >= sale_start
     AND now() <  sale_end
  RETURNING id
)
INSERT INTO reservations (item_id, user_id, status, expires_at)
SELECT id, :user_id, 'HELD', now() + interval '10 minutes'
  FROM dec
RETURNING id, expires_at;

COMMIT;`;

type TokenKind = 'plain' | 'comment' | 'keyword' | 'column' | 'string' | 'number' | 'parameter' | 'function' | 'cte';
export type SqlToken = {readonly text: string; readonly kind: TokenKind};
const keywords = new Set(['BEGIN', 'ISOLATION', 'LEVEL', 'READ', 'COMMITTED', 'WITH', 'AS',
  'UPDATE', 'SET', 'WHERE', 'AND', 'RETURNING', 'INSERT', 'INTO', 'SELECT', 'FROM', 'INTERVAL', 'COMMIT']);
// Semantic identifiers in this fixed snippet, not a general SQL schema resolver.
const columns = new Set(['id', 'stock', 'sale_start', 'sale_end', 'item_id', 'user_id', 'status', 'expires_at']);

// A small lexer for this PostgreSQL snippet; every source character is preserved.
const tokenize = (line: string): readonly SqlToken[] =>
  (line.match(/--.*|'(?:[^']|'')*'|:[a-z_]+|\b\d+\b|\b[a-z_]+\b|[^\w:'-]+|./gi) ?? []).map((text) => {
    if (text.startsWith('--')) return {text, kind: 'comment'};
    if (text.startsWith("'")) return {text, kind: 'string'};
    if (text.startsWith(':')) return {text, kind: 'parameter'};
    if (/^\d+$/.test(text)) return {text, kind: 'number'};
    if (keywords.has(text.toUpperCase())) return {text, kind: 'keyword'};
    if (text.toLowerCase() === 'now') return {text, kind: 'function'};
    if (columns.has(text.toLowerCase())) return {text, kind: 'column'};
    if (text.toLowerCase() === 'dec') return {text, kind: 'cte'};
    return {text, kind: 'plain'};
  });

export const sqlLines = reservationSql.split('\n').map(tokenize);
