const inquirer = require('inquirer');
const questions = require('./questions.js');
const mysql = require('mysql2');


function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'actionChoice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        },
    ])
    .then((answers) => {
        switch (answers.actionChoice) {
            case 'View all departments':
                questions.viewAllDepartments().then(init);
                break;
            case 'View all roles':
                questions.viewAllRoles().then(init);
                break;
            case 'View all employees':
                questions.viewAllEmployees().then(init);
                break;
            case 'Add a department':
                questions.addDepartment().then(init);
                break;
            case 'Add a role':
                questions.addRole().then(init);
                break;
            
            case 'Add an employee':
                 questions.addEmployee().then(init);
                 break;
            case 'Update an employee role':
                 questions.updateEmployeeRole().then(init);
                 break;
            default:
                console.error('Select a valid choice');
                init(); 
        }
    }).catch(err => {
        console.error('An error occurred:', err);
        init(); 
    });
}


init();