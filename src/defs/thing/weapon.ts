import { Component, ExtendsComponent } from "@/components";
import { ContextWithoutFunctions, x } from "@/utils";
import { BaseDefProps, includeBaseDef } from "..";
import { defineThing } from ".";

export const defineWeapon = (context: ContextWithoutFunctions, props: ThingProps, components: Component[])  => {
    return defineThing(context, [
        ...includeBaseDef(props),
        x("description", props.description),
    ], [ExtendsComponent("BaseWeapon"), ...components]);
}

export interface ThingProps extends BaseDefProps {
    description?: string;
}