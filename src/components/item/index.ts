import {SimpleComponent} from "..";
import {x} from "../../xml";

export * from "./recipe"
export * from "./weapon"
export * from "./attack"
export * from "./abilities"


export const ItemComponent = (props: ItemProps) => new SimpleComponent("ItemComponent", {
  props: [
    x("thingClass", props.thingClass ?? "ThingWithComps"),
    x("category", "Item"),
    x("statBases", [
      x("Mass", props.mass ?? 1),
    ])
  ]
});

export interface ItemProps {
  mass?: number;
  thingClass?: string;
}
