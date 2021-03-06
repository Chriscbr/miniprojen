import { Construct } from 'constructs';
import * as path from 'path';
import { PROJEN_MARKER, PROJEN_RC } from './common';
import { Project } from './project';
import { writeFile } from './util';
import { resolve } from './_resolve';

export interface FileBaseOptions {
  /**
   * Whether the generated file should be readonly.
   *
   * @default true
   */
  readonly readonly?: boolean;

  /**
   * Whether the generated file should be marked as executable.
   *
   * @default false
   */
  readonly executable?: boolean;

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
   * 
   * @default true
   */
  readonly editGitignore?: boolean;

  /**
   * Whether this file should be ignored when publishing to npm (true), or
   * included in the published package (false). If `editNpmignore` is false, then
   * the npmignore file will not be modified in either way.
   *
   * @default false
   */
   readonly npmignore?: boolean;

   /**
    * Whether the npmignore file should be modified.
    * 
    * @default true
    */
   readonly editNpmignore?: boolean;

   /**
    * Extra file metadata.
    */
   [key: string]: any;
}

export abstract class FileBase extends Construct {
  /**
   * The marker to embed in files in order to identify them as projen files.
   * This marker is used to prune these files before synthesis.
   */
  public static readonly PROJEN_MARKER = `${PROJEN_MARKER}. To modify, edit ${PROJEN_RC} and run "npm run synth".`;

   /**
    * The file path, relative to the project root.
    */
  public readonly relativePath: string;

   /**
    * Indicates if the file should be read-only or read-write.
    */
  public readonly: boolean;

   /**
    * Indicates if the file should be marked as executable
    */
  public executable: boolean;

  /**
   * The absolute path of this file.
   */
  public readonly absolutePath: string;

  constructor(scope: Construct, filePath: string, options: FileBaseOptions = {}) {
    super(scope, filePath);

    this.relativePath = filePath;
    this.readonly = options.readonly ?? true;
    this.executable = options.executable ?? false;

    const annotateGenerated = options.annotateGenerated ?? true;
    const gitignore = options.gitignore ?? true;
    const editGitignore = options.editGitignore ?? true;
    const npmignore = options.npmignore ?? false;
    const editNpmignore = options.editNpmignore ?? true;

    const project = Project.of(this);

    project.fileMetadata.add(this.relativePath, {
      readonly: this.readonly,
      executable: this.executable,
      annotateGenerated,
      gitignore,
      editGitignore,
      npmignore,
      editNpmignore,
    })

    this.absolutePath = path.resolve(project.outdir, filePath);

    // verify file path is unique within project tree
    const existing = Project.of(this).tryFindFile(this.absolutePath);
    if (existing && existing !== this) {
      throw new Error(`there is already a file under ${path.relative(project.outdir, this.absolutePath)}`);
    }
  }

  /**
   * Checks if `x` is a FileBase.
   * @returns true if `x` is an object created from a class which extends `FileBase`.
   * @param x Any object
   */
  public static isFile(x: any): x is FileBase {
    return x instanceof FileBase;
  }

  /**
   * Implemented by derived classes and returns the contents of the file to
   * emit.
   * @param resolver Call `resolver.resolve(obj)` on any objects in order to
   * resolve token functions.
   * @returns the content to synthesize or undefined to skip the file
   */
  protected abstract synthesizeContent(resolver: IResolver): string | undefined;

  /**
   * Writes the file to the project's output directory
   */
  public synthesize() {
    const outdir = Project.of(this).outdir;
    const filePath = path.join(outdir, this.relativePath);
    const resolver: IResolver = { resolve: (obj, options) => resolve(obj, options) };
    const content = this.synthesizeContent(resolver);
    if (content === undefined) {
      return; // skip
    }
    writeFile(filePath, content, {
      readonly: this.readonly,
      executable: this.executable,
    });
  }
}

/**
 * API for resolving tokens when synthesizing file content.
 */
export interface IResolver {
  /**
   * Given a value (object/string/array/whatever, looks up any functions inside
   * the object and returns an object where all functions are called.
   * @param value The value to resolve
   * @package options Resolve options
   */
  resolve(value: any, options?: ResolveOptions): any;
}

/**
 * Resolve options.
 */
export interface ResolveOptions {
  /**
   * Omits empty arrays and objects.
   * @default false
   */
  readonly omitEmpty?: boolean;

  /**
   * Context arguments.
   * @default []
   */
  readonly args?: any[];
}

export interface IResolvable {
  /**
   * Resolves and returns content.
   */
  toJSON(): any;
}
