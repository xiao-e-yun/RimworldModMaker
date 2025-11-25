import { DefNode, EffecterDefId, ResearchProjectDefId, SoundDefId, StatDefId, StuffCategoryDefId, ThingCategoryDefId, ThingDefId, WorkTypeDefId } from "@/defs";
import { Component } from "..";
import { x, xls, xobj } from "../../xml";

export const RecipeComponent = (recipeMaker: Recipe, costs: RecipeCosts) => new class implements Component {
    id = "RecipeComponent";
    required: string[] = [];
    requiredRuntime = false;

    recipeMaker: Recipe;
    costs: RecipeCosts;
    constructor(recipeMaker: Recipe, costs: RecipeCosts) {
        this.recipeMaker = recipeMaker;
        this.costs = costs;
    }

    modify(def: DefNode) {

        const skillRequirements = this.recipeMaker.skillRequirements?.map(([k, v]) => x(k.toString(), v))

        const maker = x("recipeMaker", xobj({
            researchPrerequisite: this.recipeMaker.researchPrerequisite,
            workSpeedStat: this.recipeMaker.workSpeedStat,
            skillRequirements: skillRequirements,
            workSkill: this.recipeMaker.workSkill,
            effectWorking: this.recipeMaker.effectWorking,
            soundWorking: this.recipeMaker.soundWorking,
            recipeUsers: xls(this.recipeMaker.recipeUsers),
        }))
        def.push(maker);

        def.push(x("costList", this.costs.list?.map(([k, v]) => x(k.toString(), v))));

        if (this.costs.stuff) def.push(...xobj({
            costStuffCount: this.costs.stuff.count,
            stuffCategories: xls(this.costs.stuff.accepts)
        }))

        if (this.costs.ingredient) def.push(x("ingredients", xls(this.costs.ingredient.map(ing => xobj({
            filter: xobj({
                customSummary: ing.name,
                categories: xls(ing.accepts),
            }),
            count: ing.count,
        })))))

        def.statBases.push(x("WorkToMake", this.recipeMaker.workToMake.toString()));
    }
}(recipeMaker, costs)
 
export interface Recipe {
    /** The amount of work required to complete the recipe. */
    workToMake: number;
    /** The research prerequisite for the recipe. */
    researchPrerequisite?: ResearchProjectDefId;
    /** The work speed stat for the recipe. */
    workSpeedStat?: StatDefId;
    /** The skill requirements for the recipe. */
    skillRequirements?: [WorkTypeDefId, number][];
    /** The effect that occurs while working on the recipe. */
    effectWorking?: EffecterDefId;
    /** The sound that plays while working on the recipe. */
    soundWorking?: SoundDefId;
    /** The users of the recipe. */
    recipeUsers?: ThingDefId[];
    /** Skill required for this recipe */
    workSkill?: WorkTypeDefId;
}

export enum RecipeUser {
    TableMachining = "TableMachining",
    TableSmithing = "TableSmithing",
    TableTailoring = "TableTailoring",
    TableButchering = "TableButchering",
    StationAssembly = "StationAssembly",
    StationFabrication = "StationFabrication",
}

export interface RecipeCosts {
    list?: [ThingDefId, number][];
    stuff?: {
        accepts: StuffCategoryDefId[];
        count: number;
    };
    ingredient?: {
        name: string;
        accepts: ThingCategoryDefId[];
        count: number;
    }[]

}