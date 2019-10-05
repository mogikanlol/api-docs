const path = require('path');
const fs = require('fs');
const Generator = require('asyncapi-generator');
const { parse, AsyncAPIDocument } = require('asyncapi-parser');


const targetDir = "target/classes/static/async-docs/"
const resourceDir = "src/main/resources/async-docs/"

fs.mkdirSync(targetDir, { recursive: true })

files = getAllFilesNames(resourceDir)
files = files
          .filter(f => f.name.endsWith(".yaml"))
          .map(f => ({...f, name: f.name.replace(".yaml", "")}))

files.forEach(file => {
  var generator = new Generator('html', path.resolve(__dirname, targetDir + file.name))

  const doc = fs.readFileSync(file.fullPath, { encoding: 'utf8' })
  parse(doc, { path : file.fullDir })
    .then( v => generator.generate(v))
    .catch(error => { 
      console.log(error)
      process.exit(1)
    })
})

function getAllFilesNames(dir, filelist) {
  files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(file => {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = getAllFilesNames(dir + file + '/', filelist)
    } else {
      filelist.push({"fullDir": dir, "name": file, "fullPath": dir + file})
    }
  })
  return filelist
}