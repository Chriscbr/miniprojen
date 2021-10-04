import { Construct, IConstruct } from 'constructs';
import { IAspect } from './aspect';

export abstract class Component extends Construct implements IAspect {
  constructor(scope: Construct, name: string) {
    super(scope, name);
  }
  public abstract visit(node: IConstruct): void;
}