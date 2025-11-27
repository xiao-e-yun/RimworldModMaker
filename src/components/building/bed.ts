import { x, xobj } from "@/xml";
import { SimpleComponent } from "..";

export const BedComponent = (props?: BedProps) => new SimpleComponent("BedComponent", {
    props: [
        x("thingClass", "Building_Bed"),
        x("drawGUIOverlay", "true"),
        x("defaultPlacingRot", "South"),
        x("passability", "PassThroughOnly"),
    ],
    setup: (def) => {
        // Add assignable comp
        const comps = def.getOrCreate("comps");
        comps.contents!.push(x("li", xobj({
            compClass: "CompAssignableToPawn_Bed",
        }), { Class: "CompProperties_AssignableToPawn" }));

        // Add building settings
        const building = def.getOrCreate("building");
        building.mergeChildren(...xobj({
            bed_healPerDay: props?.healPerDay,
            bed_showSleeperBody: props?.showSleeperBody,
            bed_humanlike: props?.humanlike,
            bed_maxBodySize: props?.maxBodySize,
            bed_caravansCanUse: props?.caravansCanUse,
            bed_defaultMedical: props?.defaultMedical,
        }));

        // Add buildingTags
        if (props?.isBed !== false) {
            building.mergeChildren(x("buildingTags", [x("li", "Bed")]));
        }
    }
});

export interface BedProps {
    healPerDay?: number;
    showSleeperBody?: boolean;
    humanlike?: boolean;
    maxBodySize?: number;
    caravansCanUse?: boolean;
    defaultMedical?: boolean;
    isBed?: boolean; // Add "Bed" buildingTag, default true
}
