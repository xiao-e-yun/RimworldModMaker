import { BaseDefProps, DefNode, registerDef, TerrainAffordanceDefId } from ".";
import { ContextWithoutFunctions, toVec, xobj } from "@/utils"

export const defineTerrainAffordance = (context: ContextWithoutFunctions, props: TerrainAffordanceProps): TerrainAffordanceDefId => {
    return registerDef(context, new DefNode("TerrainAffordanceDef", {
        name: props.name,
        label: props.label,
        contents: xobj({
            order: props.order,
            affordanceOverlayColor: toVec(props.affordanceOverlayColor),
            visualizeOnAffordanceOverlay: props.visualizeOnAffordanceOverlay,
            blockAffordanceOverlay: props.blockAffordanceOverlay,
        })
    }));
}

export interface TerrainAffordanceProps extends BaseDefProps {
    order: number;
    affordanceOverlayColor: [number, number, number];
    visualizeOnAffordanceOverlay: boolean;
    blockAffordanceOverlay: boolean;
}