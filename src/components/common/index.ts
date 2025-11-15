import { Component } from ".."
import { XmlNode } from "@/utils"

export * from "./graphic"
export * from "./quality"
export * from "./art"

export const ExtendsComponent = (parentDefName: string) => new class implements Component {
    id = "ExtendsComponent"
    required: string[] = []
    modify = (def: XmlNode) => def.attrs["ParentName"] = parentDefName
}