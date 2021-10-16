import { Construct } from "constructs";
import { FileBase, FileBaseOptions, IResolver } from "./file";

/**
 * Options for `TextFile`.
 */
 export interface TextFileOptions extends FileBaseOptions {
  /**
   * The contents of the file. Must be a string, or resolve to a string
   * via the `resolver` function.
   *
   * @default - empty file
   */
  readonly contents: any;
}

/**
 * A (raw) text file.
 */
export class TextFile extends FileBase {
  private readonly contents: any;

  constructor(scope: Construct, filePath: string, options: TextFileOptions) {
    super(scope, filePath, options);
    this.contents = options.contents;
  }

  protected synthesizeContent(resolver: IResolver) {
    return resolver.resolve(this.contents);
  }
}