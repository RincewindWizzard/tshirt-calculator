import {StageResult, State} from "./state";

export type StageResultCallback = (result: StageResult) => void

export function calculateStage(state: State, callback: StageResultCallback) {
    const stage = state.toStage()

    const interval = {
        min: stage
            .map((t_shirt) => t_shirt.min)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        max: stage
            .map((t_shirt) => t_shirt.max)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    const minCapacity = Math.floor((state.threshold / 100 * (interval.max - interval.min)) + interval.min) || 0

    callback({
        histogram: {},
        minimum: interval.min,
        maximum: interval.max,
        minCapacity: minCapacity,
        successProbability: NaN
    })
}