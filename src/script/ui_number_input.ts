type InputListener = (src: NumberInputComponent) => void


export class NumberInputComponent {
    plusBtn: HTMLButtonElement | null
    minusBtn: HTMLButtonElement | null
    input: HTMLInputElement
    min: number | null
    max: number | null
    name: string

    constructor(container: HTMLDivElement) {
        this.plusBtn = container.querySelector('button.btn-increment')
        this.minusBtn = container.querySelector('button.btn-decrement')
        this.input = container.querySelector('input.input-number') as HTMLInputElement

        if (!this.input) {
            throw new Error("Could not initialize input element!");
        }

        this.min = this.input.min ? parseInt(this.input.min) : null
        this.max = this.input.max ? parseInt(this.input.max) : null
        this.name = this.input.name

        console.log(`${this.name}, ${this.min}, ${this.max}`)

        // add button functionality
        if (this.plusBtn) {
            this.plusBtn.addEventListener('click', () => {
                this.setValue(this.getValue() + 1)
            })
        }

        if (this.minusBtn) {
            this.minusBtn.addEventListener('click', () => {
                this.setValue(this.getValue() - 1)
            })
        }

        // check validity of input
        let lastValue = 0
        this.input.addEventListener('input', () => {
            if (this.input.value === '') {
                this.input.value = '0'
            }
            let currentValue = parseInt(this.input.value)
            if (!isNaN(currentValue)) {
                lastValue = currentValue
                this.setValue(currentValue, true)
            } else {
                this.setValue(lastValue)
            }
        })
    }

    addInputListener(listener: InputListener) {
        this.input.addEventListener('input', () => {
            listener(this)
        })
    }

    getValue(): number {
        return parseInt(this.input.value) || 0
    }

    setValue(value: number, preventInputEvent: boolean | undefined = false) {
        if (this.min != null && value < this.min) {
            value = this.min
        }
        if (this.max != null && value > this.max) {
            value = this.max
        }
        // @ts-ignore
        console.log(`${this.name}#setValue(${value})`)
        this.input.value = `${value}`
        if (!preventInputEvent) {
            this.input.dispatchEvent(new Event("input", {
                bubbles: true, cancelable: true,
            }));
        }
    }

}

