import type { InputChangeEvent } from "./OpenPGPForm"

export type InputProps = {
    id: string
    label: string
    min?: string
    max?: string
    // eslint-disable-next-line no-unused-vars
    onInputChange: (e: InputChangeEvent) => void
    placeholder?: string
    value: string
    type?: string
}

export default function Input(props: InputProps) {
    return (
        <div class="flex flex-col space-y-1">
            <label class="block" html-for={props.id}>
                {props.label}
            </label>
            <input
                class="rounded px-1.5 py-2 text-black"
                min={props.min}
                max={props.max}
                type={props.type}
                name={props.id}
                id={props.id}
                placeholder={props.placeholder}
                value={props.value}
                onInput={(e) => props.onInputChange(e)}
                required
            />
        </div>
    );
}
