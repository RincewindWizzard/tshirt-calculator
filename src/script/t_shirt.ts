// @ts-ignore
import {t_shirt_sizes} from '../js/csv_import_hack.js'


export interface TShirt {
    name: string,
    min: number,
    max: number
}

export const tShirtSizes: TShirt[] = t_shirt_sizes
    .map((x: string[]): TShirt => ({
        name: x[0],
        min: parseInt(x[1]),
        max: parseInt(x[2])
    }))


export const tShirtSizesByName: { [key: string]: TShirt } = {}

tShirtSizes.forEach((tShirt) => {
    console.log(tShirt)
    tShirtSizesByName[tShirt.name] = tShirt
})

