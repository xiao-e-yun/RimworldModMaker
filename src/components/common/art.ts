import { CompComponent } from "..";
import { x } from "@/utils";

/** 
 * Art Component
 * @requires QualityComponent
 */
export const ArtComponent = (
    nameMaker: string,
    descriptionMaker: string,
    minQualityForArtistic: ArtisticQuality,
) => new CompComponent("CompProperties_Art", {
    props: [
        x("nameMaker", nameMaker),
        x("descriptionMaker", descriptionMaker),
        x("minQualityForArtistic", minQualityForArtistic),
    ],
    required: ["CompQuality"],
    isExtends: true,
});

export enum ArtisticQuality {
    Awful = "Awful",
    Poor = "Poor",
    Normal = "Normal",
    Good = "Good",
    Excellent = "Excellent",
    Masterwork = "Masterwork",
    Legendary = "Legendary",
}