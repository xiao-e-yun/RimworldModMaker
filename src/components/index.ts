import { $console, x, XmlChild, XmlNode } from "@/utils";
import { difference, map, uniq } from "lodash-es";

export * from "./common/"
export * from "./item/"
export * from "./hediff"

export class SimpleComponent implements Component {
    id: string;
    props: XmlNode[]
    required: string[];
    requiredRuntime = false;

    constructor(id: string, options: {
        props: XmlNode[];
        required?: string[];
        requiredRuntime?: boolean;
    }) {
        this.id = id;
        this.props = options?.props;
        this.required = options?.required ?? [];
        this.requiredRuntime = !!options?.requiredRuntime
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
    requiredRuntime = false;

    constructor(compClass: string, options?: {
        props?: XmlNode[];
        isExtends?: boolean;
        required?: string[];
        requiredRuntime?: boolean;
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
    requiredRuntime: boolean;
    modify: (def: XmlNode) => void;
}

export function registerComponents(def: XmlNode, components: Component[]) {
    const loadedComps = new Set<string>();
    const required: string[] = [];

    for (const component of components) {
        if (loadedComps.has(component.id)) {
            $console.warn(`Duplicate component registration detected.`);
            $console.warn(`  Skipping component to avoid conflicts.`);
            $console.warn(`  Definition: ${def.get("defName")?.text()}`);
            $console.warn(`  Component: ${component.id}`);
            $console.warn(`  Loaded components: ${[...loadedComps].join(", ")}`);
            continue;
        }

        component.modify(def);
        loadedComps.add(component.id);
        required.push(...component.required);
    }

    if (required.length > 0 && !requiredComponents(required, components)) {
        $console.error(`Component registration failed due to missing required components.`);
        $console.error(`  Definition: ${def.get("defName")?.text()}`);
        throw new Error("Component registration failed.");
    }
}

export function requiredComponents(requiredList: string[], components: Component[]) {
    const componentSet = map(components, 'id');
    const uniqueRequiredList = uniq(requiredList);
    const missing = difference(uniqueRequiredList, componentSet);

    if (missing.length > 0) {
        $console.error(`Required component missing: ${missing.join(", ")}`);
        $console.error(`  Make sure to include this component in the components array.`);
        $console.error(`  Provided components: ${components.map(c => c.id).join(", ")}`);
        $console.error(`  Required components: ${uniqueRequiredList.join(", ")}`);
        return false
    }
    return true
}

export const xStateBase = (props: Record<string, XmlChild | undefined>) => x("statBases", map(props, (value, key) => x(key, value)));
