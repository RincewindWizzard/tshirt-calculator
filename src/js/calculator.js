import "./t_shirt_inputs_ui"
import {t_shirt_sizes} from "./t_shirt_table.js"
import query_string from 'query-string';
import {update_histogram} from './histogram'

const default_threshold = 75

const t_shirts = t_shirt_sizes
    .map((t_shirt) => {
        let new_shirt = {
            input: document.getElementById(`input-${t_shirt.name}`),
            ...t_shirt
        }
        new_shirt.value = () => parseInt(new_shirt.input.value) || 0
        return new_shirt
    })


// capacity and threshold
const input_capacity = document.getElementById("capacity");
const input_threshold = document.getElementById("threshold");

// result displays
const output_minimum = document.getElementById("minimum");
const output_maximum = document.getElementById("maximum");
const output_min_capacity = document.getElementById("min_capacity");
const output_success_probability = document.getElementById("success_probability");

function update_results() {
    const interval = {
        min: t_shirts
            .map((t_shirt) => t_shirt.value() * t_shirt.min)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        max: t_shirts
            .map((t_shirt) => t_shirt.value() * t_shirt.max)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }
    const width = interval.max - interval.min
    const min_capacity = Math.floor((parseInt(input_threshold.value) / 100 * width) + interval.min) || 0

    output_minimum.innerHTML = interval.min;
    output_maximum.innerHTML = interval.max;

    output_min_capacity.innerHTML = min_capacity

    if (parseInt(input_capacity.value) >= min_capacity) {
        output_min_capacity.classList.add("has-text-success")
        output_min_capacity.classList.remove("has-text-danger")
    } else {
        output_min_capacity.classList.add("has-text-danger")
        output_min_capacity.classList.remove("has-text-success")
    }

    let state = get_state()
    update_histogram(state)

    history.replaceState(null, '', '?' + query_string.stringify(state));
}

function get_state() {
    const state = t_shirts.map((t_shirt) => ({
        [t_shirt.name]: t_shirt.value()
    })).reduce((acc, curr) => Object.assign(acc, curr), {});
    state.capacity = parseInt(input_capacity.value) || 0
    state.threshold = parseInt(input_threshold.value) || 0
    return state
}

function set_state(state) {
    for (let tshirt of t_shirts) {
        tshirt.input.value = state[tshirt.name] || 0
    }
    input_capacity.value = state.capacity || 0
    input_threshold.value = state.threshold || default_threshold
}

window.addEventListener('DOMContentLoaded', (event) => {
    t_shirts.forEach((t_shirt) => {
        t_shirt.input.addEventListener('input', update_results)
    })
    input_capacity.addEventListener('input', update_results)
    input_threshold.addEventListener('input', update_results)
    update_results()
});

// set the current state from URL params
const url = new URL(window.location.href);
const searchParams = url.searchParams;
set_state(Object.fromEntries(searchParams))
