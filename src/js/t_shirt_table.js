import t_shirt_size_csv from '../data/t_shirt_sizes.csv';

export const t_shirt_sizes = t_shirt_size_csv
    .map((x) => ({'name': x[0], 'min': parseInt(x[1]), 'max': parseInt(x[2])}))

