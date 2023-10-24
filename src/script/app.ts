import Handlebars from "handlebars";

const t_shirt_input_html = require('../html/t-shirt-input.hbs');
console.log(t_shirt_input_html)

const t_shirt_input_template = Handlebars.compile(t_shirt_input_html);

const t_shirt_column = document.getElementById("t-shirt-column");
const t_shirt_sizes = [
    "XXS", "XS", "S", "M", "L", "XL"
]

var html = ''
for (var t_shirt_size in t_shirt_sizes) {
    html = t_shirt_input_template({'t_shirt_size': t_shirt_size})
}

t_shirt_column.innerHTML = html;

