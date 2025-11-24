import { BaseDefProps, DefNode, getDefId, registerDef, ResearchProjectDefId, ResearchProjectTagDefId, ResearchTabDefId, ThingDefId } from ".";
import { TechLevel } from "../common";
import { ContextWithoutFunctions, x, xls, xobj } from "@/utils"

export const defineResearchTab = (context: ContextWithoutFunctions, props: ResearchTabProps): ResearchTabDefId => {
    return registerDef(context, new DefNode("ResearchTabDef", {
        name: props.name,
        label: props.label,
        contents: xobj({
            generalTitle: props.label, // usually same as label
            generalDescription: props.description,
        })
    }));
}

export interface ResearchTabProps extends BaseDefProps {
    description: string;
}

export const defineResearchProject = (context: ContextWithoutFunctions, props: ResearchProjectProps): ResearchProjectDefId => {

    return registerDef(context, new DefNode("ResearchProjectDef", {
        name: props.name,
        label: props.label,
        contents: xobj({
            description: props.description,
            tab: getDefId(props.tab),

            baseCost: props.baseCost,

            tags: xls(props.tags?.map(t => t.id)),

            researchViewX: props.position[0],
            researchViewY: props.position[1] * 0.7,

            prerequisites: xls(getDefId(props.prerequisites)),
            hiddenPreqrequisites: xls(getDefId(props.hiddenPreqrequisites)),

            techLevel: props.required?.techLevel ?? TechLevel.Neolithic,

            requiredAnalyzed: xls(props.required?.analyzed),
            requiredResearchBuilding: getDefId(props.required?.researchBuilding),
            requiredResearchFacilities: xls(getDefId(props.required?.researchFacilities)),
            requiresMechanitor: props.required?.mechanitor,

            techprintMarketValue: props.techprint?.marketValue,
            techprintCommonality: props.techprint?.commonality,
            techprintCount: props.techprint?.count,

            knowledgeCategory: props.knowledge?.category,
            knowledgeCost: props.knowledge?.cost,

            generalRules: props.generalRules && x("rulesStrings", xls(props.generalRules)),
        }),
    }))
}

/**
 * https://rimworldwiki.com/wiki/Modding_Tutorials/Research_Projects
 */
export interface ResearchProjectProps extends BaseDefProps {

    description: string;
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