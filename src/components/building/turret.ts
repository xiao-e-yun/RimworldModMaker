import { x, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { ThingDefId } from "@/defs";

export const TurretComponent = (props: TurretProps) => new SimpleComponent("TurretComponent", {
    required: props.requiresPower ? ["CompProperties_Power"] : [],
    props: [
        x("thingClass", "Building_TurretGun"),
        x("drawerType", "MapMeshAndRealTime"),
        x("tickerType", "Normal"),
        x("passability", "PassThroughOnly"),
        x("placeWorkers", [
            x("li", "PlaceWorker_TurretTop"),
            x("li", "PlaceWorker_ShowTurretRadius"),
        ]),
    ],
    setup: (def) => {
        const building = def.getOrCreate("building");
        building.mergeChildren(...xobj({
            turretGunDef: props.turretGunDef,
            turretBurstCooldownTime: props.burstCooldownTime,
            turretBurstWarmupTime: props.burstWarmupTime,
            turretTopDrawSize: props.topDrawSize,
            turretTopOffset: props.topOffset ? `(${props.topOffset.join(",")})` : undefined,
            combatPower: props.combatPower,
            ai_combatDangerous: props.aiCombatDangerous,
        }));

        // Add stunnable comp for EMP
        const comps = def.getOrCreate("comps");
        comps.contents!.push(x("li", [], { Class: "CompProperties_Stunnable" }));

        // Add mannable if required
        if (props.requiresMannable) {
            comps.contents!.push(x("li", [], { Class: "CompProperties_Mannable" }));
        }
    }
});

export interface TurretProps {
    turretGunDef: ThingDefId;
    burstCooldownTime: number;
    burstWarmupTime?: number;
    topDrawSize?: number;
    topOffset?: [number, number];
    combatPower?: number;
    aiCombatDangerous?: boolean;
    requiresPower?: boolean;
    requiresMannable?: boolean;
}
