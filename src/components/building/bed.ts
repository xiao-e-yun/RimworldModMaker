import { xls, xobj } from "@/xml";
import { CompComponent, SimpleComponent } from "..";

export const BedComponent = (props?: BedProps) => new SimpleComponent("BedComponent", {
    required: ["CompProperties_AssignableToPawn"],
    props: xobj({
        thingClass: "Building_Bed",
        drawGUIOverlay: true,
        defaultPlacingRot: "South",
        passability: "PassThroughOnly",
        building: xobj({
            bed_healPerDay: props?.healPerDay,
            bed_showSleeperBody: props?.showSleeperBody,
            bed_humanlike: props?.humanlike,
            bed_maxBodySize: props?.maxBodySize,
            bed_caravansCanUse: props?.caravansCanUse,
            bed_defaultMedical: props?.defaultMedical,
            buildingTags: props?.isBed !== false ? xls(["Bed"]) : undefined,
        }),
    }),
});

export const BedAssignableComponent = () => new CompComponent("CompProperties_AssignableToPawn", {
    isExtends: true,
    props: xobj({
        compClass: "CompAssignableToPawn_Bed",
    }),
});

export interface BedProps {
    healPerDay?: number;
    showSleeperBody?: boolean;
    humanlike?: boolean;
    maxBodySize?: number;
    caravansCanUse?: boolean;
    defaultMedical?: boolean;
    isBed?: boolean;
}
