import { AbilityDefId } from "@/defs";
import { CompComponent } from "..";
import { xls, xobj } from "@/xml";
import { runtimeClass } from "@/index";

export const WeaponAbilitiesComponent = (abilities: AbilityDefId[]) => new CompComponent(runtimeClass("CompProperties_WeaponAbilities"), {
    isExtends: true,
    required: ["CompEquippable"],
    requiredRuntime: true,
    props: xobj({
        AbilityDefs: xls(abilities),
    }),
});

/**
 * @requires Anomaly
 */
// export const EquippableAbilityComponent = (props: EquippableAbilityProps) => props.reload ? new CompComponent("CompProperties_EquippableAbilityReloadable", {
//     isExtends: true,
//     props: xobj({
//         abilityDef: props.abilityDef,
//         maxCharges: props.reload.maxAmmo,
//         soundReload: props.reload.sound,
//         chargeNoun: props.reload.chargeNoun,
//         ammoDef: props.reload.ammoDef,
//         ammoCountPerCharge: props.reload.ammoCountPerCharge,
//         baseReloadTicks: props.reload.baseTicks,
//     }),
// }) : new CompComponent("CompProperties_EquippableAbility", {
//     isExtends: true,
//     props: xobj({
//         abilityDef: props.abilityDef,
//     }),
// });
//
// export interface EquippableAbilityProps {
//     abilityDef: string;
//     reload?: {
//         sound: string;
//         chargeNoun: string;
//         maxAmmo: number;
//         ammoDef: string;
//         ammoCountPerCharge: number;
//         baseTicks: number;
//     } | false;
// }
