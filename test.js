import * as ts from 'typescript';
import { readFile } from 'fs/promises';
import util from 'util';
function printAst(sourceFile) {
    function print(node) {
        console.log(ts.SyntaxKind[node.kind]);
        ts.forEachChild(node, print);
    }
    print(sourceFile);
}
async function readAndOutputJsonFile() {
    try {
        const filePath = '/home/nikel/Downloads/Takeout google tasks/Tasks/Tasks.json';
        const fileContent = await readFile(filePath, 'utf8');
        const parsedJson = JSON.parse(fileContent);
        console.log(util.inspect(parsedJson, { showHidden: false, depth: null }));
        return { parsedJson, fileContent };
    }
    catch (error) {
        throw new Error('Error reading or parsing the JSON file:', { cause: error });
    }
}
const { fileContent, parsedJson } = await readAndOutputJsonFile();
const sourceFile = ts.createSourceFile('tasks.json', fileContent, ts.ScriptTarget.ES2015, true, ts.ScriptKind.JSON);
printAst(sourceFile);
