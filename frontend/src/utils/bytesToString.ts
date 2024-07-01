import { fromHex } from 'viem';

export function bytesToString(bytes: string): string {
  return fromHex(bytes.replace(/0+$/, '') as `0x${string}`, 'string');
}
