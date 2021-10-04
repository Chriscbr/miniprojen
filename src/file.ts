import * as fs from 'fs-extra';
import * as path from 'path';
import { PROJEN_MARKER, PROJEN_RC } from './common';
import { Component } from "./component";
import { Project } from './project';

export interface FileOptions {}

export abstract class File extends Component {
  public static readonly PROJEN_MARKER = `${PROJEN_MARKER}. To modify, edit ${PROJEN_RC} and run "npx projen".`;
  public readonly relativePath: string;
  public readonly absolutePath: string;
  constructor(project: Project, filePath: string, options: FileOptions) {
    super(project);
    this.relativePath = filePath;
    this.absolutePath = path.resolve(project.outdir, filePath);
  }

  protected abstract synthesizeContent(): string;

  public synthesize() {
    const outdir = this.project.outdir;
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
