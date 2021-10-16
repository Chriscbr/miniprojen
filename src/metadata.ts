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

  private readonly _metadata = new Map<string, any>();
  private constructor() { }

  public add(filePath: string, data: any) {
    if (this._metadata.has(filePath)) {
      throw new Error(`A file with the path ${filePath} already exists.`);
    }
    this._metadata.set(filePath, data);
  }
}
