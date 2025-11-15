import { EffecterDefId, ResearchProjectDefId, SoundDefId, StatDefId, StuffCategoryDefId, ThingCategoryDefId, ThingDefId } from "@/defs";
import { Component } from "..";
import { x, xls, XmlNode } from "../../xml";

export const RecipeComponent = (recipeMaker: Recipe, costs: RecipeCosts) => new class implements Component {
    id = "RecipeComponent";
    required: string[] = [];
    
    recipeMaker: Recipe;
    costs: RecipeCosts;
    constructor(recipeMaker: Recipe, costs: RecipeCosts) {
        this.recipeMaker = recipeMaker;
        this.costs = costs;
    }

    modify(def: XmlNode) {

        const skillRequirements = this.recipeMaker.skillRequirements && Object.entries(this.recipeMaker.skillRequirements).map(([k, v]) => x(k, v.toString()));

        const maker = x("recipeMaker", [
            x("researchPrerequisite", this.recipeMaker.researchPrerequisite?.id),
            x("workSpeedStat", this.recipeMaker.workSpeedStat?.id),
            x("workSkill", xls(skillRequirements)),
            x("effectWorking", this.recipeMaker.effectWorking?.id),
            x("soundWorking", this.recipeMaker.soundWorking?.id),
            x("recipeUsers", xls(this.recipeMaker.recipeUsers)),
        ])


        const list = x("costList", this.costs.list && Object.entries(this.costs.list).map(([k, v]) => x(k, v.toString())));
        def.push(maker, list);

        if (this.costs.stuff) {
            def.push(
                x("costStuffCount", this.costs.stuff.count.toString()),
                x("stuffCategories", xls(this.costs.stuff.accepts?.map(cat => cat.id)))
            )
            if (this.costs.stuff.disallows || this.costs.stuff.categories)
                def.push(x("defaultIngredientFilter", [
                    x("categories", xls(this.costs.stuff.categories?.map(cat => cat.id))),
                    x("disallowedThingDefs", xls(this.costs.stuff.disallows?.map(def => def.id)))
                ]))
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
    skillRequirements?: { [skill: string]: number };
    /** The effect that occurs while working on the recipe. */
    effectWorking?: EffecterDefId;
    /** The sound that plays while working on the recipe. */
    soundWorking?: SoundDefId;
    /** The users of the recipe. */
    recipeUsers?: RecipeUser[];
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
    list?: { [resourceDefName: string]: number };
    stuff?: {
        accepts: StuffCategoryDefId[];
        count: number;

        disallows?: ThingDefId[];
        categories?: ThingCategoryDefId[];
    }

}