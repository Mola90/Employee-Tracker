const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mola7234",
    database: "employee_tracker_db"
});

db.connect((err) =>{
    if (err){
        console.log("Failed to connect due to" + err);
    }else{
        console.log("Connected to employee_tracker_db");
    }
});

const initialQuestions = [
    {
        type: 'list',
        name: "questions",
        message: "What would you like to do?",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add A Role", "View ALL Departments", "Add Department"],

    },
];

function viewAllEmployees (){
    
        const query =`
        SELECT employee.id,
               employee.first_name,
               employee.last_name,
               role.title,
               department.name as department,
               role.salary
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id`;  

        db.query(query, (err,result) => err? console.log("err" + err): console.log(result));
};

function addEmployee(){

    db.query(`SELECT id, title FROM role`, (err, roles) => {
        if (err){
            console.log("error:" + err);
            return;
        }

        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        const newEmployeeData = [
            {
                type: "input",
                name: "first_name",
                message: "Please enter employees first name"
            },
            {
                type: "input",
                name: "last_name",
                message: "Please enter employees lastname"
            },
            {
                type: "list",
                name: "role_id",
                message: "please choose a role for the employee",
                choices: roleChoices,
            }
        ];

        inquirer.prompt(newEmployeeData).then((answers) =>{
            const { first_name, last_name, role_id } = answers;
            
            db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`, [first_name, last_name, role_id], (err,result) => err? console.log("err" + err): console.log("employee added" + result));
        });

    });

};

function updateEmployeeRole(){
    db.query(`SELECT id, CONCAT(first_name, ' ' , last_name) AS name FROM employee`, (err, result) => {

        const employeeChoices = result.map(result => ({ name: result.name, value: result.id }));

        db.query(`SELECT id, title FROM role`, (err, roles) => {
            if (err){
                console.log("error:" + err);
                return;
            }
    
            const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

            const updatedRoleData = [
                {
                    type: "list",
                    name: "employee_id",
                    message: "Please choose which employees role you will update",
                    choices: employeeChoices
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Please choose new role",
                    choices: roleChoices,
                },
            ];

            inquirer.prompt(updatedRoleData).then((answer) => {
                const {employee_id, role_id} = answer;

                db.query(`UPDATE employee SET role_id = ? WHERE id =?`, [role_id, employee_id], (err, result) => err? console.log("err" + err): console.log("employee added" + result));
            });



        });
});
};

function viewRoles (){
    const query =
    `SELECT role.id, role.title, department.name AS department, role.salary FROM role
    JOIN department ON role.department_id = department.id`;

    db.query(query, (err, roles) =>{
        if (err) {
            console.log(err);  
            return;          
        }
        console.table(roles);
    });
}


function addDepartment(){

 

        const newDepartmentData = [
            {
                type: "input",
                name: "department_name",
                message: "Please enter new department name"
            },
            
        ];

        inquirer.prompt(newDepartmentData).then((answers) =>{
            const { department_name} = answers;
            
            db.query(`INSERT INTO department (name) VALUES (?)`, [department_name], (err,result) => err? console.log("err" + err): console.log("department added" + result));
        });    

};

function viewAllDepartments (){
    
    const query =`SELECT id, name FROM department`;  

    db.query(query, (err,result) => err? console.log("err" + err): console.table(result));
};

function addRole(){

    db.query(`SELECT id, name FROM department`, (err, departments) => {
        if (err) {
            console.log("Error fetching departments: " + err);
            return;
        }

        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));

        const newRoleQuestions = [
            {
                type: "input",
                name: "role_title",
                message: "Please enter the title of the new role:"
            },
            {
                type: "input",
                name: "role_salary",
                message: "Please enter the salary of the new role:"
            },
            {
                type: "list",
                name: "department_id",
                message: "Please choose the department for the new role:",
                choices: departmentChoices
            }
        ];

        inquirer.prompt(newRoleQuestions).then((answers) => {
            const { role_title, role_salary, department_id } = answers;

            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [role_title, role_salary, department_id], (err, result) => {
                if (err) {
                    console.log("Error: " + err);
                } else {
                    console.log("Role added successfully!");
                }
            });
        });
    });

};







inquirer.prompt(initialQuestions).then((answer) =>{
    switch (answer.questions) {
        case "View All Employees":
            ///function call
            viewAllEmployees();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "View All Roles":
            viewRoles();
            break;    
    }

});

