import { Construct, IConstruct } from 'constructs';
import * as path from 'path';
import { Aspects, IAspect } from './aspect';
import { cleanup } from './cleanup';
import { Component } from './component';
import { FileBase } from './file';
import { FileMetadata } from './metadata';

export interface ProjectOptions {
  readonly name: string;
  readonly outdir?: string;
}

export class Project extends Construct {
   public static of(c: IConstruct): Project {
    if (c instanceof Project) {
      return c;
    }

    const parent = c.node.scope as Construct;
    if (!parent) {
      throw new Error('cannot find a parent project (directly or indirectly)');
    }

    return Project.of(parent);
  }

  public readonly name: string;
  public readonly outdir: string;
  public readonly fileMetadata: FileMetadata;

  constructor(options: ProjectOptions) {
    super(undefined as any, options.name);
    this.name = options.name;
    this.outdir = path.resolve(options.outdir ?? '.');
    this.fileMetadata = FileMetadata.of(this);
  }

  /**
   * All components in this project.
   */
   public get components(): Component[] {
    return this.node.findAll().filter(Component.isComponent);
  }

  /**
   * All files in this project.
   */
  public get files(): FileBase[] {
    return this.node.findAll()
      .filter(FileBase.isFile)
      .sort((f1, f2) => f1.relativePath.localeCompare(f2.relativePath));
  }

  /**
   * Finds a file at the specified relative path within this project.
   *
   * @param filePath The file path. If this path is relative, it will be resolved
   * from the root of _this_ project.
   * @returns a `FileBase` or undefined if there is no file in that path
   */
   public tryFindFile(filePath: string): FileBase | undefined {
    const absolute = path.isAbsolute(filePath) ? filePath : path.resolve(this.outdir, filePath);
    for (const file of this.files) {
      if (absolute === file.absolutePath) {
        return file;
      }
    }

    return undefined;
  }

  public synth() {
    console.log('Synthesizing project...');

    cleanup(this.outdir, []);

    for (const c of this.node.findAll()) {
      if (c instanceof Component) {
        Aspects.of(this).add(c);
      }
    }

    // TODO: validate / enforce that invoking aspects does not
    // modify the construct tree (e.g. adding components)
    invokeAspects(this);

    for (const c of this.node.findAll()) {
      if (c instanceof FileBase) {
        c.synthesize();
      }
    }

    console.log('Synthesis complete.');
  }
}

// source: https://github.com/aws/aws-cdk/blob/352cdc1d1a64c0187b9cdc2e7c62aa0b4ffcaa97/packages/%40aws-cdk/core/lib/private/synthesis.ts#L91
function invokeAspects(root: IConstruct) {
  const invokedByPath: { [nodePath: string]: IAspect[] } = { };

  let nestedAspectWarning = false;
  recurse(root, []);

  function recurse(construct: IConstruct, inheritedAspects: IAspect[]) {
    const node = construct.node;
    const aspects = Aspects.of(construct);
    const allAspectsHere = [...inheritedAspects ?? [], ...aspects.aspects];
    const nodeAspectsCount = aspects.aspects.length;
    for (const aspect of allAspectsHere) {
      let invoked = invokedByPath[node.path];
      if (!invoked) {
        invoked = invokedByPath[node.path] = [];
      }

      if (invoked.includes(aspect)) { continue; }

      aspect.visit(construct);

      // if an aspect was added to the node while invoking another aspect it will not be invoked, emit a warning
      // the `nestedAspectWarning` flag is used to prevent the warning from being emitted for every child
      if (!nestedAspectWarning && nodeAspectsCount !== aspects.aspects.length) {
        console.log('We detected an Aspect was added via another Aspect, and will not be applied');
        nestedAspectWarning = true;
      }

      // mark as invoked for this node
      invoked.push(aspect);
    }

    for (const child of construct.node.children) {
      // (new) we allow Component's to be visited, but not files, in order to
      // "separate" the control plane and data plane
      if (child instanceof Component) {
        recurse(child, allAspectsHere);
      }
    }
  }
}
