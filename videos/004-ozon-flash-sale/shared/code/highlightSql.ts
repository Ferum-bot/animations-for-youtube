import type {CodeToken} from './types';

const keywords = new Set(['BEGIN', 'ISOLATION', 'LEVEL', 'READ', 'COMMITTED', 'WITH', 'AS',
  'UPDATE', 'SET', 'WHERE', 'AND', 'RETURNING', 'INSERT', 'INTO', 'SELECT', 'FROM',
  'INTERVAL', 'COMMIT', 'FOR', 'SKIP', 'LOCKED', 'LIMIT', 'DELETE']);

type SqlIdentifiers = {
  readonly columns: readonly string[];
  readonly functions?: readonly string[];
  readonly ctes?: readonly string[];
};

/** Fixed-snippet highlighting with explicit semantic identifiers; preserves every character. */
export const highlightSql = (source: string, identifiers: SqlIdentifiers): readonly (readonly CodeToken[])[] => {
  const columns = new Set(identifiers.columns);
  const functions = new Set(identifiers.functions);
  const ctes = new Set(identifiers.ctes);
  return source.split('\n').map((line) =>
    (line.match(/--.*|'(?:[^']|'')*'|:[a-z_]+|\b\d+\b|\b[a-z_]+\b|[^\w:'-]+|./gi) ?? []).map((text): CodeToken => {
      if (text.startsWith('--')) return {text, kind: 'comment'};
      if (text.startsWith("'")) return {text, kind: 'string'};
      if (text.startsWith(':')) return {text, kind: 'parameter'};
      if (/^\d+$/.test(text)) return {text, kind: 'number'};
      if (keywords.has(text.toUpperCase())) return {text, kind: 'keyword'};
      if (functions.has(text.toLowerCase())) return {text, kind: 'function'};
      if (columns.has(text.toLowerCase())) return {text, kind: 'column'};
      if (ctes.has(text.toLowerCase())) return {text, kind: 'cte'};
      return {text, kind: 'plain'};
    }));
};
