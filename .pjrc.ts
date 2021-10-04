import { Construct, IConstruct } from 'constructs';
import { Aspects, Component, Gitignore, IAspect, Npmignore, Project, TextFile } from './src';

const project = new Project({
  name: 'miniprojen'
});

// idea 1
class Gitattributes extends TextFile implements IAspect {
  // pretend we have logic for generating this file
  synthesizeContent() { return '' }

  visit(c: IConstruct) {
    if (c instanceof Gitignore) {
      c.include(this.relativePath);
    }
    // not all projects are node projects (so they might not have npmignore)
    // so this kind of logic isn't possible in current projen!
    if (c instanceof Npmignore) {
      c.exclude(this.relativePath)
    }
  }
}

// idea 2

// dummy impl, where it's just a text file list of dependencies
class Dependencies extends Component implements IAspect {
  private readonly 
  public addDeps(...deps: string[]) {}
  public addDevDeps(...deps: string[]) {}
  public visit(c: IConstruct) {}
}

// dummy impl
class Jest extends Component {}

class Eslint extends Component {}

interface TypescriptOptions {
  readonly typescriptVersion?: string;
}

class Typescript extends Component implements IAspect {
  private readonly typescriptVersion;
  constructor(scope: Construct, options: TypescriptOptions) {
    super(scope, 'Typescript');
    this.typescriptVersion = options.typescriptVersion;
  }
  visit(c: IConstruct) {
    if (c instanceof Project) {
      // new TypescriptConfig(c, ...)
    }
    
    // now, having projen manage dependencies is optional!
    // and it's VERY CLEAR where any dependency logic *has* to reside
    if (c instanceof Dependencies) {
      c.addDevDeps(`typescript^${this.typescriptVersion ?? '*'}`);
      c.addDevDeps('@types/node');
    }
  }
}

// the order in which the user adds aspects should NOT affect outputs!
// TOOD: how do we guarantee that architecturally?
// project.addAspects(
//   new Typescript({
//     typescriptVersion: '4.4',
//     outdir: 'dist',
//   }),
//   new Dependencies(),
//   // Typescript.
// )

new Typescript(project, {
  typescriptVersion: '4.4',
  // outdir: 'dist',
})

// Aspects.of(project).add(new NodeProject())

// adding an ordinary file
new TextFile('hello.txt', {
  lines: [TextFile.PROJEN_MARKER, '', 'Hello world!']
});

// Q: are there cases where one component needs to decide whether
// another component should generate a file or not?
// A: yes, TypeScript implies Eslint shuold generate tsconfig.eslint.json

project.synth();
