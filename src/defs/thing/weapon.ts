import { Component, EquippableComponent, ForbiddableComponent, StyleableComponent } from "@/components";
import { ContextWithoutFunctions, withDefaults, xobj, xstats } from "@/utils";
import { BaseDefProps, DefNode, registerDef, ThingDefProps, ThingStats } from "..";
import { AltitudeLayer, TechLevel, TickerType } from "@/common";
import { omit } from "lodash-es";

export const defineWeapon = (context: ContextWithoutFunctions, props: Partial<WeaponProps> & BaseDefProps, stats: ThingStats, components: Component[]) => {
    const $props = withDefaults(props, {
        description: props.label,
        thingClass: "ThingWithComps",
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
        allowedArchonexusCount: 1,
        //
        techLevel: TechLevel.Neolithic,
        equipmentType: "Primary",
    } as const)

    const $stats = withDefaults(stats, {
        Mass: 3.0,
    } as const)

    return registerDef(context, new DefNode("ThingDef", {
        name: props.name,
        label: props.label,
        contents: [
            ...xobj(omit($props, ["name", "label"])),
            xstats($stats),
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