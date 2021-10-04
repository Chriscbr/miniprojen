import * as fs from 'fs-extra';
import * as path from 'path';
import minimatch from 'minimatch';
import { PROJEN_MARKER } from './common';

export function cleanup(dir: string, exclude: string[]) {
  try {
    for (const f of findGeneratedFiles(dir, exclude)) {
      fs.removeSync(f);
    }

    // TODO: clean up directories?
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Warning: failed to clean up generated files: ${e.stack}`);
    }
  }
}

function listFiles(base: string, exclude: string[]) {
  const files = new Array<string>();

  const walk = async (reldir: string = '.') => {
    const entries = fs.readdirSync(path.join(base, reldir));
    entryLoop: for (const entry of entries) {
      const relpath = path.join(reldir, entry);
      const abspath = path.join(base, relpath);

      for (const pattern of exclude) {
        if (minimatch(relpath, pattern, { dot: true })) {
          continue entryLoop;
        }
      }

      const stat = fs.statSync(abspath);
      if (stat.isDirectory()) {
        walk(relpath);
      } else {
        files.push(relpath);
      }
    }
  };

  walk();

  return files;
}

function findGeneratedFiles(dir: string, exclude: string[]) {
  const ignore = [...readGitIgnore(dir), ...exclude, '.git/**'];
  const files = listFiles(dir, ignore);
  const generated = new Array<string>();

  for (const file of files) {
    const contents = fs.readFileSync(file, 'utf-8');
    if (contents.includes(PROJEN_MARKER)) {
      generated.push(file);
    }
  }

  return generated;
}

function readGitIgnore(dir: string) {
  const filepath = path.join(dir, '.gitignore');
  if (!fs.pathExistsSync(filepath)) {
    return [];
  }

  debugger;
  return fs.readFileSync(filepath, 'utf-8')
    .split('\n')
    .filter(x => x?.trim() !== '')
    .filter(x => !x.startsWith('#') && !x.startsWith('!'))
    .map(x => x.replace(/^\//, '')) // remove "/" prefix
    .map(x => x.replace(/\/$/, '')) // remove "/" suffix
    .map(x => `${x}\n${x}/**`)
    .join('\n')
    .split('\n');
}

