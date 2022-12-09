import inquirer, { Answers, QuestionCollection } from 'inquirer';
import performAction from './performAction.js';
import { STARTER_QUESTIONS } from './questions.js';
import { Responses, Todo } from './types/index.js';
import { welcome } from './utils/index.js';

export default async function promptQuestions(questions: QuestionCollection<Answers> = STARTER_QUESTIONS, todos?: Todo[]) {
  const responses = await inquirer.prompt(questions);
  return performAction(responses as Responses, todos)
}

await welcome();
await promptQuestions();