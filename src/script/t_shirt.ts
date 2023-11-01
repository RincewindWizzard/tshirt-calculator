// @ts-ignore
import {t_shirt_sizes} from '../js/csv_import_hack.js'


export class TShirt {
    name: string
    min: number
    max: number

    constructor(name: string, min: number, max: number) {
        this.name = name
        this.min = min
        this.max = max
    }

    getId(): string {
        return this.name.toLowerCase()
    }
}

export const tShirtSizes: TShirt[] = t_shirt_sizes
    .map((x: string[]): TShirt => new TShirt(
        x[0],
        parseInt(x[1]),
        parseInt(x[2])
    ))


export const tShirtSizesById: { [key: string]: TShirt } = {}

tShirtSizes.forEach((tShirt) => {
    console.log(tShirt)
    tShirtSizesById[tShirt.getId()] = tShirt
})

