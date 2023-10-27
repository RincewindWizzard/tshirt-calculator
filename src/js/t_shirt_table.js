import t_shirt_size_csv from '../data/t_shirt_sizes.csv';

export const t_shirt_sizes = t_shirt_size_csv
    .map((x) => ({'name': x[0], 'min': x[1], 'max': x[2]}))

export function create_description_table() {
    const t_shirt_table_div = document.getElementById("t_shirt_table");
    const t_shirt_table = document.createElement("table");
    t_shirt_table.classList.add("table", "is-striped", "is-hoverable");

    t_shirt_table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Minimum</th>
                <th>Maximum</th>
            </tr>
        </thead>
    `

    let tbody = document.createElement("tbody")

    for (const t_shirt of t_shirt_sizes) {
        tbody.appendChild(tr([
            `<td>${t_shirt.name}</td>`,
            `<td class="has-text-right">${t_shirt.min} PT</td>`,
            `<td class="has-text-right">${t_shirt.max} PT</td>`
        ]));
    }

    t_shirt_table.appendChild(tbody)
    t_shirt_table_div.appendChild(t_shirt_table)
}

function tr(cells) {
    let row = document.createElement("tr");
    row.innerHTML = cells.join('')
    return row
}