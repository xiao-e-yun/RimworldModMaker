import { cloneDeep, merge } from "lodash-es";
import { defineDamage, defineDamageArmorCategory } from "./damage";
import { defineResearchProject, defineResearchTab } from "./research";
import { defineStat } from "./stat";
import { defineTerrainAffordance } from "./terrainAffordance";
import { defineBuilding, defineWeapon, defineApparel } from "./thing";
import { defineThingCategory } from "./thing/category";
import { defineRecipe } from "./recipe";
import { defineHediff } from "./hediff";
import { ContextWithoutFunctions, x, XmlAttrs, XmlChild, XmlNode } from "@/utils"
import { Component, registerComponents } from "@/components";
import { ModDependency } from "@/common/mod";

export * from "./thing"
export * from "./research"
export * from "./terrainAffordance"
export * from "./vanilla"
export * from "./damage"
export * from "./stat"
export * from "./recipe"
export * from "./hediff"

export const DEFS_CONTEXT_BINDINGS = { 
    registerDef, 
    defineResearchTab, 
    defineResearchProject, 
    defineTerrainAffordance, 
    defineDamage, 
    defineBuilding, 
    defineDamageArmorCategory, 
    defineWeapon, 
    defineApparel,
    defineStat, 
    defineThingCategory,
    defineRecipe,
    defineHediff,
} as const;

export class DefNode extends XmlNode {
    // basic fields
    name: string;
    label: string | false;

    components: Component[] = [];
    required = {
        runtime: false,
        mods: new Map<string, ModDependency>(),
    }

    constructor(tag: string, options: {
        name: string
        label: string | false
        attrs?: XmlAttrs
        components?: Component[]
        contents?: null | XmlChild | XmlChild[]
    }) {
        super(tag, options.attrs, options.contents);
        this.name = options.name;
        this.label = options.label;
        this.components = options.components ?? [];
    }

    override merge(rhs: DefNode) {
        super.merge(rhs);
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
        return super.stringify(pretty, indentLevel);
    }
    
    // shortcuts
    get statBases() {
        return this.getOrCreate("statBases");
    }
}

export class DefId<T extends string = string> {
    constructor(public type: T, public id: string) { }
    equals(id: DefId) { return this.type === id.type && this.id === id.id; }

    clone(): DefId<T> {
        return new DefId(this.type, this.id);
    }

    // We override toString to return the id string
    toString() {
        return this.id; 
    }

    static isDefId(obj: any): obj is DefId {
        return obj instanceof DefId;
    }
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

export interface BaseDefProps {
    name: string;
    label: string | false;
}