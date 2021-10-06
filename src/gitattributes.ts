import { Construct, IConstruct } from "constructs";
import { Component } from "./component";
import { FileBase, IResolver } from "./file";
import { Gitignore, Npmignore } from "./ignorefile";

/**
 * Assign attributes to file names in a git repository.
 *
 * @see https://git-scm.com/docs/gitattributes
 */
export class GitAttributes extends Component {
  private readonly attributes: Record<string, string[]> = {};
  private readonly file: FileBase;

  public constructor(scope: Construct) {
    super(scope, 'GitAttributes');

    this.file = new GitAttributesFile(this, '.gitattributes', {
      attributes: this.attributes,
    });

    this.annotateGenerated(`/${this.file.relativePath}`);
  }

  /**
   * Maps a set of attributes to a set of files.
   * @param glob Glob pattern to match files in the repo
   * @param attributes Attributes to assign to these files.
   */
   public addAttributes(glob: string, ...attributes: string[]) {
    if (!(glob in this.attributes)) {
      this.attributes[glob] = [];
    }
    const list = this.attributes[glob];
    for (const attribute of attributes) {
      if (!list.includes(attribute)) {
        list.push(attribute);
      }
    }
  }

  /**
   * Marks the provided file(s) as being generated. This is achieved using the
   * github-linguist attributes. Generated files do not count against the
   * repository statistics and language breakdown.
   *
   * @param glob the glob pattern to match (could be a file path).
   *
   * @see https://github.com/github/linguist/blob/master/docs/overrides.md
   */
  public annotateGenerated(glob: string): void {
    this.addAttributes(glob, 'linguist-generated');
  }

  public visit(node: IConstruct) {
    if (node instanceof Gitignore) {
      node.include(this.file.relativePath);
    }
    if (node instanceof Npmignore) {
      node.exclude(this.file.relativePath);
    }
  }
}

export interface GitAttributesFileOptions {
  readonly attributes: { [key: string]: string[] };
}

export class GitAttributesFile extends FileBase {
  private readonly attributes: { [key: string]: string[] };

  constructor(scope: Construct, filePath: string, options: GitAttributesFileOptions) {
    super(scope, filePath);
    this.attributes = options.attributes;
  }

  protected synthesizeContent(resolver: IResolver): string | undefined {
    const entries = Object.entries(this.attributes)
      .sort(([l], [r]) => l.localeCompare(r));

    if (entries.length === 0) {
      return undefined;
    }

    return [
      `# ${FileBase.PROJEN_MARKER}`,
      '',
      ...entries.map(([name, attributes]) => `${name}\t${Array.from(attributes).join(' ')}`),
    ].join('\n');
  }
}
