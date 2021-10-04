import { Project, TextFile } from './src';

const project = new Project({
  name: 'miniprojen'
});

new TextFile(project, 'File', {
  filePath: 'hello.txt',
  lines: [TextFile.PROJEN_MARKER, '', 'Hello world!']
});

// Aspects.of(project).add({
//   visit: (node) => {
//     new ExampleFile()
//   }
// })

project.synth();
