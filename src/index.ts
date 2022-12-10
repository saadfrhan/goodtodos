import main from './main.js';
import welcome from './utils/welcome.js';

(async () => {
  await welcome();
  await main().starterQuestion();
})();