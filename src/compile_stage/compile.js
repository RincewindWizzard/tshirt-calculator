const fs = require('fs');

function read_csv(path) {
    const csvData = [];

    const fileContents = fs.readFileSync(path, 'utf-8');
    fileContents
        .trim()
        .split('\n')
        .forEach((line) => {
            const row = line.split(',');
            csvData.push(row);
        });

    return csvData;
}

const csvData = read_csv('./src/data/t_shirt_sizes.csv');
const t_shirt_sizes = csvData.map((x) => ({'name': x[0], 'id': x[0], 'min': x[1], 'max': x[2]}));


module.exports = {
    'template_context': {
        t_shirt_sizes: t_shirt_sizes,
    }
}