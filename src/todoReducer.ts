import { Todo } from "./types/index.js";
import * as constants from './constants/index.js';

export default function initializeTodoReducer(args: { todos: Todo[] }) {

  let state = args;

  function todoById(id: string) {
    return state.todos.find(todo => todo.id === id);
  }

  function createTodo(responses: Todo) {
    state.todos.push({
      status: constants.IN_PROGRESS_STATUS,
      id: (Math.floor(Math.random() * 1000)).toString(),
      ...responses
    });

  }

  function deleteTodo(id: string) {
    state.todos = [
      ...state.todos.filter(i => i.id !== id)
    ]
  }

  function updateTodoState(id: string, status: string) {
    let found = todoById(id as string)

    state.todos = [
      ...state.todos.filter(i => i.id === id),
      { ...found as Todo, status }
    ]
  }

  function findTodosByTag(tag: string) {
    const found: Todo[] = state.todos?.filter((todo) => {
      return todo.tags?.some((t) => {
        return t === tag
      })
    })
    return found.map(todo => `${todo.id} ${todo.title}`)
  }

  function getTodos() {
    return state.todos
  }

  return {
    updateTodoState,
    findTodosByTag,
    createTodo,
    deleteTodo,
    todoById,
    getTodos
  }

}