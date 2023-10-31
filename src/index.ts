import "bulma"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import "./style/main.scss"
// import { create_description_table, t_shirt_sizes } from "./js/t_shirt_table"
// import './js/calculator'

import {NumberInputComponent} from "./script/ui_number_input"


const numberInputs: NumberInputComponent[] = Array.from(
    document.querySelectorAll('div.ui-number-input')
).map((div) => new NumberInputComponent(div as HTMLDivElement))
