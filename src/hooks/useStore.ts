import { useContext } from "react";
import { Context } from "../stores/context";

export function useStore() {
    const store = useContext(Context)
    return store
}