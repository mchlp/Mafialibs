
var handlebars = require('handlebars');
var fs = require('fs');

var navBarFile = "./handlebars/navbar.hbs";
var dashboardFile = "./handlebars/dashboard.hbs";

var navBarTemplate;
var dashboardTemplate;

module.exports.compileTemplates = function() {
    navBarTemplate = handlebars.compile(readFile(navBarFile));
    dashboardTemplate = handlebars.compile(readFile(dashboardFile));
};

module.exports.exportNavBar = function (context) {
    return navBarTemplate(context);
};

module.exports.exportDashboard = function (context) {
    return dashboardTemplate(context);
}

function readFile(file) {
    return fs.readFileSync(file, 'utf-8');
}