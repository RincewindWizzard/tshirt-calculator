import {calculateStage} from "./calculator"
import {NumberInputComponent} from "./ui_number_input"
//import {TShirt, tShirtSizesByName} from "./t_shirt"


interface State {
    capacity: number,
    threshold: number,
    stageAmounts: { [key: string]: number }
}

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
        } /*else if (input.name in tShirtSizesByName) {
            result.stageAmounts[input.name] = input.getValue()
        }*/
    }
    return result
}




window.addEventListener('DOMContentLoaded', (event) => {
    const numberInputs: NumberInputComponent[] =
        Array.from(document.querySelectorAll('div.ui-number-input'))
            .map((div) => new NumberInputComponent(div as HTMLDivElement))

    numberInputs.forEach((numberInput) => {
        numberInput.addInputListener((src) => {
            console.log(inputsToState(numberInputs))
        })
    })
});