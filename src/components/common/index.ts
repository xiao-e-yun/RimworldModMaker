import { Component } from ".."
import { XmlNode } from "@/utils"

export * from "./explosive"
export * from "./graphic"
export * from "./quality"
export * from "./art"

export const ExtendsComponent = (parentDefName: string) => new class implements Component {
    id = "ExtendsComponent"
    required: string[] = []
    requiredRuntime: boolean = false
    modify = (def: XmlNode) => def.attrs.ParentName = parentDefName
}
