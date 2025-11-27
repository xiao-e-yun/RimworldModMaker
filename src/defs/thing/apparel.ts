import { Component, ForbiddableComponent, StyleableComponent } from "@/components";
import { ContextWithoutFunctions, withDefaults, xobj, xstats } from "@/utils";
import { BaseDefProps, DefNode, registerDef, ThingDefId, ThingDefProps } from "..";
import { AltitudeLayer, TechLevel, TickerType } from "@/common";
import { omit } from "lodash-es";

/**
 * Defines an apparel ThingDef.
 * 
 * Apparel includes clothing, armor, headgear, belts, and other wearable items.
 * They can provide insulation, armor protection, and stat modifications.
 * 
 * @props
 * - description
 * - thingClass
 * - category
 * - drawerType
 * - drawGUIOverlay
 * - altitudeLayer
 * - alwaysHaulable
 * - tickerType
 * - useHitPoints
 * - pathCost
 * - selectable
 * - rotatable
 * - techLevel
 * - costStuffCount
 * - stuffCategories
 * - burnableByRecipe
 * - smeltable
 * 
 * @stats
 * - Mass
 * - MaxHitPoints
 * - Flammability
 * - DeteriorationRate
 * - Beauty
 * - ArmorRating_Sharp
 * - ArmorRating_Blunt
 * - ArmorRating_Heat
 * - Insulation_Cold
 * - Insulation_Heat
 * - EquipDelay
 * 
 * @components
 * - ForbiddableComponent
 * - StyleableComponent
 * - Custom apparel components
 * 
 * @example
 * ```typescript
 * ctx.defineApparel({
 *   name: "Apparel_Duster",
 *   label: "duster",
 *   description: "A long coat for harsh weather.",
 *   techLevel: TechLevel.Industrial,
 *   costStuffCount: 80,
 *   stuffCategories: ["Fabric", "Leathery"]
 * }, {
 *   Mass: 0.6,
 *   MaxHitPoints: 120,
 *   Insulation_Cold: 16,
 *   Insulation_Heat: 12
 * }, [
 *   GraphicComponent({...}),
 *   ApparelComponent({
 *     bodyPartGroups: ["Torso", "Shoulders", "Arms", "Legs"],
 *     layers: ["OnSkin", "Middle"],
 *     wornGraphicPath: "Things/Pawn/Humanlike/Apparel/Duster/Duster"
 *   })
 * ]);
 * ```
 */
export const defineApparel = (
    context: ContextWithoutFunctions, 
    props: Partial<ApparelProps> & BaseDefProps, 
    stats: ApparelStats, 
    components: Component[]
): ThingDefId => {
    const $props = withDefaults(props, {
        description: props.label || "No description provided.",
        thingClass: "Apparel",
        category: "Item",
        drawerType: "MapMeshOnly",
        drawGUIOverlay: true,
        altitudeLayer: AltitudeLayer.Item,
        alwaysHaulable: true,
        tickerType: TickerType.Never,
        useHitPoints: true,
        pathCost: 14,
        selectable: true,
        rotatable: false,
        techLevel: TechLevel.Medieval,
        burnableByRecipe: true,
        smeltable: true,
    } as const);

    const $stats = withDefaults(stats, {
        MaxHitPoints: 100,
        Flammability: 1.0,
        DeteriorationRate: 2,
        Beauty: -3,
    } as const);

    return registerDef(context, new DefNode("ThingDef", {
        name: props.name,
        label: props.label,
        contents: [
            ...xobj(omit($props, ["name", "label"])),
            xstats($stats),
        ],
        components: [
            ForbiddableComponent(),
            StyleableComponent(),
            ...components
        ],
    }));
};

/**
 * Properties for apparel ThingDefs
 */
export interface ApparelProps extends ThingDefProps {
    /**
     * Tech level of this apparel
     * @default TechLevel.Medieval
     */
    techLevel: TechLevel;

    /**
     * Amount of stuff material required to make this
     * @example 60
     * @example 80
     */
    costStuffCount?: number;

    /**
     * Categories of stuff that can be used to make this
     * @example ["Fabric", "Leathery"]
     * @example ["Metallic"]
     */
    stuffCategories?: string[];

    /**
     * Whether this can be burned in a crematorium or campfire
     * @default true
     */
    burnableByRecipe?: boolean;

    /**
     * Whether this can be smelted for resources
     * @default true
     */
    smeltable?: boolean;

    /**
     * Whether this apparel is colorable
     * @default false (handled by CompColorable)
     */
    colorable?: boolean;

    /**
     * Tradeability setting
     * @example "Sellable"
     * @example "Buyable"
     * @example "All"
     */
    tradeability?: "None" | "Sellable" | "Buyable" | "All";

    /**
     * Trade tags for this apparel
     * @example ["Clothing"]
     * @example ["Armor"]
     */
    tradeTags?: string[];
}

/**
 * Stats for apparel ThingDefs
 */
export interface ApparelStats extends Record<string, number | null | undefined> {
    /**
     * Mass of the apparel in kg
     * @example 0.5
     * @example 2.0
     */
    Mass?: number;

    /**
     * Maximum hit points
     * @default 100
     */
    MaxHitPoints?: number;

    /**
     * Work required to make this apparel
     * @example 1800
     * @example 8000
     */
    WorkToMake?: number;

    /**
     * Sharp damage armor rating (0-2 typical range)
     * @example 0.40 (40% armor)
     * @example 0.90 (90% armor)
     */
    ArmorRating_Sharp?: number;

    /**
     * Blunt damage armor rating (0-2 typical range)
     * @example 0.20 (20% armor)
     * @example 0.80 (80% armor)
     */
    ArmorRating_Blunt?: number;

    /**
     * Heat damage armor rating (0-2 typical range)
     * @example 0.10 (10% armor)
     * @example 0.60 (60% armor)
     */
    ArmorRating_Heat?: number;

    /**
     * Cold insulation bonus (negative temperatures)
     * @example 16 (16°C insulation)
     * @example -3 (reduces insulation by 3°C)
     */
    Insulation_Cold?: number;

    /**
     * Heat insulation bonus (high temperatures)
     * @example 12 (12°C insulation)
     * @example -4 (reduces insulation by 4°C)
     */
    Insulation_Heat?: number;

    /**
     * Time in seconds to equip/unequip
     * @example 1.5
     * @example 3.0
     */
    EquipDelay?: number;

    /**
     * Additional market value
     */
    MarketValue?: number;

    /**
     * Sell price factor
     * @example 0.5
     * @example 0.7
     */
    SellPriceFactor?: number;

    /**
     * Affects pawn beauty
     */
    Beauty?: number;

    /**
     * How quickly this deteriorates
     * @default 2
     */
    DeteriorationRate?: number;

    /**
     * Flammability (0-1)
     * @default 1.0
     */
    Flammability?: number;
}
