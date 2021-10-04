import * as fs from 'fs-extra';
import * as path from 'path';
import { PROJEN_MARKER, PROJEN_RC } from './common';
import { resolve } from './_resolve';

export interface FileBaseOptions {}

export abstract class FileBase {
  public static readonly PROJEN_MARKER = `${PROJEN_MARKER}. To modify, edit ${PROJEN_RC} and run "npx projen".`;
  public readonly relativePath: string;
  constructor(filePath: string, _options: FileBaseOptions) {
    this.relativePath = filePath;
  }

  protected abstract synthesizeContent(resolver: IResolver): string | undefined;

  public synthesize(rootdir: string) {
    const filePath = path.join(rootdir, this.relativePath);
    const resolver: IResolver = { resolve: (obj, options) => resolve(obj, options) };
    const content = this.synthesizeContent(resolver);
    if (content === undefined) {
      return; // skip
    }
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, '600');
    }
    fs.mkdirpSync(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
    fs.chmodSync(filePath, '400'); // readonly, not executable
  }
}

 export interface IResolver {
  resolve(value: any, options?: ResolveOptions): any;
}

 export interface ResolveOptions {
  readonly omitEmpty?: boolean;
  readonly args?: any[];
}

export interface IResolvable {
  toJSON(): any;
}
