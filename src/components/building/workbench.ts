import { xls, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { RecipeDefId } from "@/defs";
import { toVec } from "@/utils";

export const WorkbenchComponent = (props: WorkbenchProps) => new SimpleComponent("WorkbenchComponent", {
    props: xobj({
        thingClass: props.thingClass ?? "Building_WorkTable",
        hasInteractionCell: props.interactionCell !== false,
        interactionCellOffset: getInteractionCellOffset(props),
        surfaceType: "Item",
        inspectorTabs: xls(["ITab_Bills"]),
        recipes: xls(props.recipes),
        building: xobj({
            isMealSource: props.isMealSource,
            heatPerTickWhileWorking: props.heatPerTickWhileWorking,
            unpoweredWorkTableWorkSpeedFactor: props.unpoweredWorkTableWorkSpeedFactor,
            spawnedConceptLearnOpportunity: props.spawnedConceptLearnOpportunity,
        }),
    }),
});

const getInteractionCellOffset = (props: WorkbenchProps) => {
    if (props.interactionCell === false) return undefined;
    const [x, z] = props.interactionCell ?? [0, -1];
    return toVec([x, 0, z]);
};

export interface WorkbenchProps {
    thingClass?: "Building_WorkTable" | "Building_WorkTable_HeatPush";
    interactionCell?: [number, number] | false;
    isMealSource?: boolean;
    heatPerTickWhileWorking?: number;
    unpoweredWorkTableWorkSpeedFactor?: number;
    spawnedConceptLearnOpportunity?: string;
    recipes?: RecipeDefId[];
}
