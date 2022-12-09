import { QuestionCollection } from "inquirer";
import { Todo } from "./types/index.js";

export const STARTER_QUESTIONS: QuestionCollection = [
  {
    name: 'option',
    type: 'list',
    message: 'What you wanna do?',
    choices: [
      'Create Todo',
      'List Todos',
      'Exit'
    ],
    filter: (val) => val.split(' ')[0].toUpperCase()
  }
];

export const TODO_CREATION_QUESTIONS: QuestionCollection<Todo> = [
  {
    name: 'title',
    type: 'input',
    message: 'Write the task name:',
    default: 'My Task',
    validate: (val) => Boolean(val) || 'Enter task name.',
  },
  {
    name: 'description',
    type: 'input',
    message: 'Write the task description: (optional)',
  },
  {
    name: 'dueDate',
    type: 'input',
    message: 'What is the due date? (optional)',
    validate: (date) => date ? !Number.isNaN(Date.parse(date)) || 'Write date correctly.' : true
  },
  {
    name: 'tags',
    type: 'input',
    message: 'Tags? (optional)',
    validate: (val) => Boolean(val) || 'Write tags correctly',
    filter: (val) => val.split(' ')
  }
]