DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name TEXT NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title TEXT NOT NULL,
    department_id INT,
    salary INT NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES departments(id) 
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    manager TEXT,
    role_id INT,
    department_id INT,
    FOREIGN KEY (department_id) 
    REFERENCES departments(id) 
    ON DELETE SET NULL,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL
);



