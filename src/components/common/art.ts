import {getDefId, RulePackDefId} from "@/defs";
import { CompComponent } from "..";
import { x } from "@/utils";

/** 
 * Art Component
 * @requires QualityComponent
 */
export const ArtComponent = (
    nameMaker: RulePackDefId,
    descriptionMaker: RulePackDefId,
    minQualityForArtistic: ArtisticQuality,
    mustBeFullGrave: boolean = false,
    canBeEnjoyedAsArt: boolean = true,
) => new CompComponent("CompProperties_Art", {
    props: [
        x("nameMaker", getDefId(nameMaker)),
        x("descriptionMaker", getDefId(descriptionMaker)),
        x("minQualityForArtistic", minQualityForArtistic),
        x("mustBeFullGrave", mustBeFullGrave),
        x("canBeEnjoyedAsArt", canBeEnjoyedAsArt),
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
