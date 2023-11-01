import * as d3 from 'd3';
import {format} from 'd3';
import {Histogram, StageResult, State} from "./state";

const minimum: HTMLParagraphElement = document.querySelector('#minimum') as HTMLParagraphElement
const maximum: HTMLParagraphElement = document.querySelector('#maximum') as HTMLParagraphElement
const thirdQuartile: HTMLParagraphElement = document.querySelector('#third_quartile') as HTMLParagraphElement
const minCapacity: HTMLParagraphElement = document.querySelector('#min_capacity') as HTMLParagraphElement
const successProbability: HTMLParagraphElement = document.querySelector('#success_probability') as HTMLParagraphElement
const histogramDiv: HTMLDivElement = document.getElementById("histogram") as HTMLDivElement


function updateResult(state: State, result: StageResult) {
    console.log(result)
    minimum.innerHTML = `${result.minimum}`
    maximum.innerHTML = `${result.maximum}`
    thirdQuartile.innerHTML = `${result.thirdQuartile}`
    minCapacity.innerHTML = `${result.minCapacity}`
    successProbability.innerHTML = `${(result.successProbability * 100).toFixed(2)} %`


    if (result.minCapacity <= state.capacity) {
        minCapacity.classList.add("has-text-success")
        minCapacity.classList.remove("has-text-danger")
    } else {
        minCapacity.classList.add("has-text-danger")
        minCapacity.classList.remove("has-text-success")
    }

    if (result.thirdQuartile <= state.capacity) {
        thirdQuartile.classList.add("has-text-success")
        thirdQuartile.classList.remove("has-text-danger")
    } else {
        thirdQuartile.classList.add("has-text-danger")
        thirdQuartile.classList.remove("has-text-success")
    }

    plotHistogram(result.histogram, state.capacity)
}


function plotHistogram(data: Histogram, capacity: number | null = null) {

    const width = histogramDiv.clientWidth
    const height = histogramDiv.clientHeight
    const margin = {top: 20, right: 20, bottom: 30, left: 60};

    const dataBelowCapacity: [number, number][] = data.filter(point => (!capacity) || point[0] <= capacity)
    const dataAboveCapacity: [number, number][] = data.filter(point => (!!capacity) && point[0] > capacity)


    if (dataBelowCapacity.length > 1) {
        dataBelowCapacity.push([dataBelowCapacity[dataBelowCapacity.length - 1][0] + 1, 0])
    }
    if (dataAboveCapacity.length > 0) {
        dataAboveCapacity.unshift([dataAboveCapacity[0][0] - 1, 0])
    }

    const defaultMaxX = 10;
    const xScale = d3.scaleLinear()
        .domain([
            d3.min(data, (d : [number, number]) => d[0]) || 0,
            d3.max(data, (d : [number, number]) => d[0]) || defaultMaxX])
        .range([margin.left, width - margin.right]);

    const defaultMaxY = 10;
    const maxY = d3.max(data, (d : [number, number]) => d[1]) || defaultMaxY
    const yScale = d3.scaleLinear()
        .domain([0, maxY])
        .range([height - margin.bottom, margin.top]);


    const line = d3.line()
        .x((d : [number, number]) => xScale(d[0]))
        .y((d : [number, number]) => yScale(d[1]))
        .curve(d3.curveStep)


    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)


    svg.append("path")
        .datum(dataBelowCapacity)
        .attr("d", line)
        .style("fill", "#48c78e")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    svg.append("path")
        .datum(dataAboveCapacity)
        .attr("d", line)
        .style("fill", "#f14668")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    const xAxis = (g: any) => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5));

    svg.append("g")
        .call(xAxis);

    const yAxis = (g: any) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale)
            .tickFormat((value : d3.NumberValue): string => {
                if (maxY !== 0) {
                    return `${(value as number / maxY * 100).toFixed(0)} %μ`;
                } else {
                    return "";
                }
            })
            .tickValues([0, 25, 50, 75, 100].map(x => x / 100 * maxY)));

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