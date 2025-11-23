import { EffecterDefId, getDefId, ResearchProjectDefId, SoundDefId, StatDefId, StuffCategoryDefId, ThingCategoryDefId, ThingDefId, WorkTypeDefId } from "@/defs";
import { Component } from "..";
import { x, xls, XmlNode } from "../../xml";

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

    modify(def: XmlNode) {

        const skillRequirements = this.recipeMaker.skillRequirements && this.recipeMaker.skillRequirements.map(([k, v]) => x(getDefId(k)!, v))

        const maker = x("recipeMaker", [
            x("researchPrerequisite", getDefId(this.recipeMaker.researchPrerequisite)),
            x("workSpeedStat", getDefId(this.recipeMaker.workSpeedStat)),
            x("skillRequirements", skillRequirements),
            x("workSkill", getDefId(this.recipeMaker.workSkill)),
            x("effectWorking", getDefId(this.recipeMaker.effectWorking)),
            x("soundWorking", getDefId(this.recipeMaker.soundWorking)),
            x("recipeUsers", xls(getDefId(this.recipeMaker.recipeUsers))),
        ])
        def.push(maker);

        const costList = this.costs.list && this.costs.list.map(([k, v]) => x(getDefId(k)!, v));
        def.push(x("costList", costList));

        if (this.costs.stuff) {
            const { accepts, count } = this.costs.stuff;
            def.push(
                x("costStuffCount", count),
                x("stuffCategories", xls(getDefId(accepts)))
            )
        }

        if (this.costs.ingredient) {
            def.push(x("ingredients", xls(this.costs.ingredient.map(ing => x("li", [
                x("filter", [
                    x("customSummary", ing.name),
                    x("categories", xls(getDefId(ing.accepts))),
                ]),
                x("count", ing.count.toString()),
            ])))))
        }

        def.getOrCreate("statBases").push(x("WorkToMake", this.recipeMaker.workToMake.toString()));
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