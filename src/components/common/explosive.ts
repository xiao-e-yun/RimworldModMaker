import { xobj } from "@/xml";
import { CompComponent } from "..";
import { DamageDefId } from "@/defs";
import { TickerType } from "@/common";
import { castArray } from "lodash-es";

/**
 * Makes the item explosiveable.
 */
export const ExplosiveComponent = (props: ExplosiveProps = {}) => new CompComponent("CompProperties_Explosive", {
    isExtends: true,
    props: xobj({
        explosiveRadius: props.range,
        explosiveDamageType: props.damageType,
        requiredDamageTypeToExplode: props.requiredDamageTypeToExplode,
        damageAmountBase: props.damageAmountBase,
        applyDamageToExplosionCellsNeighbors: props.applyDamageToExplosionCellsNeighbors,

        chanceToStartFire: props.chanceToStartFire,
        damageFalloff: props.damageFalloff,

        explodeOnKilled: props.explodeOn?.killed,
        explodeOnDestroyed: props.explodeOn?.destroyed,

        preExplosionSpawnThingDef: props.preExplosionSpawn?.def,
        preExplosionSpawnChance: props.preExplosionSpawn?.chance,
        preExplosionSpawnCount: props.preExplosionSpawn?.count,

        postExplosionSpawnThingDef: props.postExplosionSpawn?.def,
        postExplosionSpawnChance: props.postExplosionSpawn?.chance,
        postExplosionSpawnCount: props.postExplosionSpawn?.count,

        wickTicks: castArray(props.wick?.ticks).join("~"),
        wickScale: props.wick?.scale,
        drawWick: props.wick?.draw,
    }),
    setup: (def) => {
        def.getOrCreate("tickerType").contents = [TickerType.Normal];
    }
})

export interface ExplosiveProps {
    range?: number;
    damageType?: DamageDefId;
    requiredDamageTypeToExplode?: DamageDefId;
    damageAmountBase?: number;
    applyDamageToExplosionCellsNeighbors?: boolean;
    chanceToStartFire?: number;
    damageFalloff?: boolean;
    explodeOn?: {
        killed?: boolean;
        destroyed?: boolean;
    }
    preExplosionSpawn?: ExplosiveSpawnProps;
    postExplosionSpawn?: ExplosiveSpawnProps;
    wick?: {
        draw?: boolean;
        scale?: number;
        ticks?: number | [number, number];
    }

}

export interface ExplosiveSpawnProps {
    def: string;
    chance: number;
    count: number;
}