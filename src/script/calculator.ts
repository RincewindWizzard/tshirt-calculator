import {TShirt, tShirtSizesByName} from "./t_shirt"


interface StageResult {
    minimum: number,
    maximum: number,
    minCapacity: number,
    successProbability: number,
    histogram: { [key: number]: number }
}

type StageResultCallback = (result: StageResult) => void

function amountsToStage(stageAmounts: { [key: string]: number }): TShirt[] {
    const stage: TShirt[] = []
    for (const [name, count] of Object.entries(stageAmounts)) {
        const tShirt = tShirtSizesByName[name]
        for (let i = 0; i < count; i++) {
            stage.push(tShirt)
        }
    }
    return stage
}

export function calculateStage(capacity: number, threshold: number, stageAmounts: { [key: string]: number }, callback: StageResultCallback) {
    const stage = amountsToStage(stageAmounts)

    const interval = {
        min: stage
            .map((t_shirt) => t_shirt.min)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        max: stage
            .map((t_shirt) => t_shirt.max)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    const minCapacity = Math.floor((threshold / 100 * (interval.max - interval.min)) + interval.min) || 0

    callback({
        histogram: {},
        minimum: interval.max,
        maximum: interval.min,
        minCapacity: minCapacity,
        successProbability: NaN
    })
}