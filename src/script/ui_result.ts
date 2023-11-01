import * as d3 from 'd3';
import { format } from 'd3';
import {Histogram, StageResult, State} from "./state";

const minimum: HTMLParagraphElement = document.querySelector('#minimum') as HTMLParagraphElement
const maximum: HTMLParagraphElement = document.querySelector('#maximum') as HTMLParagraphElement
const minCapacity: HTMLParagraphElement = document.querySelector('#min_capacity') as HTMLParagraphElement
const successProbability: HTMLParagraphElement = document.querySelector('#success_probability') as HTMLParagraphElement
const histogramDiv: HTMLDivElement = document.getElementById("histogram") as HTMLDivElement




function updateResult(state: State, result: StageResult) {
    console.log(result)
    minimum.innerHTML = `${result.minimum}`
    maximum.innerHTML = `${result.maximum}`
    minCapacity.innerHTML = `${result.minCapacity}`
    successProbability.innerHTML = `${result.successProbability}`


    if (result.minCapacity < state.capacity) {
        minCapacity.classList.add("has-text-success")
        minCapacity.classList.remove("has-text-danger")
    } else {
        minCapacity.classList.add("has-text-danger")
        minCapacity.classList.remove("has-text-success")
    }

    plotHistogram(result.histogram, state.capacity)
}



function plotHistogram(data: Histogram, capacity: number | null = null) {
    const width = histogramDiv.clientWidth
    const height = histogramDiv.clientHeight
    const margin = {top: 20, right: 20, bottom: 30, left: 40};

    const defaultMaxX = 10;
    const xScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d[0]) || defaultMaxX])
        .range([margin.left, width - margin.right]);

    const defaultMaxY = 10;
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1]) || defaultMaxY])
        .nice()
        .range([height - margin.bottom, margin.top]);


    const line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .curve(d3.curveStep)


    const svg = d3.create("svg")
        .attr("width", width) // Breite des SVG-Containers
        .attr("height", height); // Höhe des SVG-Containers


    svg.append("path")
        .datum(data)
        .attr("d", line)
        .style("fill", "lightsteelblue")
        .attr("stroke", "lightsteelblue")
        .attr("stroke-width", 2);

    const xAxis = (g: any) => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5));

    svg.append("g")
        .call(xAxis);

    const yAxis = (g: any) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))

    svg.append("g")
        .call(yAxis);

    const node = svg.node()
    if (node) {
        histogramDiv.replaceChildren(node);
    }
}


export default {
    updateResult: updateResult
}