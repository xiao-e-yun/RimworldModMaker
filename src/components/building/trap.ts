import { xls, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { DamageArmorCategoryDefId } from "@/defs";

export const TrapComponent = (props: TrapProps) => new SimpleComponent("TrapComponent", {
    props: xobj({
        thingClass: props.type === "explosive" ? "Building_TrapExplosive" : "Building_TrapDamager",
        rotatable: false,
        tickerType: "Normal",
        stealable: false,
        placeWorkers: xls(["PlaceWorker_NeverAdjacentTrap"]),
        statBases: props.type === "spike" ? xobj({
            TrapMeleeDamage: props.meleeDamage,
            TrapSpringChance: props.springChance,
        }) : undefined,
        building: xobj({
            isTrap: true,
            trapDestroyOnSpring: props.destroyOnSpring,
            trapDamageCategory: props.damageCategory,
            trapPeacefulWildAnimalsSpringChanceFactor: props.peacefulWildAnimalsSpringChanceFactor,
        }),
    }),
});

export interface TrapProps {
    type: "spike" | "explosive";
    destroyOnSpring?: boolean;
    damageCategory?: DamageArmorCategoryDefId;
    peacefulWildAnimalsSpringChanceFactor?: number;
    /** Spike trap specific - melee damage amount */
    meleeDamage?: number;
    /** Spike trap specific - spring chance */
    springChance?: number;
}