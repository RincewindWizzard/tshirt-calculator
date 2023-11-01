import {TShirt, tShirtSizesById} from "./t_shirt";
import query_string from "query-string";

export type Histogram = [number, number][]
export interface StageResult {
    minimum: number,
    maximum: number,
    minCapacity: number,
    successProbability: number,
    histogram: Histogram
}

export type StageAmounts = { [key: string]: number }
export type Stage = [TShirt, number][]

/**
 * Immutable class representing the current state of input
 * */
export class State {
    readonly capacity: number
    readonly threshold: number
    readonly stageAmounts: StageAmounts

    constructor(values: { [key: string]: number } = {}) {
        this.stageAmounts = {}

        this.capacity = values.capacity || 0
        this.threshold = values.threshold || 0

        for (let key in values) {
            if (key in tShirtSizesById) {
                this.stageAmounts[key] = values[key] || 0
            }
        }
        this.stageAmounts = Object.freeze(this.stageAmounts)
    }

    public static fromValues(values: [string, number][]): State {
        return new State(Object.fromEntries(values))
    }

    public static fromUrlParams(urlParams: URLSearchParams): State {
        const stringValues: { [key: string]: string } = Object.fromEntries(urlParams)
        const numberValues: { [key: string]: number } = {}

        for (const key in stringValues) {
            if (stringValues.hasOwnProperty(key)) {
                numberValues[key] = parseInt(stringValues[key], 10) || 0;
            }
        }
        return new State(numberValues)
    }

    toStage(): Stage {
        return Object.entries(this.stageAmounts)
            .map((x) => [tShirtSizesById[x[0]], x[1]] as [TShirt, number])
            .sort((a, b) => a[0].min - b[0].min)
    }

    toValues(): { [key: string]: number } {
        return {
            capacity: this.capacity,
            threshold: this.threshold,
            ...this.stageAmounts
        }
    }

    toUrlParam() {
        return query_string.stringify(this.toValues())
    }
}