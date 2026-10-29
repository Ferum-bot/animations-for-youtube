export type CodeLanguage = 'sql' | 'properties';
type TokenRole = 'text' | 'keyword' | 'string' | 'comment' | 'function';
type CodeToken = {readonly text: string; readonly role: TokenRole};

const sqlKeywords = new Set(['CREATE', 'TABLE', 'INDEX', 'PRIMARY', 'KEY', 'NOT', 'NULL',
  'DEFAULT', 'REFERENCES', 'ON', 'WHERE', 'DESC', 'UUID', 'TEXT', 'JSONB', 'TIMESTAMPTZ',
  'BOOLEAN', 'TRUE', 'FALSE', 'SELECT', 'FROM', 'AND', 'LIMIT', 'BIGSERIAL',
  'BEGIN', 'COMMIT', 'INSERT', 'INTO', 'VALUES', 'RETURNING', 'UPDATE', 'SET',
  'ANY', 'IS', 'ORDER', 'BY', 'FOR', 'SKIP', 'LOCKED', 'IN',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'PARTITION', 'RANGE', 'OF', 'TO', 'TRUNCATE',
  'SMALLINT', 'WITH', 'AS', 'OR', 'BETWEEN']);

const sqlRole = (token: string): TokenRole => {
  if (token.startsWith('--')) return 'comment';
  if (token.startsWith("'")) return 'string';
  if (sqlKeywords.has(token.toUpperCase())) return 'keyword';
  if (token === 'now' || token === 'date_trunc') return 'function';
  return 'text';
};

/** Syntax colors for the episode's SQL and flat key=value configuration listings. */
export const tokenizeCodeLine = (text: string, language: CodeLanguage): readonly CodeToken[] => {
  if (language === 'sql') {
    return (text.match(/--.*$|'(?:''|[^'])*'|\b[A-Za-z_][A-Za-z_0-9]*\b|\s+|./g) ?? [])
      .map((token) => ({text: token, role: sqlRole(token)}));
  }
  if (text.trimStart().startsWith('#')) return [{text, role: 'comment'}];
  const separator = text.indexOf('=');
  if (separator < 0) return [{text, role: 'text'}];
  return [
    {text: text.slice(0, separator), role: 'keyword'},
    {text: '=', role: 'text'},
    {text: text.slice(separator + 1), role: 'string'},
  ];
};
