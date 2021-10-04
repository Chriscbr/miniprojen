import { FileBase, FileBaseOptions } from "./file";
import { resolve } from "./_resolve";

export interface TextFileOptions extends FileBaseOptions {
  readonly lines?: string[];
}

export class TextFile extends FileBase {
  private readonly lines: string[];

  constructor(filePath: string, options: TextFileOptions) {
    super(filePath, options);

    this.lines = options.lines ?? [];
  }

  protected synthesizeContent() {
    return resolve(this.lines).length > 0 ? this.lines.join('\n') : undefined;
  }
}
