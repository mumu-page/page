import { ComponentKeys } from "../stores/typings";

export interface OptionGroup {
    label: string;
    key: string;
    value: string;
    icon: string;
    children?: OptionItem[]
}

export interface OptionItem {
    label: string;
    key: string;
    value: ComponentKeys;
    icon: string;
}