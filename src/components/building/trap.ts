import { x, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { DamageArmorCategoryDefId } from "@/defs";

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