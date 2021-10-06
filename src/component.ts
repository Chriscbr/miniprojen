import { Construct, IConstruct } from 'constructs';
import { IAspect } from './aspect';

export abstract class Component extends Construct implements IAspect {
  constructor(scope: Construct, name: string) {
    super(scope, name);
  }
  public abstract visit(node: IConstruct): void;

  /**
   * Checks if `x` is a Component.
   * @returns true if `x` is an object created from a class which extends `Component`.
   * @param x Any object
   */
  public static isComponent(x: any): x is Component {
    return x instanceof Component;
  }
}