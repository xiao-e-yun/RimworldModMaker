import { ContextWithoutFunctions, x, XmlNode } from "@/utils";
import { registerDef, ThingDefId } from "..";
import { Component } from "@/components";

export * from "./building"
export * from "./weapon"
export * from "./category"

export const defineThing = (context: ContextWithoutFunctions, nodes: XmlNode[], components: Component[]): ThingDefId => {
    const def = x("ThingDef", nodes);

    for (const component of components)
        component.modify(def);

    return registerDef(context, def);
}