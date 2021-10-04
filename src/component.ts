import { Project } from './project';

export class Component {
  constructor(public readonly project: Project) {
    project._addComponent(this);
  }

  public synthesize() {}
}