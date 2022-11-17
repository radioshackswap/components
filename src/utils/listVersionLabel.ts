import { Version } from '@radioshackswap/token-lists';

export default function listVersionLabel(version: Version): string {
  return `v${version.major}.${version.minor}.${version.patch}`;
}
