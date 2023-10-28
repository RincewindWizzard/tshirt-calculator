import * as d3 from 'd3';

import {t_shirt_sizes} from "./t_shirt_table.js"

const success_probability_input = document.getElementById("success_probability");
const capacity_input = document.getElementById("capacity");

function efficient_count(t_shirts) {
    //console.log(t_shirts)
    let min_x = t_shirts.reduce((sum, t_shirt) => sum + t_shirt.min, 0);
    let max_x = t_shirts.reduce((sum, t_shirt) => sum + t_shirt.max, 0);

    function count_combinations(current_index, current_sum) {
        if (current_index === t_shirts.length) {
            return current_sum === 0 ? 1 : 0
        }

        if (memo[current_index] && memo[current_index][current_sum] !== undefined) {
            return memo[current_index][current_sum];
        }

        let t_shirt = t_shirts[current_index]
        let possibilities = 0
        for (let size = t_shirt.min; size <= t_shirt.max; size++) {
            possibilities += count_combinations(current_index + 1, current_sum - size)
        }
        memo[(current_index, current_sum)] = possibilities
        return possibilities
    }

    let memo = {}
    let possibilities = {}

    for (let i = min_x; i <= max_x; i++) {
        possibilities[i] = count_combinations(0, i)
    }

    return Object.entries(possibilities)
        .map((x) => [parseInt(x[0]), x[1]])
}

/*
*
* def efficient_count(t_shirts):
    min_x = sum(t_shirt.min for t_shirt in t_shirts)
    max_x = sum(t_shirt.max for t_shirt in t_shirts)

    def count_combinations(current_index, current_sum):
        if current_index == len(t_shirts):
            return 1 if current_sum == 0 else 0

        if (current_index, current_sum) in memo:
            return memo[(current_index, current_sum)]

        t_shirt = t_shirts[current_index]
        possibilities = 0
        for size in range(t_shirt.min, t_shirt.max + 1):
            possibilities += count_combinations(current_index + 1, current_sum - size)

        memo[(current_index, current_sum)] = possibilities
        return possibilities

    memo = {}
    possibilities = defaultdict(int)

    for i in range(min_x, max_x + 1):
        possibilities[i] = count_combinations(0, i)

    result = list(possibilities.items())
    return result
* */

function plot_histogram(data) {
    const container = document.getElementById("histogram");

    const width = container.clientWidth
    const height = container.clientHeight
    const margin = {top: 20, right: 20, bottom: 30, left: 40};


    // Skalierungsfunktionen für die Achsen
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[0])])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Linie erstellen
    const line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    // SVG-Element erstellen
    const svg = d3.create("svg")
        .attr("width", width) // Breite des SVG-Containers
        .attr("height", height); // Höhe des SVG-Containers

    // Linie zeichnen
    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", "lightsteelblue")
        .attr("stroke", "blue")
        .attr("stroke-width", 2);

    // X-Achse erstellen
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5));

    svg.append("g")
        .call(xAxis);

    // Y-Achse erstellen
    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    svg.append("g")
        .call(yAxis);

    container.replaceChildren(svg.node());
}

const cache = new Map();

export function update_histogram(state) {
    const div = document.querySelector("#histogram");

    //console.log(t_shirt_sizes)
    const t_shirt_by_name = t_shirt_sizes.reduce((acc, t_shirt) => {
        acc[t_shirt.name] = t_shirt;
        return acc;
    }, {});

    const only_shirts_state = {}
    for (const name in state) {
        if (t_shirt_by_name[name]) {
            only_shirts_state[name] = state[name]
        }
    }
    //console.log(only_shirts_state)

    const t_shirts = []

    for (const name in state) {
        if (t_shirt_by_name[name]) {
            for (let i = 0; i < state[name]; i++) {
                t_shirts.push(t_shirt_by_name[name])
            }
        }
    }

    //console.log(cache)
    let cache_key = JSON.stringify(only_shirts_state)
    let result = []
    if (cache.has(cache_key)) {
        result = cache.get(cache_key)
        console.log('cache')
    } else {
        console.log("generating")
        result = efficient_count(t_shirts)
            .sort((a, b) => a[0] > b[0])

        result = [
            [Math.max(result[0][0] - 1, 0), 0],
            ...result,
            [result[result.length - 1][0] + 1, 0]
        ]

        cache.set(cache_key, result)
    }

    //div.innerHTML = JSON.stringify(result, null, 2)
    //console.log(result)

    update_success_probability(result)

    plot_histogram(result)


}

function update_success_probability(result) {
    let capacity = parseInt(capacity_input.value)
    let full = result
        .map((t) => t[1])
        .reduce((sum, x) => sum + x, 0)

    let reachable = result
        .filter((t) => t[0] <= capacity)
        .map((t) => t[1])
        .reduce((sum, x) => sum + x, 0)

    let success_probability = reachable / full
    success_probability_input.innerText = `${(success_probability * 100).toFixed(2)} %`
}