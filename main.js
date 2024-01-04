const { readFile } = require('fs/promises');
const util = require('util');

async function readAndOutputJsonFile() {
  try {
    const filePath = '/home/nikel/Downloads/Takeout google tasks/Tasks/Tasks.json';
    const fileContent = await readFile(filePath, 'utf8');
    const parsedJson = JSON.parse(fileContent);
    console.log(util.inspect(parsedJson, { showHidden: false, depth: null }));
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
  }
}

readAndOutputJsonFile();
