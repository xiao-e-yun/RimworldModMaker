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

export interface BedProps {
    healPerDay?: number;
    showSleeperBody?: boolean;
    humanlike?: boolean;
    maxBodySize?: number;
    caravansCanUse?: boolean;
    defaultMedical?: boolean;
    isBed?: boolean;
}

export const AssignableComponent = (props: AssignableProps = {}) => new CompComponent("CompProperties_AssignableToPawn", {
    isExtends: true,
    props: xobj({
        compClass: props.compClass ?? "CompAssignableToPawn_Bed",
        maxAssignedPawnsCount: props.maxAssignedPawnsCount,
        drawAssignmentOverlay: props.drawAssignmentOverlay,
        drawUnownedAssignmentOverlay: props.drawUnownedAssignmentOverlay,
        noAssignablePawnsDesc: props.noAssignablePawnsDesc,
    }),
});

export interface AssignableProps {
    /** The comp class to use. 
     * @default "CompAssignableToPawn_Bed" 
     */
    compClass?: "CompAssignableToPawn_Bed" | "CompAssignableToPawn_Grave" | "CompAssignableToPawn_Throne" | "CompAssignableToPawn_MeditationSpot";
    /** Maximum number of pawns that can be assigned. For beds, this is auto-calculated from bed size. */
    maxAssignedPawnsCount?: number;
    /** Whether to draw the assignment overlay. 
     * @default true 
     */
    drawAssignmentOverlay?: boolean;
    /** Whether to draw unowned assignment overlay. 
     * @default true 
     */
    drawUnownedAssignmentOverlay?: boolean;
    /** Description shown when no pawns can be assigned. */
    noAssignablePawnsDesc?: string;
}