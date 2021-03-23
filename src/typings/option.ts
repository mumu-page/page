import { IComponentKeys } from "../stores/typings";

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
    value: IComponentKeys;
    icon: string;
}