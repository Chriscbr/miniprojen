import { Construct, IConstruct } from "constructs";
import { Component } from "./component";
import { Gitignore, Npmignore } from "./ignore-file";
import { TypeScriptCompilerOptions, TypescriptConfig, TypescriptConfigOptions } from "./tsconfig";
import { deepMerge } from "./util";

export interface TypescriptOptions {
  /**
   * Custom TSConfig
   * @default - default options
   */
   readonly tsconfig?: TypescriptConfigOptions;
}

export class Typescript extends Component {
  constructor(scope: Construct, name: string, options: TypescriptOptions = {}) {
    super(scope, name);

    const compilerOptionDefaults: TypeScriptCompilerOptions = {
      alwaysStrict: true,
      declaration: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      inlineSourceMap: true,
      inlineSources: true,
      lib: ['es2019'],
      module: 'CommonJS',
      noEmitOnError: false,
      noFallthroughCasesInSwitch: true,
      noImplicitAny: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      resolveJsonModule: true,
      strict: true,
      strictNullChecks: true,
      strictPropertyInitialization: true,
      stripInternal: true,
      target: 'ES2019',
    };

    new TypescriptConfig(this, 'Tsconfig', deepMerge([
      { compilerOptions: compilerOptionDefaults },
      options.tsconfig
    ]) as TypescriptConfigOptions);
  }

  visit(c: IConstruct) {
    // if (c instanceof Dependencies) {
    //   c.addDevDeps(`typescript^${this.typescriptVersion ?? '*'}`);
    //   c.addDevDeps('@types/node');
    // }

    if (c instanceof Gitignore) {
      c.exclude('src/**/*.js');
      c.exclude('src/**/*.d.ts');
    }

    if (c instanceof Npmignore) {
      c.include('src/**/*.js');
      c.include('src/**/*.d.ts');
    }
  }
}