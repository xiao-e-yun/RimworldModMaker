import { CompComponent, SimpleComponent } from ".."
import { XmlNode, xobj } from "@/utils"

export * from "./explosive"
export * from "./graphic"
export * from "./quality"
export * from "./art"

export const ExtendsComponent = (parentDefName: string) => new SimpleComponent("ExtendsComponent", {
    props: [],
    setup: (def: XmlNode) => def.attrs.ParentName = parentDefName,
})

export const ForbiddableComponent = (props?: { allowNonPlayer?: boolean }) => new CompComponent("CompProperties_Forbiddable", {
  isExtends: true,
  props: xobj({
    allowNonPlayer: props?.allowNonPlayer,
  })
});