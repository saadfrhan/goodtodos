import chalk from "chalk";
import chalkAnimation from "chalk-animation";

const sleep = (ms: number = 2000) => new Promise(resolve => setTimeout(resolve, ms));

export async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow('Welcome to the TODO CLI');
  await sleep();
  console.log(`
    ${chalk.bgBlueBright('Instructions:')}
    ${chalk.blue('1.')} Create a Todo from the very first option.
    ${chalk.blue('2.')} List Todos either on table form or list form by selecting second option.
    ${chalk.blue('3.')} Delete Todo or update Todo status when selecting any Todo from the list form.
  `);
  rainbowTitle.stop();
  await sleep(1000);
}