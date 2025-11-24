import { cloneDeep, isUndefined, merge, omitBy } from "lodash-es";
import { defineDamage, defineDamageArmorCategory } from "./damage";
import { defineResearchProject, defineResearchTab } from "./research";
import { defineStat } from "./stat";
import { defineTerrainAffordance } from "./terrainAffordance";
import { defineBuilding, defineWeapon } from "./thing";
import { ContextWithoutFunctions, x, XmlAttrs, XmlChild, XmlNode, xobj } from "@/utils"
import { Component, registerComponents } from "@/components";
import { ModDependency } from "@/common/mod";

export * from "./thing"
export * from "./research"
export * from "./terrainAffordance"
export * from "./vanilla"
export * from "./damage"
export * from "./stat"
export * from "./vanilla"

export const DEFS_CONTEXT_BINDINGS = { registerDef, defineResearchTab, defineResearchProject, defineTerrainAffordance, defineDamage, defineBuilding, defineDamageArmorCategory, defineWeapon, defineStat } as const;

export class DefNode extends XmlNode {
    // basic fields
    name: string;
    label: string | false;
    stats: Record<string, number> = {};

    components: Component[] = [];
    required = {
        runtime: false,
        mods: new Map<string, ModDependency>(),
    }

    constructor(tag: string, options: {
        name: string
        label: string | false
        stats?: Record<string, number>
        attrs?: XmlAttrs
        components?: Component[]
        contents?: null | XmlChild | XmlChild[]
    }) {
        super(tag, options.attrs, options.contents);
        this.name = options.name;
        this.label = options.label;
        this.stats = options.stats ?? {};
        this.components = options.components ?? [];
    }

    override merge(rhs: DefNode) {
        super.merge(rhs);
        this.stats = { ...this.stats, ...omitBy(rhs.stats, isUndefined) };
        this.components.push(...rhs.components);
    }

    override clone(): DefNode {
        return new DefNode(this.tag, {
            name: this.name,
            label: this.label,
            attrs: cloneDeep(this.attrs),
            contents: this.contents?.map(content => content instanceof XmlNode ? content.clone() : content)
        });
    }

    override stringify(pretty = false, indentLevel = 0): string {
        this.push(x("defName", this.name));
        if (this.label) this.push(x("label", this.label));
        this.push(x("statBases", xobj(this.stats)));
        return super.stringify(pretty, indentLevel);
    }
}

export class DefId<T extends string = string> {
    constructor(public type: T, public id: string) { }
    equals(id: DefId) { return this.type === id.type && this.id === id.id; }
}

export function createDefId<T extends string>(type: T, id: string): DefId<T> { return new DefId(type, id); };

export function registerDef<T extends string>(ctx: ContextWithoutFunctions, def: DefNode): DefId<T> {
    registerComponents(def, def.components);
    if (!ctx.defsTree[def.tag]) ctx.defsTree[def.tag] = [];
    ctx.defsTree[def.tag].push(def);
    merge(ctx.dependencies, def.required.mods);
    ctx.requiredRuntime ||= def.required.runtime;
    return createDefId(def.tag, def.name) as DefId<T>;
}

export function getDefId(def?: DefId<any>): string | undefined
export function getDefId(def?: DefId<any>[]): string[] | undefined
export function getDefId(def?: DefId<any> | DefId<any>[]): string | string[] | undefined {
    if (!def) return;
    if (Array.isArray(def)) return def.map(d => d.id);
    return def.id;
}

export interface BaseDefProps {
    name: string;
    label: string;
}