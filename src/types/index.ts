export type Responses = {
  name: string;
  option: 'CREATE' | 'LIST' | 'EXIT';
}

export type Action = {
  todos: Todo[]
}

export type Todo = {
  id?: string;
  title: string;
  description: string;
  status?: 'IN PROGRESS' | 'DONE' | 'CLOSED' | string,
  dueDate?: Date;
  tags?: string[];
}