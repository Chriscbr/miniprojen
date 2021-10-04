import { Construct, IConstruct } from 'constructs';
import * as path from 'path';
import { cleanup } from './cleanup';
import { Component } from './component';

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

  constructor(options: ProjectOptions) {
    super(undefined as any, '');
    this.name = options.name;
    this.outdir = path.resolve(options.outdir ?? '.');
  }

  public synth() {
    console.log('Synthesizing project...');

    cleanup(this.outdir, []);

    for (const child of this.node.children) {
      if (child instanceof Component) {
        child.synthesize();
      }
    }

    console.log('Synthesis complete.');
  }
}
