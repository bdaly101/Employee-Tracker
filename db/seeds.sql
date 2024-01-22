INSERT INTO departments (department_name) 
VALUES ('Human Resources'),
       ('Engineering'),
       ('Sales'),
       ('Marketing');

INSERT INTO roles (job_title, department_id, salary)
VALUES ('HR Manager', 1, 70000),
       ('Software Engineer', 2, 80000),
       ('Sales Executive', 3, 60000),
       ('Marketing Coordinator', 4, 55000);

INSERT INTO employees (first_name, last_name, role_id, department_id, manager) 
VALUES ('John', 'Doe', 1, 1, NULL),
       ('Jane', 'Smith', 2, 2, NULL),
       ('Emily', 'Jones', 3, 3, 'John Doe'),
       ('Michael', 'Brown', 4, 4, 'Jane Smith');