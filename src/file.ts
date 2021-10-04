import { Construct } from 'constructs';
import * as fs from 'fs-extra';
import * as path from 'path';
import { PROJEN_MARKER, PROJEN_RC } from './common';
import { Component } from "./component";
import { Project } from './project';

export interface FileBaseOptions {
  readonly filePath: string;
}

export abstract class FileBase extends Component {
  public static readonly PROJEN_MARKER = `${PROJEN_MARKER}. To modify, edit ${PROJEN_RC} and run "npx projen".`;
  public readonly relativePath: string;
  constructor(scope: Construct, name: string, options: FileBaseOptions) {
    super(scope, name);
    this.relativePath = options.filePath;
  }

  protected abstract synthesizeContent(): string | undefined;

  public synthesize() {
    const outdir = Project.of(this).outdir;
    const filePath = path.join(outdir, this.relativePath);
    const content = this.synthesizeContent();
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
