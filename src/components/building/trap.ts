import { x, xobj } from "@/xml";
import { CompComponent, SimpleComponent } from "..";
import { DamageArmorCategoryDefId, DamageDefId } from "@/defs";

export const TrapComponent = (props: TrapProps) => new SimpleComponent("TrapComponent", {
    props: [
        x("thingClass", props.type === "explosive" ? "Building_TrapExplosive" : "Building_TrapDamager"),
        x("rotatable", "false"),
        x("tickerType", "Normal"),
        x("stealable", "false"),
        x("placeWorkers", [x("li", "PlaceWorker_NeverAdjacentTrap")]),
    ],
    setup: (def) => {
        const building = def.getOrCreate("building");
        building.mergeChildren(...xobj({
            isTrap: true,
            trapDestroyOnSpring: props.destroyOnSpring,
            trapDamageCategory: props.damageCategory,
            trapPeacefulWildAnimalsSpringChanceFactor: props.peacefulWildAnimalsSpringChanceFactor,
        }));

        // For spike traps, add trap stats
        if (props.type === "spike") {
            if (props.meleeDamage) def.statBases.mergeChildren(x("TrapMeleeDamage", props.meleeDamage.toString()));
            if (props.springChance) def.statBases.mergeChildren(x("TrapSpringChance", props.springChance.toString()));
        }
    }
});

export interface TrapProps {
    type: "spike" | "explosive";
    destroyOnSpring?: boolean;
    damageCategory?: DamageArmorCategoryDefId;
    peacefulWildAnimalsSpringChanceFactor?: number;
    // Spike trap specific
    meleeDamage?: number;
    springChance?: number;
}

// Explosive Component (for IED traps and destructible items)
export const ExplosiveBuildingComponent = (props: ExplosiveBuildingProps) => new CompComponent("CompProperties_Explosive", {
    isExtends: true,
    props: xobj({
        explosiveRadius: props.radius,
        explosiveDamageType: props.damageType,
        startWickHitPointsPercent: props.startWickHitPointsPercent,
        wickTicks: props.wickTicks ? `${props.wickTicks[0]}~${props.wickTicks[1]}` : undefined,
        startWickOnDamageTaken: props.startWickOnDamageTaken,
        chanceNeverExplodeFromDamage: props.chanceNeverExplodeFromDamage,
    }),
});

export interface ExplosiveBuildingProps {
    radius: number;
    damageType: DamageDefId;
    startWickHitPointsPercent?: number;
    wickTicks?: [number, number];
    startWickOnDamageTaken?: DamageDefId;
    chanceNeverExplodeFromDamage?: number;
}
