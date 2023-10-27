import {t_shirt_sizes} from "./t_shirt_table.js"

function attach_listeners(name) {
    const input = document.getElementById(`input-${name}`);
    const dec_btn = document.getElementById(`btn-${name}-dec`);
    const inc_btn = document.getElementById(`btn-${name}-inc`);


    if (inc_btn) {
        inc_btn.addEventListener('click', () => {
            const current_value = parseInt(input.value);
            if (current_value) {
                input.value = current_value + 1
            } else {
                input.value = 1
            }
            input.dispatchEvent(new Event("input", {
                bubbles: true, cancelable: true,
            }));
        })
    }
    if (dec_btn) {
        dec_btn.addEventListener('click', () => {
            const current_value = parseInt(input.value);
            if (current_value && current_value > 0) {
                input.value = current_value - 1
            } else {
                input.value = 0
            }
            input.dispatchEvent(new Event("input", {
                bubbles: true, cancelable: true,
            }));
        })
    }
}
window.addEventListener('DOMContentLoaded', (event) => {
    for (let t_shirt of t_shirt_sizes) {
        attach_listeners(t_shirt.name)
    }
});
