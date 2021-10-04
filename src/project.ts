import * as path from 'path';
import { cleanup } from './cleanup';
import { Component } from './component';

export interface ProjectOptions {
  readonly name: string;
  readonly outdir?: string;
}

export class Project {
  public readonly name: string;
  public readonly outdir: string;
  private readonly _components = new Array<Component>();
  constructor(options: ProjectOptions) {
    this.name = options.name;
    this.outdir = path.resolve(options.outdir ?? '.');
  }

  public get components() {
    return [...this._components];
  }

  public _addComponent(component: Component) {
    this._components.push(component);
  }

  public synth() {
    console.log('Synthesizing project...');

    cleanup(this.outdir, []);

    for (const component of this._components) {
      component.synthesize();
    }

    console.log('Synthesis complete.');
  }
}
