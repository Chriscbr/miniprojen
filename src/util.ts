import * as fs from 'fs-extra';
import * as path from 'path';

export interface WriteFileOptions {
  /**
   * Whether the generated file should be marked as executable.
   *
   * @default false
   */
  executable?: boolean;

  /**
   * Whether the generated file should be readonly.
   *
   * @default false
   */
  readonly?: boolean;
}

export function getFilePermissions(options: WriteFileOptions): string {
  const readonly = options.readonly ?? false;
  const executable = options.executable ?? false;
  if (readonly && executable) {
    return '500';
  } else if (readonly) {
    return '400';
  } else if (executable) {
    return '755';
  } else {
    return '644';
  }
}

export function writeFile(filePath: string, data: any, options: WriteFileOptions = {}) {
  if (fs.existsSync(filePath)) {
    fs.chmodSync(filePath, '600');
  }

  fs.mkdirpSync(path.dirname(filePath));
  fs.writeFileSync(filePath, data);

  fs.chmodSync(filePath, getFilePermissions(options));
}
