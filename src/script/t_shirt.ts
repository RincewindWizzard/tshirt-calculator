// @ts-ignore
import t_shirt_size_csv from '../data/t_shirt_sizes.csv';

export interface TShirt {
    name: string,
    min: number,
    max: number
}

export const tShirtSizes = t_shirt_size_csv
    .map((x: string[]): TShirt => ({
        name: x[0],
        min: parseInt(x[1]),
        max: parseInt(x[2])
    }))


export const tShirtSizesByName: { [key: string]: TShirt } = tShirtSizes
    .reduce((result: { [key: string]: TShirt }, tShirt: TShirt) => {
        result[tShirt.name] = tShirt;
        return result;
    }, {});