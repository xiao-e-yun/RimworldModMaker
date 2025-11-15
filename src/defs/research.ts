import { BaseDefProps, includeBaseDef, registerDef, ResearchProjectDefId, ResearchProjectTagDefId, ResearchTabDefId, ThingDefId } from ".";
import { TechLevel } from "../common";
import { ContextWithoutFunctions, x, xls } from "@/utils"

export const defineResearchTab = (context: ContextWithoutFunctions, props: ResearchTabProps): ResearchTabDefId => {
    return registerDef(context, x("ResearchTabDef", [
        ...includeBaseDef(props),
        x("generalTitle", props.label), // usually same as label
        x("generalDescription", props.description),
    ]));
}

export interface ResearchTabProps extends BaseDefProps {
    description: string;
}

export const defineResearchProject = (context: ContextWithoutFunctions, props: ResearchProjectProps): ResearchProjectDefId => {
    return registerDef(context, x("ResearchProjectDef", [
        ...includeBaseDef(props),

        x("tab", props.tab?.id),

        x("baseCost", props.baseCost),

        x("tags", xls(props.tags?.map(t => t.id))),

        x("researchViewX", props.position[0]),
        x("researchViewY", props.position[1] * 0.7),

        x("prerequisites", xls(props.prerequisites?.map(pr => pr.id))),
        x("hiddenPreqrequisites", xls(props.hiddenPreqrequisites?.map(pr => pr.id))),

        x("techLevel", props.required?.techLevel ?? TechLevel.Neolithic),
        x("requiredAnalyzed", xls(props.required?.analyzed)),
        x("requiredResearchBuilding", props.required?.researchBuilding?.id),
        x("requiredResearchFacilities", xls(props.required?.researchFacilities?.map(rf => rf.id))),
        x("requiresMechanitor", props.required?.mechanitor),

        x("techprintMarketValue", props.techprint?.marketValue),
        x("techprintCommonality", props.techprint?.commonality),
        x("techprintCount", props.techprint?.count),

        x("knowledgeCategory", props.knowledge?.category),
        x("knowledgeCost", props.knowledge?.cost),

        x("generalRules", props.generalRules && x("rulesStrings", xls(props.generalRules))),
    ]));
}

/**
 * https://rimworldwiki.com/wiki/Modding_Tutorials/Research_Projects
 */
export interface ResearchProjectProps extends BaseDefProps {

    /**
     * @example ["ClassicStart", "TribalStart"]
     */
    tags?: ResearchProjectTagDefId[];

    tab?: ResearchTabDefId;

    /**
     * The base cost of the research project.
     */
    baseCost: number;

    /**
     * The position of the research project in the research tree.
     */
    position: [number, number];

    /**
     * The research prerequisites for this project.
     */
    prerequisites?: ResearchProjectDefId[];
    /**
     * The hidden research prerequisites for this project.
     */
    hiddenPreqrequisites?: ResearchProjectDefId[];
    required?: Partial<{
        analyzed: string[];
        /**
         * @example "HiTechResearchBench"
         */
        researchBuilding: ThingDefId
        /**
         * @example ["MultiAnalyzer"]
         */
        researchFacilities: ThingDefId[];
        /**
         * 
         * @requires Mechanitor
         */
        mechanitor: boolean;

        techLevel: TechLevel;
    }>

    discoveredLetter?: {
        title: string;
        text: string;
    }

    generalRules?: string[];

    /**
     * @requires Techprints
     */
    techprint?: {
        marketValue: number;
        commonality: number;
        count: number;
    }

    /**
     * @requires Anomaly
     */
    knowledge?: {
        category: "Basic" | "Advanced"
        cost: number;
    }
}