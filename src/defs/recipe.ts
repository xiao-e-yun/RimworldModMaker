import { BaseDefProps, DefNode, registerDef, ResearchProjectDefId, ThingDefId } from ".";
import type { RecipeDefId } from "./vanilla";
import { ContextWithoutFunctions, x, xls, xobj } from "@/utils";

export const defineRecipe = (context: ContextWithoutFunctions, props: RecipeProps): RecipeDefId => {
    const nodes = xobj({
        description: props.description,
        jobString: props.jobString,
        workAmount: props.workAmount,
        workSpeedStat: props.workSpeedStat,
        workSkill: props.workSkill,
        workSkillLearnFactor: props.workSkillLearnFactor,
        effectWorking: props.effectWorking,
        soundWorking: props.soundWorking,
        targetCountAdjustment: props.targetCountAdjustment,
        allowMixingIngredients: props.allowMixingIngredients,
    });

    // Recipe users (workbenches that can use this recipe)
    if (props.recipeUsers) {
        nodes.push(x("recipeUsers", xls(props.recipeUsers)));
    }

    // Ingredients
    if (props.ingredients) {
        nodes.push(x("ingredients", props.ingredients.map(ingredient => {
            const ingredientNodes: typeof nodes = [];
            
            // Filter
            if (ingredient.filter) {
                const filterNodes: typeof nodes = [];
                if (ingredient.filter.thingDefs) {
                    filterNodes.push(x("thingDefs", xls(ingredient.filter.thingDefs)));
                }
                if (ingredient.filter.categories) {
                    filterNodes.push(x("categories", xls(ingredient.filter.categories)));
                }
                if (ingredient.filter.allowedDefs) {
                    filterNodes.push(x("allowedDefs", xls(ingredient.filter.allowedDefs)));
                }
                if (ingredient.filter.disallowedThingDefs) {
                    filterNodes.push(x("disallowedThingDefs", xls(ingredient.filter.disallowedThingDefs)));
                }
                if (ingredient.filter.disallowedCategories) {
                    filterNodes.push(x("disallowedCategories", xls(ingredient.filter.disallowedCategories)));
                }
                ingredientNodes.push(x("filter", filterNodes));
            }
            
            ingredientNodes.push(...xobj({
                count: ingredient.count,
            }));
            
            return x("li", ingredientNodes);
        })));
    }

    // Products
    if (props.products) {
        nodes.push(x("products", xobj(props.products)));
    }

    // Special products
    if (props.specialProducts) {
        nodes.push(x("specialProducts", xls(props.specialProducts)));
    }

    // Fixed ingredient filter
    if (props.fixedIngredientFilter) {
        const filterNodes: typeof nodes = [];
        if (props.fixedIngredientFilter.thingDefs) {
            filterNodes.push(x("thingDefs", xls(props.fixedIngredientFilter.thingDefs)));
        }
        if (props.fixedIngredientFilter.categories) {
            filterNodes.push(x("categories", xls(props.fixedIngredientFilter.categories)));
        }
        if (props.fixedIngredientFilter.specialFiltersToDisallow) {
            filterNodes.push(x("specialFiltersToDisallow", xls(props.fixedIngredientFilter.specialFiltersToDisallow)));
        }
        if (props.fixedIngredientFilter.specialFiltersToAllow) {
            filterNodes.push(x("specialFiltersToAllow", xls(props.fixedIngredientFilter.specialFiltersToAllow)));
        }
        nodes.push(x("fixedIngredientFilter", filterNodes));
    }

    // Default ingredient filter
    if (props.defaultIngredientFilter) {
        const filterNodes: typeof nodes = [];
        if (props.defaultIngredientFilter.thingDefs) {
            filterNodes.push(x("thingDefs", xls(props.defaultIngredientFilter.thingDefs)));
        }
        if (props.defaultIngredientFilter.categories) {
            filterNodes.push(x("categories", xls(props.defaultIngredientFilter.categories)));
        }
        if (props.defaultIngredientFilter.disallowedThingDefs) {
            filterNodes.push(x("disallowedThingDefs", xls(props.defaultIngredientFilter.disallowedThingDefs)));
        }
        if (props.defaultIngredientFilter.disallowedCategories) {
            filterNodes.push(x("disallowedCategories", xls(props.defaultIngredientFilter.disallowedCategories)));
        }
        nodes.push(x("defaultIngredientFilter", filterNodes));
    }

    // Force hidden special filters
    if (props.forceHiddenSpecialFilters) {
        nodes.push(x("forceHiddenSpecialFilters", xls(props.forceHiddenSpecialFilters)));
    }

    // Research requirements
    if (props.researchPrerequisite) {
        nodes.push(x("researchPrerequisite", props.researchPrerequisite));
    }
    if (props.researchPrerequisites) {
        nodes.push(x("researchPrerequisites", xls(props.researchPrerequisites)));
    }

    // Skill requirements
    if (props.skillRequirements) {
        nodes.push(x("skillRequirements", props.skillRequirements.map(req =>
            x("li", [
                x("skill", req.skill),
                x("minLevel", req.minLevel),
            ])
        )));
    }

    // Unfinished thing
    if (props.unfinishedThingDef) {
        nodes.push(x("unfinishedThingDef", props.unfinishedThingDef));
    }

    // Worker classes
    if (props.workerClass) {
        nodes.push(x("workerClass", props.workerClass));
    }
    if (props.workerCounterClass) {
        nodes.push(x("workerCounterClass", props.workerCounterClass));
    }

    return registerDef(context, new DefNode("RecipeDef", {
        name: props.name,
        label: props.label,
        contents: nodes,
    }));
};

/**
 * Defines a standalone recipe for crafting at workbenches.
 * 
 * RecipeDefs are used to define crafting recipes that appear at workbenches.
 * They specify ingredients, products, work requirements, and skill needs.
 * 
 * @example
 * ```typescript
 * ctx.defineRecipe({
 *   name: "MakeSteelSword",
 *   label: "make steel sword",
 *   description: "Craft a steel sword.",
 *   jobString: "Making steel sword.",
 *   workAmount: 12000,
 *   workSpeedStat: "GeneralLaborSpeed",
 *   workSkill: "Crafting",
 *   recipeUsers: ["FueledSmithy", "ElectricSmithy"],
 *   ingredients: [{
 *     filter: { thingDefs: ["Steel"] },
 *     count: 50
 *   }],
 *   products: { "MeleeWeapon_LongSword": 1 }
 * });
 * ```
 */
export interface RecipeProps extends BaseDefProps {
    /**
     * Description of what this recipe creates or does
     */
    description?: string;

    /**
     * Text shown when a pawn is performing this recipe
     * @example "Making steel sword."
     * @example "Smelting metal from slag."
     */
    jobString?: string;

    /**
     * Amount of work required to complete this recipe
     * @example 1600
     * @example 12000
     */
    workAmount?: number;

    /**
     * Stat that affects work speed for this recipe
     * @example "GeneralLaborSpeed"
     * @example "SmeltingSpeed"
     * @example "CookSpeed"
     */
    workSpeedStat?: string;

    /**
     * Skill used for this recipe (affects quality and speed)
     * @example "Crafting"
     * @example "Cooking"
     * @example "Construction"
     */
    workSkill?: string;

    /**
     * How much skill experience is gained from this recipe
     * @default 1.0
     * @example 0 (no learning)
     * @example 0.5 (reduced learning)
     */
    workSkillLearnFactor?: number;

    /**
     * Visual effect shown while working
     * @example "Cook"
     * @example "Smelt"
     * @example "Tailor"
     * @example "Smith"
     */
    effectWorking?: string;

    /**
     * Sound played while working
     * @example "Recipe_Smith"
     * @example "Recipe_Tailor"
     * @example "Recipe_Smelt"
     */
    soundWorking?: string;

    /**
     * Adjusts target count for "do until X" bills
     * @example 20
     */
    targetCountAdjustment?: number;

    /**
     * Whether ingredients can be mixed (e.g., different materials)
     * @default false
     */
    allowMixingIngredients?: boolean;

    /**
     * List of workbench ThingDefs that can use this recipe
     * @example ["FueledSmithy", "ElectricSmithy"]
     * @example ["TableStonecutter"]
     */
    recipeUsers?: ThingDefId[];

    /**
     * Ingredients required for this recipe
     */
    ingredients?: RecipeIngredient[];

    /**
     * Products created by this recipe
     * Maps ThingDefId to count
     * @example { Steel: 15 }
     * @example { "MeleeWeapon_LongSword": 1 }
     */
    products?: Record<string, number>;

    /**
     * Special product types (for dynamic output)
     * @example ["Butchery"] - Products from butchering
     * @example ["Smelted"] - Products from smelting
     */
    specialProducts?: string[];

    /**
     * Filter that limits what ingredients can be used
     * This filter cannot be changed by the player
     */
    fixedIngredientFilter?: RecipeFilter;

    /**
     * Default filter for ingredients (can be changed by player)
     */
    defaultIngredientFilter?: RecipeFilter;

    /**
     * Special filters that should be hidden from the player
     * @example ["AllowSmeltable"]
     * @example ["AllowBurnableWeapons"]
     */
    forceHiddenSpecialFilters?: string[];

    /**
     * Research required to unlock this recipe
     */
    researchPrerequisite?: ResearchProjectDefId;

    /**
     * Multiple research prerequisites (all required)
     */
    researchPrerequisites?: ResearchProjectDefId[];

    /**
     * Skill requirements to perform this recipe
     */
    skillRequirements?: SkillRequirement[];

    /**
     * Unfinished thing created during work
     * @example "UnfinishedWeapon"
     * @example "UnfinishedApparel"
     */
    unfinishedThingDef?: ThingDefId;

    /**
     * Custom worker class for special recipe behavior
     * @example "RecipeWorker_*"
     */
    workerClass?: string;

    /**
     * Custom counter class for bill counting
     * @example "RecipeWorkerCounter_MakeStoneBlocks"
     */
    workerCounterClass?: string;
}

/**
 * Ingredient specification for recipes
 */
export interface RecipeIngredient {
    /**
     * Filter defining what items can be used as this ingredient
     */
    filter?: RecipeFilter;

    /**
     * Number of items required
     */
    count: number;
}

/**
 * Filter for ingredients in recipes
 */
export interface RecipeFilter {
    /**
     * Specific ThingDefs allowed
     */
    thingDefs?: ThingDefId[];

    /**
     * ThingCategories allowed
     */
    categories?: string[];

    /**
     * Explicitly allowed defs (whitelist)
     */
    allowedDefs?: ThingDefId[];

    /**
     * Specific ThingDefs disallowed
     */
    disallowedThingDefs?: ThingDefId[];

    /**
     * ThingCategories disallowed
     */
    disallowedCategories?: string[];

    /**
     * Special filters to disallow
     * @example ["AllowNonSmeltableWeapons"]
     */
    specialFiltersToDisallow?: string[];

    /**
     * Special filters to allow
     */
    specialFiltersToAllow?: string[];
}

/**
 * Skill requirement for performing a recipe
 */
export interface SkillRequirement {
    /**
     * Name of the skill
     * @example "Crafting"
     * @example "Cooking"
     * @example "Medicine"
     */
    skill: string;

    /**
     * Minimum skill level required
     * @example 5
     * @example 10
     */
    minLevel: number;
}
