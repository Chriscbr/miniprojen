import { Construct, IConstruct } from "constructs";
import { Project } from ".";
import { Component } from "./component";
import { FileBase } from "./file";
import { TextFile } from "./text-file";

export interface IgnoreFileOptions {
  readonly patterns?: string[];
}

export abstract class IgnoreFile extends Component {
  protected readonly patterns: string[];

  constructor(scope: Construct, filePath: string, options: IgnoreFileOptions = {}) {
    super(scope, filePath);
    this.patterns = options.patterns ?? [];
    new TextFile(this, filePath, {
      contents: () => this.renderContents(),
    });
  }

  protected abstract renderContents(): string | undefined;

  public exclude(...patterns: string[]) {
    this.patterns.push(...patterns);
  }

  public include(...patterns: string[]) {
    this.patterns.push(...patterns.map(x => '!' + x));
  }
}

export class Gitignore extends IgnoreFile {
  constructor(scope: Construct) {
    super(scope, '.gitignore');
  }

  protected renderContents() {
    const patterns = [...this.patterns];
    const project = Project.of(this);
    for (const file of project.files) {
      const metadata = project.fileMetadata.lookup(file.relativePath);
      if (metadata && metadata.editGitignore) {
        if (metadata.gitignore) {
          patterns.push(`/${file.relativePath}`);
        } else {
          patterns.push(`!/${file.relativePath}`);
        }
      }
    }

    return [
      '# ' + FileBase.PROJEN_MARKER,
      '',
      ...patterns,
    ].join('\n');
  }

  public visit(_: IConstruct) {}
}

export class Npmignore extends IgnoreFile {
  constructor(scope: Construct) {
    super(scope, '.npmignore');
  }

  protected renderContents() {
    const patterns = [...this.patterns];
    const project = Project.of(this);
    for (const file of project.files) {
      const metadata = project.fileMetadata.lookup(file.relativePath);
      if (metadata && metadata.editNpmignore) {
        if (metadata.npmignore) {
          patterns.push(`/${file.relativePath}`);
        } else {
          patterns.push(`!/${file.relativePath}`);
        }
      }
    }

    return [
      '# ' + FileBase.PROJEN_MARKER,
      '',
      ...patterns,
    ].join('\n');
  }

  public visit(_: IConstruct) {}
}
