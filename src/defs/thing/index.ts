import { ContextWithoutFunctions, x, XmlNode } from "@/utils";
import { registerDef, ThingDefId } from "..";
import { Component, registerComponents } from "@/components";

export * from "./building"
export * from "./category"
export * from "./weapon"

export const defineThing = (context: ContextWithoutFunctions, nodes: XmlNode[], components: Component[]): ThingDefId => {
    const def = x("ThingDef", nodes);
    registerComponents(def, components);
    return registerDef(context, def);
}