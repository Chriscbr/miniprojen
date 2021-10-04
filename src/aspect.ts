import { Component } from ".";

const ASPECTS_SYMBOL = Symbol('miniprojen-aspects');

export interface IAspect {
  // node type should be IConstruct?
  visit(node: Component): void;
}

export class Aspects {
  public static of(scope: any): Aspects {
    let aspects = (scope as any)[ASPECTS_SYMBOL];
    if (!aspects) {
      aspects = new Aspects(scope);

      Object.defineProperty(scope, ASPECTS_SYMBOL, {
        value: aspects,
        configurable: false,
        enumerable: false,
      });
    }
    return aspects;
  }

  private readonly _aspects = new Array<IAspect>();
  private constructor(private readonly scope: any) { }

  public add(aspect: IAspect) {
    this._aspects.push(aspect);
  }

  public get aspects(): IAspect[] {
    return [...this._aspects];
  }
}
