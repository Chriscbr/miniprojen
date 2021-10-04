import { Construct } from "constructs";
import { FileBase, FileBaseOptions, IResolver } from "./file";

export interface TextFileOptions extends FileBaseOptions {
  readonly lines?: string[];
}

export class TextFile extends FileBase {
  private readonly lines: string[];

  constructor(scope: Construct, filePath: string, options: TextFileOptions) {
    super(scope, filePath, options);

    this.lines = options.lines ?? [];
  }

  protected synthesizeContent(resolver: IResolver) {
    const lines = resolver.resolve(this.lines);
    return lines.length > 0 ? lines.join('\n') : undefined;
  }
}
