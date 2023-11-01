import {Histogram, Stage, StageAmounts, StageResult, State} from "./state";
import {TShirt, tShirtSizesById} from "./t_shirt";

export type StageResultCallback = (result: StageResult) => void

export function calculateStage(state: State, callback: StageResultCallback) {
    const stage = state.toStage()

    const interval = {
        min: stage
            .map((x) => x[0].min * x[1])
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        max: stage
            .map((x) => x[0].max * x[1])
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    }

    const thirdQuartile = Math.floor((3 / 4 * (interval.max - interval.min)) + interval.min) || 0

    const histogram = toHistogram(naiveCombinations(stage))
    callback({
        histogram: normalizeHistogram(histogram),
        minimum: interval.min,
        maximum: interval.max,
        thirdQuartile: thirdQuartile,
        minCapacity: calculateMinimumCapacity(histogram, state.confidenceLevel / 100),
        successProbability: calculateSuccessProbability(histogram, state.capacity)
    })
}

function normalizeHistogram(histogram: Histogram): Histogram {
    const sum = histogram
        .map((point) => point[1])
        .reduce((acc, elem) => acc + elem, 0)

    return histogram.map((point) => [point[0], point[1] / sum])
}

function calculateMinimumCapacity(histogram: Histogram, confidenceLevel: number): number {
    const sum = histogram
        .map((point) => point[1])
        .reduce((acc, elem) => acc + elem, 0)


    let rollingSum = 0
    for (const [x, y] of histogram) {
        if((rollingSum + y) / sum > confidenceLevel) {
            return x
        }
        rollingSum += y
    }


    return histogram[histogram.length - 1][0]
}

function calculateSuccessProbability(histogram: Histogram, capacity: number): number {
    const underCapacity = histogram
        .filter((point) => point[0] <= capacity)
        .map((p) => p[1])
        .reduce((acc, elem) => acc + elem, 0)

    const sum = histogram
        .map((point) => point[1])
        .reduce((acc, elem) => acc + elem, 0)

    return underCapacity / sum
}

function toStage(stageAmounts: StageAmounts): TShirt[] {
    const stage: TShirt[] = []
    for (const [name, count] of Object.entries(stageAmounts)) {
        const tShirt = tShirtSizesById[name]
        for (let i = 0; i < count; i++) {
            stage.push(tShirt)
        }
    }
    return stage
}


const cache: Map<Stage, IndexedHistogram> = new Map();

function toHistogram(indexedHistogram: IndexedHistogram): Histogram {
    let result: Histogram = []
    for (const [key, value] of indexedHistogram.entries()) {
        result.push([key, value])
    }
    result = result.sort((a, b) => a[0] - b[0])

    if (result.length > 0) {
        result.unshift([result[0][0] - 1, 0])
        result.push([result[result.length - 1][0] + 1, 0])
    } else {
        result.push([0, 0])
    }
    return result
}

function pop(stage: Stage): TShirt | undefined {
    for (let i = 0; i < stage.length; i++) {
        if (stage[i][1] > 0) {
            stage[i][1]--
            return stage[i][0]
        }
    }
    return undefined
}

type IndexedHistogram = Map<number, number>

const emptyMap: IndexedHistogram = new Map()

function naiveCombinations(stage: Stage): IndexedHistogram {
    const cached = cache.get(stage)
    if (cached) {
        return cached
    }

    const tShirt = pop(stage)
    //console.log(tShirt)

    if (tShirt === undefined) {
        return emptyMap
    }

    const tail = naiveCombinations(stage)
    const head: IndexedHistogram = new Map()

    if (tail.size > 0) {
        for (const [pt, count] of tail.entries()) {
            for (let tShirtPt = tShirt.min; tShirtPt <= tShirt.max; tShirtPt++) {
                const newPt = pt + tShirtPt
                // const newCount = (head.get(newPt) || count) + 1

                head.set(newPt, (head.get(newPt) || 0) + count)
            }
        }
    } else {
        for (let tShirtPt = tShirt.min; tShirtPt <= tShirt.max; tShirtPt++) {
            head.set(tShirtPt, 1)
        }
    }


    cache.set(stage, head)

    return head
}