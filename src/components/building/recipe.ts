import { SimpleComponent } from "..";
import { x, xls } from "@/xml";
import { ResearchProjectDefId, StuffCategoryDefId, ThingDefId } from "@/defs";

export interface BuildingRecipeProps {
    /** Cost list of specific items required to build. e.g. [[VanillaThingDef.Steel, 50], [VanillaThingDef.ComponentIndustrial, 2]] */
    costList?: [ThingDefId, number][];
    /** Number of stuff units required to build (used with stuffCategories) */
    costStuffCount?: number;
    /** Categories of stuff that can be used to build */
    stuffCategories?: StuffCategoryDefId[];
    /** Research project required to unlock this building */
    researchPrerequisite?: ResearchProjectDefId;
    /** Research projects required to unlock this building (multiple) */
    researchPrerequisites?: ResearchProjectDefId[];
}

/**
 * Defines the construction recipe/costs for a building.
 * 
 * @example
 * ```typescript
 * ctx.defineBuilding({...}, {...}, [
 *     BuildingRecipeComponent({
 *         costStuffCount: 5,
 *         stuffCategories: [VanillaStuffCategoryDef.Metallic, VanillaStuffCategoryDef.Woody],
 *         costList: [[VanillaThingDef.ComponentIndustrial, 2]],
 *         researchPrerequisite: VanillaResearchProjectDef.Electricity,
 *     }),
 * ])
 * ```
 */
export const BuildingRecipeComponent = (props: BuildingRecipeProps) => new SimpleComponent("BuildingRecipeComponent", {
    props: [
        x("costList", props.costList?.map(([k, v]) => x(k.toString(), v))),
        x("costStuffCount", props.costStuffCount),
        x("stuffCategories", xls(props.stuffCategories)),
        x("researchPrerequisite", props.researchPrerequisite),
        x("researchPrerequisites", xls(props.researchPrerequisites)),
    ],
});
