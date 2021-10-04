import { Construct, IConstruct } from "constructs";
import { Component } from "./component";
import { FileBase } from "./file";
import { TextFile } from "./textfile";

export interface IIgnoreFile {
  exclude(...patterns: string[]): void;
  include(...patterns: string[]): void;
}

export interface IgnoreFileOptions {
  readonly patterns?: string[];
}

export class IgnoreFile extends Component implements IIgnoreFile {
  private readonly patterns: string[];

  constructor(scope: Construct, filePath: string, options: IgnoreFileOptions = {}) {
    super(scope, filePath);
    this.patterns = options.patterns ?? [];
    new TextFile(this, filePath, {
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

  public visit(_: IConstruct) {}
}

export class Gitignore extends IgnoreFile {
  constructor(scope: Construct) {
    super(scope, '.gitignore');
  }
}

export class Npmignore extends IgnoreFile {
  constructor(scope: Construct) {
    super(scope, '.npmignore');
  }
}
