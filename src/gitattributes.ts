import { Construct, IConstruct } from "constructs";
import { Project } from ".";
import { Component } from "./component";
import { FileBase } from "./file";
import { TextFile } from "./text-file";

/**
 * Assign attributes to file names in a git repository.
 *
 * @see https://git-scm.com/docs/gitattributes
 */
export class GitAttributes extends Component {
  private readonly attributes: Record<string, string[]> = {};
  private readonly file: FileBase;

  public constructor(scope: Construct, name: string) {
    super(scope, name);

    this.file = new TextFile(this, '.gitattributes', {
      contents: () => this.renderContents(),
    });
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

  private renderContents() {
    const project = Project.of(this);
    for (const file of project.files) {
      const metadata = project.fileMetadata.lookup(file.relativePath);
      if (metadata && metadata.annotateGenerated) {
        this.annotateGenerated(`/${file.relativePath}`);
      }
    }

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

  public visit(node: IConstruct) {}
}
