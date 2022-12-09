import chalk from 'chalk';
import inquirer, { Answers } from 'inquirer';
import { TagQuestion, STARTER_QUESTION, STATUS_MUTATION_QUESTION, TODO_CREATION_QUESTIONS, TODO_EVENT_QUESTIONS, LIST_TODOS_QUESTION, ListTodosQuestion } from './questions.js';
import initializeTodoReducer from './todoReducer.js';
import { Todo } from './types/index.js';
import * as constants from './constants/index.js';

export function main() {

  const {
    createTodo,
    deleteTodo,
    findTodosByTag,
    updateTodoState,
    getTodos,
    todoById
  } = initializeTodoReducer({
    todos: []
  });

  async function starterQuestion(sQ: () => Promise<void> = starterQuestion) {
    const responses = await inquirer.prompt(STARTER_QUESTION);
    switch (responses.option) {
      case 'CREATE':
        await onCreateTodo();
        await sQ();
        break;
      case 'LIST':
        await onListTodos();
        await sQ();
        break;
      default:
        console.log(chalk.green('Cya!'));
        break;
    }
  }

  async function onCreateTodo() {
    const responses: Todo = await inquirer.prompt(TODO_CREATION_QUESTIONS);
    createTodo({
      status: constants.IN_PROGRESS_STATUS,
      id: (Math.floor(Math.random() * 1000)).toString(),
      ...responses
    });
    return console.log(chalk.yellow('Todo created!'));
  }

  async function onListTodos(): Promise<Answers | undefined | void | Todo[]> {

    const responses = await inquirer.prompt(LIST_TODOS_QUESTION);

    let optionSelection = responses.view.split(' ')[0]

    let response;

    switch (optionSelection) {
      case 'List':
        response = await inquirer.prompt(ListTodosQuestion(getTodos()));
        await onClickTodo(response as { todo: string });
        break;
      case 'Table':
        getTodos().length > 0 ? console.table(getTodos()) : console.log(constants.NO_TODOS_MESSAGE)
        await starterQuestion();
        break;
      case 'Filtered': {
        const { tag } = await inquirer.prompt(TagQuestion(getTodos()));
        response = await inquirer.prompt([{
          ...ListTodosQuestion(getTodos()),
          choices: findTodosByTag(tag)
        }]);
        await onClickTodo(response as { todo: string });
        break;
      }
      default:
        break;
    }

  }

  async function onClickTodo(response: { todo: string }): Promise<Todo[] | void | Answers> {
    const { todo } = response;
    if (todo === 'You have no todos') {
      return await onCreateTodo();
    } else {
      const wantedTodo = todoById(todo.split(' ')[0]);
      console.log(chalk.whiteBright(wantedTodo?.title))
      console.log(wantedTodo?.tags && 'Tags: ' + wantedTodo.tags.join(', '))
      console.log(wantedTodo?.status && 'Status: ' + wantedTodo.status);
      console.log(wantedTodo?.dueDate && 'Due date: ' + wantedTodo.dueDate);
      console.log(wantedTodo?.description && 'Description: ' + wantedTodo.description);
      return await afterClickingTodo(wantedTodo as Todo);
    }
  }

  async function afterClickingTodo(todo: Todo): Promise<void | Todo[] | Answers> {
    const { setting } = await inquirer.prompt(TODO_EVENT_QUESTIONS);

    switch (setting) {
      case 'UPDATE': {
        const { status } = await inquirer.prompt(STATUS_MUTATION_QUESTION);
        updateTodoState(todo.id as string, status)
        break;
      }

      case 'DELETE':
        deleteTodo(todo.id as string)
        break;

      default:
        return onListTodos();

    }

    return onListTodos();
  }

  return {
    onCreateTodo,
    onListTodos,
    starterQuestion
  }

}


