import { Component, EquippableComponent, ForbiddableComponent, StyleableComponent } from "@/components";
import { ContextWithoutFunctions, withDefaults, xobj, xstats } from "@/utils";
import { BaseDefProps, DefNode, registerDef, ThingDefProps } from "..";
import { AltitudeLayer, DrawerType, TechLevel, TickerType } from "@/common";

/**
 * Defines a weapon ThingDef.
 * 
 * @props
 * description
 * thingClass
 * category
 * drawerType
 * drawGUIOverlay
 * altitudeLayer
 * alwaysHaulable
 * tickerType
 * useHitPoints
 * pathCost
 * selectable
 * rotatable
 * allowedArchonexusCount
 * techLevel
 * equipmentType
 * 
 * @stats
 * - Mass
 * - Beauty
 * - Flammability
 * - SellPriceFactor
 * - DeteriorationRate
 * 
 * @components
 * - EquippableComponent
 * - ForbiddableComponent
 * - StyleableComponent
 */
export const defineWeapon = (context: ContextWithoutFunctions, options: Partial<WeaponProps> & BaseDefProps, components: Component[]) => {
    const {
        stats: $stats,
        ...props
    } = withDefaults(options, {
        description: options.label || "No description provided.",
        thingClass: "ThingWithComps",
        category: "Item",
        drawerType: DrawerType.MapMeshOnly,
        drawGUIOverlay: true,
        altitudeLayer: AltitudeLayer.Item,
        alwaysHaulable: true,
        tickerType: TickerType.Never,
        useHitPoints: true,
        pathCost: 14,
        selectable: true,
        rotatable: false,
        allowedArchonexusCount: 1,
        //
        techLevel: TechLevel.Neolithic,
        equipmentType: "Primary",
    } as const)

    const stats = withDefaults($stats, {
        Mass: 3.0,
        Beauty: -3,
        Flammability: 0.8,
        SellPriceFactor: 0.5,
        DeteriorationRate: 2.0,
    } as const)

    return registerDef(context, new DefNode("ThingDef", {
        name: options.name,
        label: options.label,
        contents: [
            ...xobj(props),
            xstats(stats),
        ],
        components: [
            ForbiddableComponent(),
            EquippableComponent(),
            StyleableComponent(),
            ...components
        ],
    }));
}

export interface WeaponProps extends ThingDefProps {
    techLevel: TechLevel;
    equipmentType: "Primary";
}