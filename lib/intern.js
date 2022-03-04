const Employee = require("./Employee");

class intern extends Employee {
    constructor (name, id, email, school) {
        super (name, id, email);
        this.school = school;
    }
    getRole() {
        return "intern";
    }
    getSchool() {
        return this.school;
    }
}

module.exports = intern;