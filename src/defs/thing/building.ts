import { ContextWithoutFunctions } from "@/utils";
import { Component } from "@/components";
import { BaseDefProps, includeBaseDef } from "..";
import { defineThing } from ".";

export const defineBuilding = (context: ContextWithoutFunctions, props: BuildingProps, components: Component[]) => {
    defineThing(context, [
        ...includeBaseDef(props),
    ], components);
}

export interface BuildingProps extends BaseDefProps {
    description?: string;
}