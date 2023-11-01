// import {calculateStage} from "./calculator"
import {NumberInputComponent} from "./ui_number_input"
import {TShirt, tShirtSizesById} from "./t_shirt"
import {calculateStage, StageResultCallback} from "./calculator";
import UiResult from './ui_result'
import query_string from 'query-string';
import {State} from "./state";


const numberInputsById: { [key: string]: NumberInputComponent } = {}

function getState(): State {
    const values: [string, number][] = Object.values(numberInputsById)
        .map((x) => [x.getId(), x.getValue()])
    return State.fromValues(values)
}

function setState(state: State) {
    for (const [key, value] of Object.entries(state.toValues())) {

        numberInputsById[key]?.setValue(value, true)
    }
}


function updateResult() {
    const state = getState()

    // update browser address bar
    history.replaceState(null, '', '?' + state.toUrlParam());

    calculateStage(state, (result) => UiResult.updateResult(state, result))
}


window.addEventListener('DOMContentLoaded', (event) => {
    const numberInputs: NumberInputComponent[] = []
    Array.from(document.querySelectorAll('div.ui-number-input'))
        .map((div) => new NumberInputComponent(div as HTMLDivElement))
        .forEach((input) => numberInputs.push(input))

    numberInputs.forEach((x) => numberInputsById[x.getId()] = x)

    // set the current state from URL params
    const location = new URL(window.location.href);
    setState(State.fromUrlParams(location.searchParams))

    updateResult()
    numberInputs.forEach((numberInput) => {
        numberInput.addInputListener((src) => {
            updateResult()
        })
    })
});