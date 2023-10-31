// import {calculateStage} from "./calculator"
import {NumberInputComponent} from "./ui_number_input"
import {TShirt, tShirtSizesByName} from "./t_shirt"
import {calculateStage, StageResult, StageResultCallback} from "./calculator";
import {updateResult} from './ui_result'

export interface State {
    capacity: number,
    threshold: number,
    stageAmounts: { [key: string]: number }
}

const numberInputs: NumberInputComponent[] = []

function inputsToState(inputs: NumberInputComponent[]): State {
    const result: State = {
        capacity: 0,
        threshold: 0,
        stageAmounts: {},
    }
    for (let input of inputs) {
        if (input.name === "Capacity") {
            result.capacity = input.getValue()
        } else if (input.name === "Threshold") {
            result.threshold = input.getValue()
        } else if (input.name in tShirtSizesByName) {
            result.stageAmounts[input.name] = input.getValue()
        }
    }
    return result
}


function update() {
    const state = inputsToState(numberInputs)

    calculateStage(
        state.capacity,
        state.threshold,
        state.stageAmounts,
        (result) => updateResult(state, result)
    )
}

window.addEventListener('DOMContentLoaded', (event) => {
    Array.from(document.querySelectorAll('div.ui-number-input'))
        .map((div) => new NumberInputComponent(div as HTMLDivElement))
        .forEach((input) => numberInputs.push(input))

    update()
    numberInputs.forEach((numberInput) => {
        numberInput.addInputListener((src) => {
            update()
        })
    })
});