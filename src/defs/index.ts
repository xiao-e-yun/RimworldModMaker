import { defineDamage, defineDamageArmorCategory } from "./damage";
import { defineResearchProject, defineResearchTab } from "./research";
import { defineStat } from "./stat";
import { defineTerrainAffordance } from "./terrainAffordance";
import { defineBuilding, defineThing, defineWeapon } from "./thing";
import { ContextWithoutFunctions, x, XmlNode } from "@/utils"

export * from "./thing"
export * from "./research"
export * from "./terrainAffordance"
export * from "./vanilla"
export * from "./damage"
export * from "./stat"
export * from "./vanilla"

export const DEFS_CONTEXT_BINDINGS = { registerDef, defineResearchTab, defineResearchProject, defineThing, defineTerrainAffordance, defineDamage, defineBuilding, defineDamageArmorCategory, defineWeapon, defineStat } as const;
export class DefId<T extends string = string> {
    constructor(public type: T, public id: string) { }
    equals(id: DefId) { return this.type === id.type && this.id === id.id; }
}

export function createDefId<T extends string>(type: T, id: string): DefId<T> { return new DefId(type, id); } ;

export interface BaseDefProps {
    name: string;
    label: string;
}

export const includeBaseDef = (options: BaseDefProps) => {
    return [
        x("defName", options.name),
        x("label", options.label),
    ]
}

export function registerDef<T extends string>(ctx: ContextWithoutFunctions, def: XmlNode): DefId<T> {
    if (!ctx.defsTree[def.tag]) ctx.defsTree[def.tag] = [];
    ctx.defsTree[def.tag].push(def);
    return createDefId(def.tag, def.get("defName")?.text() as string) as DefId<T>;
}
