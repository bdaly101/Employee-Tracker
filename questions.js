const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employee_db'
});

db.connect(err => {
  if (err) {
    console.error('Error occurred:', err);
    return;
  }
});

function viewAllDepartments() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, department_name FROM departments';
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error occurred:', err);
          return;
        }
          console.table(results);
          resolve(results);
      });
    });
    
  }
  
  function viewAllRoles() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT roles.id, roles.job_title, departments.department_name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id';
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error occurred:', err);
          reject(err);
          return;
        }
        console.table(results);
        resolve(results);
      });
    });
  }
  

  
  function viewAllEmployees() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT employees.id, employees.first_name, employees.last_name, roles.job_title, departments.department_name, roles.salary, employees.manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON employees.department_id = departments.id';
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error occurred:', err);
          reject(err);
          return;
        }
        console.table(results);
        resolve(results);
      });
    });
  }
  

  
function addDepartment() {
  return new Promise((resolve, reject) => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    }
  ]).then((answer) => {
    const sql = 'INSERT INTO departments (department_name) VALUES (?)';
    db.query(sql, [answer.departmentName], (err, results) => {
      if (err) {
        console.error('Error occurred:', err);
        return;
      }
      console.log('Department Added');
      resolve(results);
    });
  });
});
}
  
    

  
function addRole() {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'Enter the name of the role:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'input',
        name: 'roleDept',
        message: 'Enter the name of the department for the role:',
      }
    ]).then((answers) => {
      const findDept = 'SELECT id FROM departments WHERE department_name = ?';
      db.query(findDept, [answers.roleDept], (err, results) => {
        if (err) {
          console.error('Error occurred:', err);
          reject(err);
          return;
        }
        if (results.length === 0) {
          console.log('Department not found.');
          reject(new Error('Department not found'));
          return;
        }

        const departmentId = results[0].id; 
        const insertRoleSql = 'INSERT INTO roles (job_title, salary, department_id) VALUES (?, ?, ?)';
        db.query(insertRoleSql, [answers.roleName, answers.roleSalary, departmentId], (insertErr, insertResults) => {
            if (insertErr) {
                console.error('Error occurred:', insertErr);
                reject(insertErr);
                return;
            }
            console.log('Role Added');
            console.table(insertResults);
            resolve(true);
        });
      });
    }).catch(err => {
      console.error('Inquirer error:', err);
      reject(err);
    });
  });
}



  
function addEmployee() {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
      },
      {
        type: 'input',
        name: 'role',
        message: "Enter the employee's role:",
      },
      {
        type: 'input',
        name: 'manager',
        message: "Enter the employee's manager:",
      },
    ]).then((answers) => {
      
      const findRole = 'SELECT id, department_id FROM roles WHERE job_title = ?';
      db.query(findRole, [answers.role], (err, roleResults) => {
        if (err) {
          console.error('Error occurred:', err);
          reject(err);
          return;
        }
        if (roleResults.length === 0) {
          console.log('Role not found.');
          reject(new Error('Role not found'));
          return;
        }

        const roleId = roleResults[0].id;
        const departmentId = roleResults[0].department_id;

        
        const insertEmpSql = 'INSERT INTO employees (first_name, last_name, role_id, department_id, manager) VALUES (?, ?, ?, ?, ?)';
        db.query(insertEmpSql, [answers.firstName, answers.lastName, roleId, departmentId, answers.manager], (insertErr, insertResults) => {
            if (insertErr) {
                console.error('Error occurred:', insertErr);
                reject(insertErr);
                return;
            }
            console.log('Employee Added');
            resolve(true);
        });
      });
    }).catch(err => {
      console.error('Error:', err);
      reject(err);
    });
  });
}

  
function updateEmployeeRole() {
  return new Promise((resolve, reject) => {
    
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, empResults) => {
      if (err) {
        console.error('Error occurred:', err);
        reject(err);
        return;
      }

      inquirer.prompt([
        {
          type: 'list',
          name: 'selectedEmployee',
          message: 'Select an employee to update:',
          choices: empResults.map(employee => ({ name: employee.name, value: employee.id }))
        }
      ]).then(answer => {
        
        inquirer.prompt([
          {
            type: 'input',
            name: 'newRole',
            message: "Enter the employee's new role:",
          }
        ]).then(newRoleAnswer => {
          
          const findRole = 'SELECT id, department_id FROM roles WHERE job_title = ?';
          db.query(findRole, [newRoleAnswer.newRole], (roleErr, roleResults) => {
            if (roleErr) {
              console.error('Error occurred:', roleErr);
              reject(roleErr);
              return;
            }
            if (roleResults.length === 0) {
              console.log('Role not found.');
              reject(new Error('Role not found'));
              return;
            }

            const roleId = roleResults[0].id;
            const departmentId = roleResults[0].department_id;

            
            const updateSql = 'UPDATE employees SET role_id = ?, department_id = ? WHERE id = ?';
            db.query(updateSql, [roleId, departmentId, answer.selectedEmployee], (updateErr, updateResults) => {
              if (updateErr) {
                console.error('Error occurred:', updateErr);
                reject(updateErr);
                return;
              }

              console.log('Employee role updated successfully.');
              resolve(true);
            });
          });
        });
      });
    });
  });
}

  



  module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};
