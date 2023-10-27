import t_shirt_size_csv from '../data/t_shirt_sizes.csv';

export const t_shirt_sizes = t_shirt_size_csv
    .map((x) => ({'name': x[0], 'min': x[1], 'max': x[2]}))

