import { Project } from ".";

const FILE_METADATA_SYMBOL = Symbol('miniprojen-file-metadata');

/**
 * Stores the metadata for all files in a project.
 */
export class FileMetadata {
  public static of(project: Project): FileMetadata {
    let metadata = (project as any)[FILE_METADATA_SYMBOL];
    if (!metadata) {
      metadata = new FileMetadata();

      Object.defineProperty(project, FILE_METADATA_SYMBOL, {
        value: metadata,
        configurable: false,
        enumerable: false,
      });
    }
    return metadata;
  }

  private readonly _metadata = new Map<string, MetadataEntry>();
  private constructor() { }

  public add(filePath: string, metadata: MetadataEntry): void {
    if (this._metadata.has(filePath)) {
      throw new Error(`A file with the path ${filePath} already exists.`);
    }
    this._metadata.set(filePath, metadata);
  }

  /**
   * Look up a file's metadata.
   * @param filePath A file's relative path
   * @returns The file's metadata (if there is any)
   */
  public lookup(filePath: string): MetadataEntry | undefined {
    return this._metadata.get(filePath);
  }
}

export interface MetadataEntry {
  /**
   * Whether the file should be marked as generated on GitHub.
   *
   * @default true
   */
  readonly annotateGenerated?: boolean;

  /**
   * Whether this file should be ignored by git (true), or
   * tracked by git (false). If `editGitignore` is false, then
   * the gitignore file will not be modified in either way.
   *
   * @default true
   */
  readonly gitignore?: boolean;

  /**
   * Whether the gitignore file should be modified.
   */
  readonly editGitignore?: boolean;

  /**
   * Whether this file should be ignored when publishing to npm (true), or
   * included in the published package (false). If `editNpmignore` is false, then
   * the npmignore file will not be modified in either way.
   *
   * @default true
   */
   readonly npmignore?: boolean;

   /**
    * Whether the npmignore file should be modified.
    */
   readonly editNpmignore?: boolean;

   /**
    * Extra file metadata.
    */
   [key: string]: any;
}
