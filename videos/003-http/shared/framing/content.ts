/** ASCII examples: the visible space marker is never included in byte counts. */
export const bodyChunks = ['Hello', ' world'] as const;
export const chunkedWire = bodyChunks.map((data) => `${data.length.toString(16)}\r\n${data}\r\n`).join('') + '0\r\n\r\n';
export const displayWire = (value: string): string => value.replaceAll('\r', '␍').replaceAll('\n', '␊').replaceAll(' ', '·');
