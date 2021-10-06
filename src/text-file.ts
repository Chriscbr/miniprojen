import { Construct } from "constructs";
import { FileBase, FileBaseOptions, IResolver } from "./file";

/**
 * Options for `TextFile`.
 */
 export interface TextFileOptions extends FileBaseOptions {
  /**
   * The contents of the text file. You can use `addLine()` to append lines.
   *
   * @default [] empty file
   */
  readonly lines?: string[];
}

/**
 * A text file.
 */
export class TextFile extends FileBase {
  private readonly lines: string[];

  constructor(scope: Construct, filePath: string, options: TextFileOptions) {
    super(scope, filePath, options);

    this.lines = options.lines ?? [];
  }

  /**
   * Adds a line to the text file.
   * @param line the line to add (can use tokens)
   */
   public addLine(line: string) {
    this.lines.push(line);
  }

  protected synthesizeContent(resolver: IResolver) {
    const lines = resolver.resolve(this.lines);
    return lines && lines.length > 0 ? lines.join('\n') : undefined;
  }
}
