export interface IconModalProp {
    onOk?: (iconKey: string, icon: React.ReactElement) => void
}

export interface IconModalInstanceProp {
    show: () => void;
    hide: () => void;
}