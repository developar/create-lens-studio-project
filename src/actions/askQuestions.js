const os = require('os');
const { prompt, Separator } = require('inquirer');
const { join } = require('path');
const chalk = require('chalk');

const filter = (input) => input.trim().replace(/\s+/g, ' ');

const DEFAULTS = {
  framework: 'none',
  stages: ['prod'],
};

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

module.exports = async (input) => {
  const cwd = input.match(/^\//) ? input : join(process.cwd(), input);
  const appName = input.match(/[0-9a-z-]+$/)[0];

  console.log(chalk.gray(`Creating ${chalk.bold(cwd)}…`));

  const answers = await prompt([
    {
      name: 'username',
      type: 'input',
      message: "What's your name?",
      default: () => os.userInfo().username,
      filter,
      validate: (name) => !!name || 'Please provide your name',
    },
    {
      name: 'email',
      type: 'input',
      message: "What's your email adress?",
      filter,
      validate: (email) => (!!email && emailRegex.test(email)) || 'Please provide your email',
    },
    {
      name: 'projectName',
      type: 'input',
      message: "What's the name of your Lens?",
      default: () =>
        appName.replace(/-/g, ' ').replace(/^[a-z]| [a-z]/g, (match) => match.toUpperCase()),
      filter,
      validate: (projectName) => !!projectName || 'Please provide a name',
    },
    {
      name: 'description',
      type: 'input',
      message: 'Please provide one line describing your Lens:',
      default: '3D moustaches for everyone!',
      filter,
    },
    {
      name: 'includeCommonlyUsedCode',
      type: 'confirm',
      message: 'Do you want to include commonly used code?',
      filter,
    },
    {
      name: 'additions',
      type: 'checkbox',
      message: 'Which modules would you like to in?',
      when: ({ includeCommonlyUsedCode }) => includeCommonlyUsedCode,
      choices: [
        new Separator('----- Classes -----'),
        { name: 'Button', value: 'button' },
        { name: 'Audio Manager (for managing audio Assets)', value: 'audioManager' },
        { name: 'Texture Manager (for managing texture Assets)', value: 'textureManager' },
        { name: 'Prefab Manager (for managing prefab Assets)', value: 'prefabManager' },
        { name: 'State Machine (for complex, multi staged lenses)', value: 'stateMachine' },
        new Separator('----- Helpers -----'),
        { name: 'console (for logging stuff)', value: 'console' },
        { name: 'duplicator (clone scene objects or prefabs)', value: 'duplicator' },
        { name: 'time (interval, time outs, etc)', value: 'time' },
      ],
    },
  ]);

  return { ...DEFAULTS, ...answers, appName, cwd };
};