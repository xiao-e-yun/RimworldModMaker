import { BaseDefProps, DefNode, registerDef, ThingCategoryDefId } from "..";
import { ContextWithoutFunctions, xobj } from "@/utils"


export const defineThingCategory = (context: ContextWithoutFunctions, props: ThingCategoryProps): ThingCategoryDefId => {
    return registerDef(context, new DefNode("ThingCategoryDef", {
        name: props.name,
        label: props.label,
        contents: xobj({
            parent: props.parent,
            iconPath: props.iconPath,
            resourceReadoutRoot: props.resourceReadoutRoot,
        })
    }));
}

export interface ThingCategoryProps extends BaseDefProps {
    description?: string;
    parent?: string;
    resourceReadoutRoot?: boolean;
    iconPath?: string;
}