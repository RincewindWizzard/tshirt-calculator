import {StageResult, State} from "./state";

const minimum: HTMLParagraphElement = document.querySelector('#minimum') as HTMLParagraphElement
const maximum: HTMLParagraphElement = document.querySelector('#maximum') as HTMLParagraphElement
const minCapacity: HTMLParagraphElement = document.querySelector('#min_capacity') as HTMLParagraphElement
const successProbability: HTMLParagraphElement = document.querySelector('#success_probability') as HTMLParagraphElement


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
}


export default {
    updateResult: updateResult
}