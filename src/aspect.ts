import { IConstruct } from "constructs";

const ASPECTS_SYMBOL = Symbol('miniprojen-aspects');

export interface IAspect {
  visit(node: IConstruct): void;
}

export class Aspects {
  public static of(scope: IConstruct): Aspects {
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
