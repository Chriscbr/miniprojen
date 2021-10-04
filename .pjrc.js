const { Project, File, Aspects } = require('./src');

const project = new Project('test');

class ExampleFile extends File {
  constructor(project, filePath, contents) {
    super(project, filePath);
    this.contents = contents;
  }

  synthesizeContent() {
    return this.contents.join('\n');
  }
}

// new ExampleFile(project, 'hello.txt', ['Hello world!']);

// Aspects.of(project).add({
//   visit: (node) => {
//     new ExampleFile()
//   }
// })


project.synth();
