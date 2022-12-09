import chalk from 'chalk';
import { createOperation } from './action.js';
import { Responses, Todo } from './types/index.js';

export default function performAction(response: Responses, todos?: Todo[]): Promise<void | Todo[]> | void {

  if (response.option === 'EXIT')
    return console.log(chalk.green('Cya!'))

  const { onCreateTodo, onListTodos } = createOperation({
    todos: todos || []
  })

  switch (response.option) {
    case 'CREATE':
      return onCreateTodo();
    case 'LIST':
      return onListTodos();
    default:
      return;
  }
}