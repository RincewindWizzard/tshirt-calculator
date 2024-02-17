# T-Shirt calculator

This is a straightforward calculator designed to help you estimate the amount of work you can accomplish
within a specific timeframe.
Each work task is categorized based on its size,
often referred to as a "t-shirt size", which is determined by the following criteria:

| Name | Minimum | Maximum |
|------|---------|---------|
| 3XS  | 1 PT    | 5 PT    |
| XXS  | 6 PT    | 10 PT   |
| XS   | 11 PT   | 25 PT   |
| S    | 26 PT   | 50 PT   |
| M    | 51 PT   | 100 PT  |
| L    | 101 PT  | 200 PT  |
| XL   | 201 PT  | 400 PT  |

All values between the minimum and maximum are equally likely.

The term "Capacity" represents the total capability of all your workers.

We create a histogram of all probable outcomes.

"Min Capacity" is the minimum required capacity to archive the desired confidence level.

The "confidence level" is the percentage of the success probability that we aim to achieve, 
with a default value of 95%. 


You can see it in action at [rincewindwizzard.github.io/tshirt-calculator/](https://rincewindwizzard.github.io/tshirt-calculator/?3XS=0&L=0&M=0&S=0&XL=0&XS=0&XXS=0&capacity=0&confidenceLevel=95).