"use strict";
/**
 * Expand list examples
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
inquirer_1.default
    .prompt([
    {
        type: 'expand',
        message: 'Conflict on `file.js`: ',
        name: 'overwrite',
        choices: [
            {
                key: 'y',
                name: 'Overwrite',
                value: 'overwrite',
            },
            {
                key: 'a',
                name: 'Overwrite this one and all next',
                value: 'overwrite_all',
            },
            {
                key: 'd',
                name: 'Show diff',
                value: 'diff',
            },
            new inquirer_1.default.Separator(),
            {
                key: 'x',
                name: 'Abort',
                value: 'abort',
            },
        ],
    },
])
    .then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
});
