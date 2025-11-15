// <li Class="CompProperties_EquippableAbilityReloadable">
//     <abilityDef>Zhurong</abilityDef>
//     <maxCharges>10</maxCharges>
//     <soundReload>Standard_Reload</soundReload>
//     <chargeNoun>burner charge</chargeNoun>
//     <ammoDef>Bioferrite</ammoDef>
//     <ammoCountPerCharge>20</ammoCountPerCharge>
//     <baseReloadTicks>60</baseReloadTicks>
// </li>
import { CompComponent } from "..";
import { x } from "../../xml";

/**
 * 
 * @requires Anomaly
 */
export const EquippableAbilityComponent = (props: EquippableAbilityProps) => props.reload ? new CompComponent("CompProperties_EquippableAbilityReloadable", {
    isExtends: true,
    props: [
        x("abilityDef", props.abilityDef),
        x("maxCharges", props.reload.maxAmmo),
        x("soundReload", props.reload.sound),
        x("chargeNoun", props.reload.chargeNoun),
        x("ammoDef", props.reload.ammoDef),
        x("ammoCountPerCharge", props.reload.ammoCountPerCharge),
        x("baseReloadTicks", props.reload.baseTicks),
    ]
}) : new CompComponent("CompProperties_EquippableAbility", {
    isExtends: true,
    props: [
        x("abilityDef", props.abilityDef),
    ]
})

export interface EquippableAbilityProps {
    abilityDef: string;
    reload?: {
        sound: string;
        chargeNoun: string;
        maxAmmo: number;
        ammoDef: string;
        ammoCountPerCharge: number;
        baseTicks: number;
    } | false
}