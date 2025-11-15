import { BaseDefProps, includeBaseDef, registerDef, ThingCategoryDefId } from "..";
import { ContextWithoutFunctions, x } from "@/utils"


export const defineThingCategory = (context: ContextWithoutFunctions, props: ThingCategoryProps): ThingCategoryDefId => {
    return registerDef(context, x("ThingCategoryDef", [
        ...includeBaseDef(props),
        x("parent", props.parent),
        x("iconPath", props.iconPath),
        x("resourceReadoutRoot", props.resourceReadoutRoot),
    ]));
}

export interface ThingCategoryProps extends BaseDefProps {
    description?: string; 
    parent?: string;
    resourceReadoutRoot?: boolean;
    iconPath?: string;
}