import { readFile } from 'fs/promises';
import util from 'util';
// import jsonToTs from 'json-to-ts';

interface RootObject {
  kind: string;
  items: TaskList[];
}

interface TaskList {
  id: string;
  kind: string;
  title: string;
  updated: string;
  items?: Task[];
  selfLink: string;
}

interface Task {
  id: string;
  notes?: string;
  due?: string;
  kind: string;
  created: string;
  title: string;
  task_type: string;
  updated: string;
  selfLink: string;
  status: string;
  completed?: string;
}



async function readAndOutputJsonFile() {
  try {
    const filePath = './Tasks.json';
    const fileContent = await readFile(filePath, 'utf8');
    const parsedJson = JSON.parse(fileContent) as RootObject;
    console.log(util.inspect(parsedJson, { showHidden: false, depth: null }));
    return {parsedJson, fileContent};
  } catch (error) {
    throw new Error('Error reading or parsing the JSON file:', { cause: error });
  }
}

const { parsedJson } = await readAndOutputJsonFile();

// console.log(jsonToTs(parsedJson).join('\n'));

const { taskListsWithTasks, emptyTaskLists } = Object.groupBy(
  parsedJson.items,
  ({ items }) => !!items?.length
    ? 'taskListsWithTasks'
    : 'emptyTaskLists'
) as {taskListsWithTasks: (TaskList & { items: Task[] })[], emptyTaskLists: Omit<TaskList, 'items'>[]}; // need https://github.com/microsoft/TypeScript/pull/56805 to be merged to remove type assertion


console.log('Task lists with tasks:', taskListsWithTasks.map(({ title }) => title).join(', '));
console.log('Empty task lists:',          emptyTaskLists.map(({ title }) => title).join(', '));

const markdownLines = taskListsWithTasks.flatMap(
  ({ items: tasks, ...taskList }, taskListIndex) => [
    (taskListIndex + 1) + '. ' + taskList.title,
    ...tasks
      .filter(({ status }) => status !== 'completed')
      .map(
        ({ title: taskTitle, notes }, localTaskIndex) =>
          '    '
          + (localTaskIndex + 1)
          + '. '
          + taskTitle
          + (notes ? ` (${notes.replaceAll('\n', ' ')})` : '')
      ),
  ]
);

console.log(markdownLines.join('\n'));
