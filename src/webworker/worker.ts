self.onmessage = (event) => {
    const message = event.data
    if (message.type === 'request') {
        const num = message.payload
        const result = fibonacci(num)

        const response = {
            type: 'response',
            payload: {
                num: num,
                fib: result
            }
        }

        self.postMessage(response)
    }
};


function fibonacci(num: number): number {
    if (num == 0 || num == 1) {
        return 1
    }

    return fibonacci(num - 1) + fibonacci(num - 2);
}