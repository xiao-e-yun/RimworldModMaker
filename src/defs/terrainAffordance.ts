import { BaseDefProps, includeBaseDef, registerDef, TerrainAffordanceDefId } from ".";
import { ContextWithoutFunctions, toVec, x } from "@/utils"

export const defineTerrainAffordance = (context: ContextWithoutFunctions, props: TerrainAffordanceProps): TerrainAffordanceDefId => {
    return registerDef(context, x("TerrainAffordanceDef", [
        ...includeBaseDef(props),
        x("order", props.order),
        x("affordanceOverlayColor", toVec(props.affordanceOverlayColor)),
        x("visualizeOnAffordanceOverlay", props.visualizeOnAffordanceOverlay),
        x("blockAffordanceOverlay", props.blockAffordanceOverlay),
    ]));
}

export interface TerrainAffordanceProps extends BaseDefProps {
    order: number;
    affordanceOverlayColor: [number, number, number];
    visualizeOnAffordanceOverlay: boolean;
    blockAffordanceOverlay: boolean;
}