const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employee_db",
});

function seedDatabase() {
  const seedQueries = [
    "INSERT INTO department (name) VALUES ('Electrical'),('Mechanical'),('Structural'),('Chemical')",
    "INSERT INTO role (title, name, salary, department_id) VALUES ('Electrical Engineer', 'John Doe', 114000, 1),('Mechanical Engineer', 'Jane Smith', 111000, 2),('Structural Engineer', 'Michael Johnson', 120000, 3),('Chemical Engineer', 'Emily Brown', 117000, 4)"
  ];

  seedQueries.forEach((query) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Database seeded successfully!");
    });
  });
}

function promptUser() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
        name: "mainOption",
      },
    ])
    .then(function (data) {
      if (data.mainOption === "View all departments") {
        displayDepartments();
      } else if (data.mainOption === "View all roles") {
        displayRoles();
      } else if (data.mainOption === "View all employees") {
        displayEmployees();
      } else if (data.mainOption === "Add a department") {
        addDepartment();
      } else if (data.mainOption === "Add a role") {
        addRole();
      } else if (data.mainOption === "Add an employee") {
        addEmployee();
      } else if (data.mainOption === "Update an employee role") {
        updateRole();
      }
    });
}

function displayDepartments() {
  const query = "SELECT * FROM department";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log();
    console.table(results);
    promptUser();
  });
}

function displayRoles() {
  const query = "SELECT * FROM role";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log();
    console.table(results);
    promptUser();
  });
}

function displayEmployees() {
  const query = "SELECT * FROM employee";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log();
    console.table(results);
    promptUser();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the name of the new department:",
        name: "newDepartment",
      },
    ])
    .then(function (data) {
      const query = "INSERT INTO department (name) VALUES (?)";
      const values = [data.newDepartment];
      db.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Department added successfully!");
        displayDepartments();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the name of the new role:",
        name: "roleName",
      },
      {
        type: "input",
        message: "Enter the salary of the new role:",
        name: "roleSalary",
      },
      {
        type: "input",
        message: "Enter the department id of the new role",
        name: "roleDepartment",
      },
    ])
    .then(function (data) {
      const query =
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
      const values = [data.roleName, data.roleSalary, data.roleDepartment];
      db.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Role added successfully!");
        displayRoles();
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the first name of the new employee:",
        name: "employeeFirst",
      },
      {
        type: "input",
        message: "Enter the last name of the new employee:",
        name: "employeeLast",
      },
      {
        type: "input",
        message: "Enter id of their role:",
        name: "employeeRole",
      },
      {
        type: "input",
        message: "Enter the manager's id of the new employee:",
        name: "employeeManager",
      },
    ])
    .then(function (data) {
      const query =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      const values = [
        data.employeeFirst,
        data.employeeLast,
        data.employeeRole,
        data.employeeManager,
      ];
      db.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Employee added successfully!");
        displayEmployees();
      });
    });
}

function updateRole() {
  console.log("hit updateRole function");
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the ID of the employee whose role you want to update:",
        name: "employeeId",
      },
      {
        type: "input",
        message: "Enter the new role ID:",
        name: "newRoleId",
      },
    ])
    .then(function (data) {
      const query = "UPDATE employee SET role_id = ? WHERE id = ?";
      const values = [data.newRoleId, data.employeeId];
      db.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Employee role updated successfully!");
        displayEmployees();
      });
    });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedDatabase(); // Seed the database when the server starts
  promptUser(); // Prompt the user after seeding
});