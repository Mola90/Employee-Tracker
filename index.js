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

function addEmploee(){

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

inquirer.prompt(initialQuestions).then((answer) =>{
    switch (answer.questions) {
        case "View All Employees":
            ///function call
            viewAllEmployees();
            break;
        case "Add Employee":
            addEmploee();
            break;
        case "test3":
            //function call
            break;
    }

});

