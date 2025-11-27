import { x, xls, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { RecipeDefId } from "@/defs";

export const WorkbenchComponent = (props: WorkbenchProps) => new SimpleComponent("WorkbenchComponent", {
    props: [
        x("thingClass", props.thingClass ?? "Building_WorkTable"),
        x("hasInteractionCell", "True"),
        x("interactionCellOffset", `(${props.interactionCellOffset?.join(",") ?? "0,0,-1"})`),
        x("surfaceType", "Item"),
        x("inspectorTabs", [x("li", "ITab_Bills")]),
        x("recipes", xls(props.recipes)),
    ],
    setup: (def) => {
        const building = def.getOrCreate("building");
        building.mergeChildren(...xobj({
            isMealSource: props.isMealSource,
            heatPerTickWhileWorking: props.heatPerTickWhileWorking,
            unpoweredWorkTableWorkSpeedFactor: props.unpoweredWorkTableWorkSpeedFactor,
            spawnedConceptLearnOpportunity: props.spawnedConceptLearnOpportunity,
        }));
    }
});

export interface WorkbenchProps {
    thingClass?: "Building_WorkTable" | "Building_WorkTable_HeatPush";
    interactionCellOffset?: [number, number, number];
    isMealSource?: boolean;
    heatPerTickWhileWorking?: number;
    unpoweredWorkTableWorkSpeedFactor?: number;
    spawnedConceptLearnOpportunity?: string;
    recipes?: RecipeDefId[];
}
