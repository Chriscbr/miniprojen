import { Construct } from "constructs";
import { Component } from "./component";
import { FileBase, FileBaseOptions } from "./file";
import { TextFile } from "./textfile";

export interface IIgnoreFile {
  exclude(...patterns: string[]): void;
  include(...patterns: string[]): void;
}

export interface IgnoreFileOptions extends FileBaseOptions {
  readonly filePath: string;
  readonly patterns?: string[];
}

export class IgnoreFile extends Component implements IIgnoreFile {
  private readonly patterns: string[];
  private readonly filePath: string;

  constructor(scope: Construct, name: string, options: IgnoreFileOptions) {
    super(scope, name);
    this.patterns = options.patterns ?? [];
    this.filePath = options.filePath;
    new TextFile(this.filePath, {
      lines: {
        toJSON: () => {
          return [
            '# ' + FileBase.PROJEN_MARKER,
            '',
            ...(this.patterns || []),
          ];
        }
      } as any,
    })
  }

  public exclude(...patterns: string[]) {
    this.patterns.push(...patterns);
  }

  public include(...patterns: string[]) {
    this.patterns.push(...patterns.map(x => '!' + x));
  }
}

export class Gitignore extends IgnoreFile {
  constructor(scope: Construct) {
    super(scope, '.gitignore', { filePath: '.gitignore' });
  }
}

export class Npmignore extends IgnoreFile {
  constructor(scope: Construct) {
    super(scope, '.npmignore', { filePath: '.npmignore' });
  }
}
