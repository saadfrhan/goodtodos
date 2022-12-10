import inquirer, { QuestionCollection } from "inquirer";
import { Todo } from "./types/index.js";
import * as constants from './constants/index.js';

export const STARTER_QUESTION: QuestionCollection<{ option: string }> = [
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

export const LIST_TODOS_QUESTION: QuestionCollection<{ view: string }> = {
  name: 'view',
  type: 'list',
  message: 'In what format would you like to view your todos?',
  choices: ['Table (no options)', 'List (as options)', 'Filtered List (as options)', 'Exit'],
  default: 'List (as options)'
}

export const TagQuestion = (todos: Todo[]) => [{
  name: 'tag',
  message: 'Enter tag name you want to search by.',
  type: 'input',
  validate: (val: string) => todos.some(todo => todo.tags?.includes(val)) || constants.TAG_VALIDATION_MESSAGE.replace('%s', val)
}];

export const ListTodosQuestion = (allTodos: Todo[]): QuestionCollection<{ todo: string }> => {
  return {
    name: 'todo',
    message: 'Select any todo for information.',
    type: 'list',
    choices: allTodos.length > 0 ? allTodos.map(todo => `${todo.id} ${todo.title}`) : [constants.NO_TODOS_MESSAGE]
  }
}

export const STATUS_MUTATION_QUESTION: QuestionCollection<{ status: string }> = [{
  name: 'status',
  type: 'input',
  message: 'Please enter status name:',
  default: 'DONE',
  validate: (val) => Boolean(val) || 'Enter correctly.'
}]

export const TODO_EVENT_QUESTIONS: QuestionCollection<{ setting: 'UPDATE' | 'DELETE' | 'BACK' }> = [{
  name: 'setting',
  type: 'expand',
  message: 'Do you wanna do anything with this?',
  choices: [
    new inquirer.Separator(),
    {
      key: 'u',
      name: 'Update Todo status',
      value: 'UPDATE'
    },
    {
      key: 'd',
      name: 'Delete Todo',
      value: 'DELETE'
    },
    {
      key: 'x',
      name: 'Go Back',
      value: 'BACK'
    }
  ],
}]

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