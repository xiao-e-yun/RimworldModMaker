import { xls, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { ThingDefId } from "@/defs";
import { toVec } from "@/utils";

export const TurretComponent = (props: TurretProps) => new SimpleComponent("TurretComponent", {
    required: ["CompProperties_Stunnable"],
    props: xobj({
        thingClass: "Building_TurretGun",
        drawerType: "MapMeshAndRealTime",
        tickerType: "Normal",
        passability: "PassThroughOnly",
        placeWorkers: xls([
            "PlaceWorker_TurretTop",
            "PlaceWorker_ShowTurretRadius",
        ]),
        building: xobj({
            turretGunDef: props.turretGunDef,
            turretBurstCooldownTime: props.burstCooldownTime,
            turretBurstWarmupTime: props.burstWarmupTime,
            turretTopDrawSize: props.topDrawSize,
            turretTopOffset: props.topOffset && toVec(props.topOffset),
            combatPower: props.combatPower,
            ai_combatDangerous: props.aiCombatDangerous,
        }),
    }),
});

export interface TurretProps {
    turretGunDef: ThingDefId;
    burstCooldownTime: number;
    burstWarmupTime?: number;
    topDrawSize?: number;
    topOffset?: [number, number];
    combatPower?: number;
    aiCombatDangerous?: boolean;
}
