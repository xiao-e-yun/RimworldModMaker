import { x, xls, XmlChild, XmlNode } from "@/utils";
import { map } from "lodash-es";

export * from "./common/"
export * from "./item/"
export * from "./hediff"

export class SimpleComponent implements Component {
    id: string;
    props: XmlNode[]
    required: string[];

    constructor(id: string, props: XmlNode[], required: string[]) {
        this.id = id;
        this.props = props;
        this.required = required;
    };

    modify(def: XmlNode) {
        def.mergeChildren(...this.props);
    }
}

export class CompComponent implements Component {
    id: string;
    props: XmlNode[]
    required: string[];
    isExtends: boolean;

    constructor(compClass: string, options?: {
        props?: XmlNode[];
        isExtends?: boolean;
        required?: string[];
    }) {
        this.id = compClass
        this.props = options?.props ?? [];
        this.isExtends = !!options?.isExtends
        this.required = options?.required ?? [];
    };

    modify(def: XmlNode) {
        const comps = def.getOrCreate("comps").contents!;

        if (this.isExtends) comps.push(x("li", this.props, { Class: this.id }))
        else comps.push(x("li", [x("compClass", this.id), ...this.props]))
    }
}

export interface Component {
    id: string;
    required: string[];
    modify: (def: XmlNode) => void;
}

export function registerComponents(def: XmlNode, components: Component[]) {
    const loadedComps = new Set<string>();
    const required: string[] = [];

    for (const component of components) {
        if (loadedComps.has(component.id)) {
            console.warn(`Duplicate component registration detected.`);
            console.warn(`  Skipping component to avoid conflicts.`);
            console.warn(`  Definition: ${def.get("defName")?.text()}`);
            console.warn(`  Component: ${component.id}`);
            console.warn(`  Loaded components: ${[...loadedComps].join(", ")}`);
            continue;
        }

        component.modify(def);
        loadedComps.add(component.id);
        required.push(...component.required);
    }

    if (required.length > 0) requiredComponents(required, components);
}

export function requiredComponents(required: string[], components: Component[]) {
    const requiredSet = new Set(required);
    for (const component of components) {
        if (requiredSet.has(component.id)) continue
        console.warn(`Required component missing: ${component.id}`);
        console.warn(`  Make sure to include this component in the components array.`);
        console.warn(`  Provided components: ${components.map(c => c.id).join(", ")}`);
        console.warn(`  Required components: ${[...requiredSet].join(", ")}`);
        throw new Error(`Missing required component: ${component.id}`);
    }
}

export const xStateBase = (props: Record<string, XmlChild | undefined>) => x("statBases", xls(map(props, (value, key) => x(key, value))));