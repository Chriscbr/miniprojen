export const PROJEN_RC = '.pjrc.ts';
export const PROJEN_DIR = '.miniprojen';
export const PROJEN_MARKER = '~~ Generated by ' + 'miniprojen'; // we split into two so /this/ file does not match the marker

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const PROJEN_VERSION = require('../package.json').version;
