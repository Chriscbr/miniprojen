import { Construct } from 'constructs';
import { IResolver } from './file';
import { ObjectFile, ObjectFileOptions } from './object-file';

/**
 * Options for `JsonFile`.
 */
export interface JsonFileOptions extends ObjectFileOptions {}

/**
 * Represents a JSON file.
 */
export class JsonFile extends ObjectFile {
  constructor(scope: Construct, filePath: string, options: JsonFileOptions) {
    super(scope, filePath, options);

    if (!options.obj) {
      throw new Error('"obj" cannot be undefined');
    }
  }

  protected synthesizeContent(resolver: IResolver): string | undefined {
    const json = super.synthesizeContent(resolver);
    if (!json) {
      return undefined;
    }

    const sanitized = JSON.parse(json);

    if (this.marker) {
      sanitized['//'] = JsonFile.PROJEN_MARKER;
    }

    return `${JSON.stringify(sanitized, undefined, 2)}\n`;
  }
}
