import { BaseDefProps, DefNode, registerDef, ResearchProjectDefId, ThingDefId } from ".";
import type { RecipeDefId, SkillDefId, ThingCategoryDefId, StatDefId, EffecterDefId, SoundDefId } from "./vanilla";
import { ContextWithoutFunctions } from "@/utils";
import { x, xls, xobj } from "@/xml";

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
        recipeUsers: xls(props.recipeUsers),
    });

    // Ingredients
    nodes.push(x("ingredients", xls(props.ingredients?.map(ingredient => {
        const ingredientNodes = xobj({
            count: ingredient.count,
            filter: xobj({
                thingDefs: xls(ingredient.filter?.thingDefs),
                categories: xls(ingredient.filter?.categories),
                allowedDefs: xls(ingredient.filter?.allowedDefs),
                disallowedThingDefs: xls(ingredient.filter?.disallowedThingDefs),
                disallowedCategories: xls(ingredient.filter?.disallowedCategories),
            }),
        });
        return ingredientNodes;
    }))));

    // Products
    nodes.push(x("products", xobj(props.products)));

    // Special products
    nodes.push(x("specialProducts", xls(props.specialProducts)));

    // Fixed ingredient filter
    nodes.push(x("fixedIngredientFilter", xobj({
        thingDefs: xls(props.fixedIngredientFilter?.thingDefs),
        categories: xls(props.fixedIngredientFilter?.categories),
        specialFiltersToDisallow: xls(props.fixedIngredientFilter?.specialFiltersToDisallow),
        specialFiltersToAllow: xls(props.fixedIngredientFilter?.specialFiltersToAllow),
    })));

    // Default ingredient filter
    nodes.push(x("defaultIngredientFilter", xobj({
        thingDefs: xls(props.defaultIngredientFilter?.thingDefs),
        categories: xls(props.defaultIngredientFilter?.categories),
        disallowedThingDefs: xls(props.defaultIngredientFilter?.disallowedThingDefs),
        disallowedCategories: xls(props.defaultIngredientFilter?.disallowedCategories),
    })));

    // Force hidden special filters
    nodes.push(x("forceHiddenSpecialFilters", xls(props.forceHiddenSpecialFilters)));

    // Research requirements
    nodes.push(x("researchPrerequisites", xls(props.researchPrerequisites)));

    // Skill requirements
    nodes.push(x("skillRequirements", props.skillRequirements?.map(req => 
        x(req.skill.id, req.minLevel.toString())
    )));

    // Unfinished thing
    nodes.push(x("unfinishedThingDef", props.unfinishedThingDef));

    // Worker classes
    nodes.push(x("workerClass", props.workerClass));
    nodes.push(x("workerCounterClass", props.workerCounterClass));

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
    workSpeedStat?: StatDefId;

    /**
     * Skill used for this recipe (affects quality and speed)
     * @example "Crafting"
     * @example "Cooking"
     * @example "Construction"
     */
    workSkill?: SkillDefId;

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
    effectWorking?: EffecterDefId;

    /**
     * Sound played while working
     * @example "Recipe_Smith"
     * @example "Recipe_Tailor"
     * @example "Recipe_Smelt"
     */
    soundWorking?: SoundDefId;

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
    categories?: ThingCategoryDefId[];

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
    skill: SkillDefId;

    /**
     * Minimum skill level required
     * @example 5
     * @example 10
     */
    minLevel: number;
}
