module.exports = [
  {
    type: 'select',
    name: 'level',
    message: 'Choose the atomic level of component you will generate',
    choices: ['atoms', 'molecules', 'organisms', 'templates'],
  },
  {
    type: 'input',
    name: 'name',
    message: 'Please enter your component\'s name',
  },
];
