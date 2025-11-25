import { AbilityDefId } from "@/defs";
import { CompComponent } from "..";
import { xls, xobj } from "../../xml";
import { runtimeClass } from "@/index";


export const WeaponAbilitiesComponent = (abilities: AbilityDefId[]) => new CompComponent(runtimeClass("CompProperties_WeaponAbilities"), {
  props: xobj({
    AbilityDefs: xls(abilities)
  }),
  isExtends: true,
  required: ["CompEquippable"],
  requiredRuntime: true,
})

/**
 *
 * @requires Anomaly
 */
// export const EquippableAbilityComponent = (props: EquippableAbilityProps) => props.reload ? new CompComponent("CompProperties_EquippableAbilityReloadable", {
//     isExtends: true,
//     props: [
//         x("abilityDef", props.abilityDef),
//         x("maxCharges", props.reload.maxAmmo),
//         x("soundReload", props.reload.sound),
//         x("chargeNoun", props.reload.chargeNoun),
//         x("ammoDef", props.reload.ammoDef),
//         x("ammoCountPerCharge", props.reload.ammoCountPerCharge),
//         x("baseReloadTicks", props.reload.baseTicks),
//     ]
// }) : new CompComponent("CompProperties_EquippableAbility", {
//     isExtends: true,
//     props: [
//         x("abilityDef", props.abilityDef),
//     ]
// })
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
//     } | false
// }
