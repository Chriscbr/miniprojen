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

/**
 * Type of a map mapping strings to some arbitrary type
 */
export type Obj<T> = { [key: string]: T };

/**
 * Return whether the given value is an object
 *
 * Even though arrays and instances of classes technically are objects, we
 * usually want to treat them differently, so we return false in those cases.
 */
export function isObject(x: any): x is Obj<any> {
  return x !== null && typeof x === 'object' && !Array.isArray(x)
    && x.constructor.name === 'Object';
}

/**
 * Recursively merge objects together
 *
 * The leftmost object is mutated and returned. Arrays are not merged
 * but overwritten just like scalars.
 *
 * If an object is merged into a non-object, the non-object is lost.
 *
 * `undefined`s will cause a value to be deleted if destructive is enabled.
 */
export function deepMerge(objects: Array<Obj<any> | undefined>, destructive: boolean = false) {
  function mergeOne(target: Obj<any>, source: Obj<any>) {
    for (const key of Object.keys(source)) {
      const value = source[key];

      if (isObject(value)) {
        // if the value at the target is not an object, override it with an
        // object so we can continue the recursion
        if (typeof(target[key]) !== 'object') {
          target[key] = value;
        }
        mergeOne(target[key], value);

        // if the result of the merge is an empty object, it's because the
        // eventual value we assigned is `undefined`, and there are no
        // sibling concrete values alongside, so we can delete this tree.
        const output = target[key];
        if (typeof(output) === 'object' && Object.keys(output).length === 0 && destructive) {
          delete target[key];
        }
      } else if (value === undefined && destructive) {
        delete target[key];
      } else if (typeof value !== 'undefined') {
        target[key] = value;
      }
    }
  }

  const others = objects.filter(x => x != null) as Array<Obj<any>>;

  if (others.length === 0) { return {}; }
  const into = others.splice(0, 1)[0];

  others.forEach(other => mergeOne(into, other));
  return into;
}
