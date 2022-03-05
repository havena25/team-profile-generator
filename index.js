const inquirer = require("inquirer");
const fs = require("fs");
const engineer = require("./lib/engineer");
const intern = require("./lib/intern");
const manager = require("./lib/manager");

const employees = [];

function initApp() {
    startHtml();
    addMember();
}

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
            "manager",
            "engineer",
            "intern"
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
            addHtml(newMember)
            .then(function() {
                if (moreMembers === "yes") {
                    addMember();
                } else {
                    finishHtml();
                }
            });

        });
    });
}

function startHtml() {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
        <link rel="stylesheet" href="../src/stylesheet.css">
        <title>Team Profile</title>
    </head>
    <body>
        <nav class="navbar navbar-dark bg-dark mb-5 shadow-sm" id="navigation">
            <span class="navbar-brand mb-0 h1 w-100 text-center">Team Profile</span>
        </nav>
        <div class="container">
            <div class="row">`;
    fs.writeFile("./dist/team.html", html, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("start");
}

function addHtml(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        let data = "";
        if (role === "engineer") {
            const gitHub = member.getGithub();
            data = `<div class="col-4">
            <div class="card mx-auto mb-3 shadow" style="width: 18rem" id="profile-card">
            <h4 class="card-header" id="name-header">${name}</h4>
            <h6 class="card-header" id="role-header"><i class="bi bi-stack"></i> Engineer</h6>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><i class="bi bi-person" id="list-icon"></i> ID: ${id}</li>
                <li class="list-group-item"><i class="bi bi-envelope" id="list-icon"></i> Email: ${email}</li>
                <li class="list-group-item"><i class="bi bi-github" id="list-icon"></i> GitHub: ${gitHub}</li>
            </ul>
            </div>
        </div>`;
        } else if (role === "intern") {
            const school = member.getSchool();
            data = `<div class="col-4">
            <div class="card mx-auto mb-3 shadow" style="width: 18rem" id="profile-card">
            <h4 class="card-header" id="name-header">${name}</h4>
            <h6 class="card-header" id="role-header"><i class="bi bi-mortarboard-fill"></i> Intern</h6>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><i class="bi bi-person" id="list-icon"></i> ID: ${id}</li>
                <li class="list-group-item"><i class="bi bi-envelope" id="list-icon"></i> Email: ${email}</li>
                <li class="list-group-item"><i class="bi bi-building" id="list-icon"></i> School: ${school}</li>
            </ul>
            </div>
        </div>`;
        } else {
            const officePhone = member.getOfficeNumber();
            data = `<div class="col-4">
            <div class="card mx-auto mb-3 shadow" style="width: 18rem" id="profile-card">
            <h4 class="card-header" id="name-header">${name}</h4>
            <h6 class="card-header" id="role-header"><i class="bi bi-briefcase-fill"></i> Manager</h6>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><i class="bi bi-person" id="list-icon"></i> ID: ${id}</li>
                <li class="list-group-item"><i class="bi bi-envelope" id="list-icon"></i> Email: ${email}</li>
                <li class="list-group-item"><i class="bi bi-telephone" id="list-icon"></i> Office Phone: ${officePhone}</li>
            </ul>
            </div>
        </div>`
        }
        console.log("adding team member");
        fs.appendFile("./dist/team.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
}

function finishHtml() {
    const html = ` </div>
    </div>
    
</body>
</html>`;

    fs.appendFile("./dist/team.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("Your file has been generated, please find it in the dist folder");
}

initApp();