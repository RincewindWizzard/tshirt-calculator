const fs = require('fs');
const csv = require('csv-parser');

function read_csv(path) {
    const csvData = [];

    const fileContents = fs.readFileSync(path, 'utf-8');
    fileContents
        .trim()
        .split('\n')
        .forEach((line) => {
            const row = line.split(','); // Annahme: CSV-Datei verwendet Komma als Trennzeichen
            csvData.push(row);
        });

    return csvData;
}

const csvData = read_csv('./src/data/t_shirt_sizes.csv');
const t_shirt_sizes = csvData.map((x) => ({ 'name': x[0], 'min': x[1], 'max': x[2] }));

module.exports = {
    t_shirt_sizes: t_shirt_sizes,
};