import chalk from 'chalk';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import promptQuestions from './index.js';
import { STARTER_QUESTIONS, TODO_CREATION_QUESTIONS } from './questions.js';
import initializeTodoReducer from './todoReducer.js';
import { Todo } from './types/index.js';
import * as constants from './constants/index.js';

export function createOperation(args: { todos: Todo[] }) {

  const {
    createTodo,
    deleteTodo,
    findTodosByTag,
    updateTodoState,
    getTodos,
    todoById
  } = initializeTodoReducer({
    todos: args.todos
  });

  const allTodos = getTodos();


  async function onCreateTodo() {
    const responses: Todo = await inquirer.prompt(TODO_CREATION_QUESTIONS);
    createTodo({
      status: constants.IN_PROGRESS_STATUS,
      id: (Math.floor(Math.random() * 1000)).toString(),
      ...responses
    });
    console.log(chalk.yellow('Todo created!'));
    console.log(allTodos)
    return promptStarterQuestions();
  }

  async function onListTodos() {

    const responses: { view: string } = await inquirer.prompt([{
      name: 'view',
      type: 'list',
      message: 'In what format would you like to view your todos?',
      choices: ['Table (no options)', 'List (as options)', 'Filtered List (as options)', 'Exit'],
      default: 'List (as options)'
    }]);

    const question1 = [{
      name: 'tag',
      message: 'Enter tag name you want to search by.',
      type: 'input',
      validate: (val: string) => getTodos().some(todo => todo.tags?.includes(val)) || constants.TAG_VALIDATION_MESSAGE.replace('%s', val)
    }];

    const question2 = {
      name: 'todo',
      message: 'Select any todo for information.',
      type: 'list',
      choices: allTodos.length > 0 ? allTodos.map(todo => `${todo.id} ${todo.title}`) : [constants.NO_TODOS_MESSAGE],
    }

    const response = async (): Promise<Answers | void> => {
      if (responses.view.split(' ')[0] === 'List') {
        return await inquirer.prompt(question2 as QuestionCollection)
      } else if (responses.view.split(' ')[0] === 'Table') {
        allTodos.length > 0 ? console.table(allTodos) : console.log(constants.NO_TODOS_MESSAGE)
        return promptStarterQuestions();
      } else if (responses.view.split(' ')[0] === 'Filtered') {
        const { tag } = await inquirer.prompt(question1);
        console.log(findTodosByTag(tag))
        return await inquirer.prompt({
          ...question2,
          choices: findTodosByTag(tag)
        } as QuestionCollection)
      } else {
        return promptStarterQuestions();
      }
    }

    return onClickTodo(() => response() as Promise<Answers & { todo: string }
    >)
  }

  async function onClickTodo(response: () => Promise<Answers & { todo: string }>) {
    const { todo } = await response();
    if (todo === 'You have no todos') {
      return onCreateTodo();
    } else {
      const wantedTodo = todoById(todo.split(' ')[0]);
      console.log(chalk.whiteBright(wantedTodo?.title));
      console.log(wantedTodo?.tags && 'Tags: ' + wantedTodo.tags.join(', '))
      console.log(wantedTodo?.status && 'Status: ' + wantedTodo.status);
      console.log(wantedTodo?.dueDate && 'Due date: ' + wantedTodo.dueDate);
      console.log(wantedTodo?.description && 'Description: ' + wantedTodo.description);
      afterClickingTodo(wantedTodo as Todo)
    }
  }

  async function afterClickingTodo(todo: Todo) {
    const { setting }: { setting: 'UPDATE' | 'DELETE' | 'EXIT' } = await inquirer.prompt([{
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
          name: 'Exit Todo selection',
          value: 'EXIT'
        }
      ],
    }]);

    switch (setting) {
      case 'UPDATE':
        const { status }: { status: string } = await inquirer.prompt([{
          name: 'status',
          type: 'input',
          message: 'Please enter status name:',
          default: 'DONE',
          validate: (val) => Boolean(val) || 'Enter correctly.'
        }]);

        updateTodoState(todo.id as string, status)
        break;

      case 'DELETE':
        deleteTodo(todo.id as string)
        break;

      default:
        return promptStarterQuestions();
    }

    return promptStarterQuestions();
  }

  async function promptStarterQuestions() {
    return promptQuestions(STARTER_QUESTIONS[1 as keyof typeof STARTER_QUESTIONS], allTodos);
  }

  return {
    onCreateTodo,
    onListTodos
  }

}


