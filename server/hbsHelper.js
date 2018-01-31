
var handlebars = require('handlebars');
var fs = require('fs');

var data = {
    navBar: {
        file: "./public/handlebars/navbar.hbs"
    },
    dashboard: {
        file: "./public/handlebars/dashboard.hbs"
    },
    settings: {
        file: "./public/handlebars/settings.hbs"
    }
};

module.exports.compileTemplates = function() {
    for (var temp in data) {
        data[temp]["template"] = handlebars.compile(readFile(data[temp]["file"]));
    }
};

module.exports.export = function (file, context) {
    return data[file]["template"](context);
};

function readFile(file) {
    return fs.readFileSync(file, 'utf-8');
}