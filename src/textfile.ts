import { Construct } from "constructs";
import { FileBase, FileBaseOptions } from "./file";

export interface TextFileOptions extends FileBaseOptions {
  readonly lines?: string[];
}

export class TextFile extends FileBase {
  private readonly lines: string[];

  constructor(scope: Construct, name: string, options: TextFileOptions) {
    super(scope, name, options);

    this.lines = options.lines ?? [];
  }

  protected synthesizeContent() {
    return this.lines.length > 0 ? this.lines.join('\n') : undefined;
  }
}
