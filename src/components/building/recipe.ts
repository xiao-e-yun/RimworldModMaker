import { SimpleComponent } from "..";
import { x, xls, xobj } from "@/xml";
import { ResearchProjectDefId, StuffCategoryDefId, ThingDefId } from "@/defs";

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
    props: xobj({
        costList: props.costList?.map(([k, v]) => x(k.toString(), v)),
        costStuffCount: props.costStuffCount,
        stuffCategories: xls(props.stuffCategories),
        researchPrerequisite: props.researchPrerequisite,
        researchPrerequisites: xls(props.researchPrerequisites),
    }),
});

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
