const mysql = require("mysql2");
const inquirer = require("inquirer");

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#Ec629746@!0", 
  database: "employee_db"
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database");
  seedDatabase(); // Seed the database when the connection is established
  promptUser(); // Prompt user after seeding
});

// Seed the database with initial data
function seedDatabase() {
  const seedQueries = [
    "INSERT INTO department (name) VALUES ('Electrical'),('Mechanical'),('Structural'),('Chemical')",
    "INSERT INTO role (title, salary, department_id) VALUES ('Electrical Engineer', 114000, 1),('Mechanical Engineer', 111000, 2),('Structural Engineer', 120000, 3),('Chemical Engineer', 117000, 4)"
  ];

  // Execute each seed query
  seedQueries.forEach((query) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error seeding database:", err);
        return;
      }
      console.log("Database seeded successfully!");
    });
  });
}

// Prompt the user with options
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
      // Based on user choice, call respective function
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

// Display all departments
function displayDepartments() {
  const query = "SELECT * FROM department";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return;
    }
    console.log();
    console.table(results);
    promptUser();
  });
}

// Display all roles
function displayRoles() {
  const query = "SELECT * FROM role";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching roles:", err);
      return;
    }
    console.log();
    console.table(results);
    promptUser();
  });
}

// Display all employees
function displayEmployees() {
  const query = "SELECT * FROM employee";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return;
    }
    console.log();
    console.table(results);
    promptUser();
  });
}

// Add a new department
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
          console.error("Error adding department:", err);
          return;
        }
        console.log("Department added successfully!");
        displayDepartments();
      });
    });
}

// Add a new role
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
          console.error("Error adding role:", err);
          return;
        }
        console.log("Role added successfully!");
        displayRoles();
      });
    });
}

// Add a new employee
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
    ])
    .then(function (data) {
      const query =
        "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?, ?)";
      const values = [
        data.employeeFirst,
        data.employeeLast,
        data.employeeRole,
        data.employeeManager,
      ];
      db.query(query, values, (err, results) => {
        if (err) {
          console.error("Error adding employee:", err);
          return;
        }
        console.log("Employee added successfully!");
        displayEmployees();
      });
    });
}

// Update an employee's role
function updateRole() {
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
          console.error("Error updating employee role:", err);
          return;
        }
        console.log("Employee role updated successfully!");
        displayEmployees();
      });
    });
}