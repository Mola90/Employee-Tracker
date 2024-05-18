USE employee_tracker_db;

INSERT INTO department (name) VALUES 
('Engineering'),
('Marketing'),
('Finance'),
('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 75000.00, 1),
('Data Analyst', 65000.00, 1),
('Marketing Manager', 85000.00, 2),
('Sales Representative', 55000.00, 2),
('Accountant', 70000.00, 3),
('HR Specialist', 60000.00, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES
('John', 'Doe', 1),
('Jane', 'Smith', 2),
('Mary', 'Johnson', 3),
('James', 'Brown', 4),
('Patricia', 'Williams', 5),
('Robert', 'Jones', 6);