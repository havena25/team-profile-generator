const inquirer = require("inquirer");
const fs = require("fs");
const engineer = require("./lib/engineer");
const intern = require("./lib/intern");
const manager = require("./lib/manager");

const employees = [];

function addMember() {
    inquirer.prompt([{
        message: "Enter team member's name",
        name: "name"
    },
    {
        message: "Enter team member's id",
        name: "id"
    },
    {
        type: "list",
        message: "Select team member's role",
        choices: [
            "engineer",
            "intern",
            "manager"
        ],
        name: "role"
    },
    {
        message: "Enter team member's email address",
        name: "email"
    }])
    .then(function({name, id, role, email}) {
        let roleInfo = "";
        if (role === "engineer") {
            roleInfo = "GitHub username";
        } else if (role === "intern") {
            roleInfo = "school name";
        } else {
            roleInfo = "office phone number";
        }
        inquirer.prompt([{
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo"
        },
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: [
                "yes",
                "no"
            ],
            name: "moreMembers"
        }])
        .then(function({roleInfo, moreMembers}) {
            let newMember;
            if (role === "engineer") {
                newMember = new engineer(name, id, email, roleInfo);
            } else if (role === "intern") {
                newMember = new intern(name, id, email, roleInfo);
            } else {
                newMember = new manager(name, id, email, roleInfo);
            }
            employees.push(newMember);
            console.log(employees);
            if (moreMembers === "yes") {
                addMember();
            }
        });
    });
}

addMember();