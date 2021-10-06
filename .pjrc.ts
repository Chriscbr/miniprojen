import { Construct, IConstruct } from 'constructs';
import { Component, FileBase, GitAttributes, Gitignore, IAspect, Npmignore, Project, TextFile } from './src';

// example 2

// dummy impl, where it's just a text file list of dependencies
class Dependencies extends Component implements IAspect {
  private readonly allDeps = new Array<string>();
  constructor(scope: Construct) {
    super(scope, 'Dependencies');
    new TextFile(this, 'deps.txt', {
      lines: {
        toJSON: () => {
          return [
            '# ' + FileBase.PROJEN_MARKER,
            '',
            ...(this.allDeps || []),
          ];
        }
      } as any,
    })
  }
  public addDeps(...deps: string[]) {
    this.allDeps.push(...deps);
  }
  public addDevDeps(...deps: string[]) {
    this.allDeps.push(...deps);
  }
  public visit(c: IConstruct) {}
}

interface TypescriptOptions {
  readonly typescriptVersion?: string;
}

class Typescript extends Component {
  private readonly typescriptVersion: string;
  constructor(scope: Construct, node: Node, options: TypescriptOptions) {
    super(scope, 'Typescript');
    this.typescriptVersion = options.typescriptVersion ?? '*';

    // new TypescriptConfig(this, ...)
  }
  visit(c: IConstruct) {
    // now, having projen manage dependencies is optional!
    // and it's VERY CLEAR where any dependency logic *has* to reside
    if (c instanceof Dependencies) {
      c.addDevDeps(`typescript^${this.typescriptVersion ?? '*'}`);
      c.addDevDeps('@types/node');
    }

    if (c instanceof Gitignore) {
      c.exclude('src/**/*.js');
    }

    if (c instanceof Npmignore) {
      c.include('src/**/*.js');
    }
  }
}

interface NodeOptions {}

class Node extends Component {
  constructor(scope: Construct, options: NodeOptions = {}) {
    super(scope, 'Node');

    new Npmignore(this);
  }
  visit(c: IConstruct) {
    if (c instanceof Gitignore) {
      c.exclude('node_modules/**');
    }
  }
}

// comments:

// the order in which the user adds aspects should NOT affect outputs!
// how do we guarantee that architecturally?
// I think by, separating initialization (constructors), aspect invocation,
// and synthesis, this should be achieved

// ths API for adding components should look different / be distinctive
// from the API for adding raw files
// TODO: how do to this? naming scheme for file-based classes?
// or adding aspects or files through some other mechanism?

// *******
// PROJECT
// *******
const project = new Project({
  name: 'miniprojen'
});

// **********
// COMPONENTS (L2 and above)
// **********

// the order we add these doesn't matter unless there are
// dependencies between them via constructor arguments!

const node = new Node(project);

new Typescript(project, node, {
  typescriptVersion: '4.4',
});

const gitignore = new Gitignore(project);
gitignore.exclude('.DS_Store');

// we added the dependencies component last and
// yet everything still works! 😱
new Dependencies(project);

new GitAttributes(project);

// *****
// FILES (L0/L1)
// *****

new TextFile(project, 'hello.txt', {
  lines: [TextFile.PROJEN_MARKER, '', 'Hello world!']
});

// Q: are there cases where one component needs to decide whether
// another component should generate a file or not?
// A: yes, TypeScript implies Jest should generate tsconfig.jest.json
// Q: where would does this logic go now, if not TypescriptProject?
// A: in either TypeScript or Jest, using the visitor pattern

project.synth();
