/** A real body is shared by all versions; displayed excerpts never pretend to be complete JSON. */
const events = Array.from({length: 180}, (_, index) => ({
  id: index + 1,
  type: 'page_view',
  path: '/articles/http',
}));
export const requestBody = JSON.stringify({events});
export const contentLength = new TextEncoder().encode(requestBody).length;
export const requestLines = [
  'POST /api/events HTTP/1.1',
  'Host: example.com',
  'Content-Type: application/json',
  `Content-Length: ${contentLength}`,
  '',
  '{"events":[',
  '  {"id":1,"type":"page_view",',
  '   "path":"/articles/http"},',
] as const;
export const bodyExcerpt = [
  '{"events":[',
  '  {"id":1,"type":"page_view",',
  '   "path":"/articles/http"},',
  '  …',
  ']}',
] as const;
export const framePayloads = [4096, 4096, contentLength - 8192] as const;

// Fixed example, not a general HPACK encoder. RFC 7541 static indexes:
// 3 = :method POST, 7 = :scheme https, 4 = :path, 1 = :authority,
// 31 = content-type, 28 = content-length. Literals omit Huffman coding.
const literal = (value: string): readonly number[] => {
  const bytes = new TextEncoder().encode(value);
  if (bytes.length >= 127) throw new Error('The chapter uses short HPACK literals only');
  return [bytes.length, ...bytes];
};
export const hpackBytes: readonly number[] = [
  0x83,
  0x87,
  0x04,
  ...literal('/api/events'),
  0x01,
  ...literal('example.com'),
  0x0f,
  0x10,
  ...literal('application/json'),
  0x0f,
  0x0d,
  ...literal(String(contentLength)),
];
export const headersFrameBytes: readonly number[] = [
  0,
  0,
  hpackBytes.length, // 24-bit payload length; the fixed example is <256 bytes.
  1,
  4, // HEADERS, END_HEADERS. END_STREAM is deliberately unset.
  0,
  0,
  0,
  1, // Stream ID 1.
  ...hpackBytes,
];
export const headersHex = headersFrameBytes.map((byte) =>
  byte.toString(16).padStart(2, '0').toUpperCase(),
);
