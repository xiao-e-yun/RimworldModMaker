import { x, xls } from "@/xml";
import { SimpleComponent } from "..";
import { BodyPartGroupDefId, DamageDefId, ToolCapacityDefId } from "@/defs";

// Attack
export const MeleeAttackComponent = (props: MeleeAttack[]) => new SimpleComponent("MeleeAttack", [
    x("tools", props.map(a => x("li", [
        x("label", a.label),
        x("capacities", xls(a.capacities.map(c => c.id))),
        x("power", a.power),
        x("cooldownTime", a.cooldown),
        x("chanceFactor", a.chanceFactor),
        x("armorPenetration", a.armorPenetration),
        x("linkedBodyPartsGroup", a.linkedBodyPartsGroup?.id),
        x("ensureLinkedBodyPartsGroupAlwaysUsable", a.ensureLinkedBodyPartsGroupAlwaysUsable),
        x("alwaysTreatAsWeapon", a.alwaysTreatAsWeapon),
        ...(a.extraMeleeDamages ? [
            x("extraMeleeDamages", a.extraMeleeDamages.map(dmg => x("li", [
                x("amount", dmg.amount),
                x("chance", dmg.chance),
                x("def", dmg.damage?.id)
            ])))
        ] : []),
    ])))
], ["GenericWeapon"]);

export interface MeleeAttack {
    label: string;
    capacities: ToolCapacityDefId[];
    power: number;
    cooldown: number;
    chanceFactor?: number;
    armorPenetration?: number;
    linkedBodyPartsGroup?: BodyPartGroupDefId;
    ensureLinkedBodyPartsGroupAlwaysUsable?: boolean;
    alwaysTreatAsWeapon?: boolean;
    extraMeleeDamages?: {
        damage: DamageDefId;
        amount: number;
        chance?: number;
    }[];
}

// Ranged Attack
export const RangedAttackComponent = (props: RangedAttack[]) => new SimpleComponent("RangedAttack", [
    
], ["GenericWeapon"]);

export interface RangedAttack {
    verbClass: VerbClass;
    hasStandardCommand: string;
    defaultProjectile: string;
    warmupTime: string;
    range: string;
    burstShotCount: string;
    ticksBetweenBurstShots: string;
    soundCast: string;
    soundCastTail: string;
    muzzleFlashScale: string;
}

export enum VerbClass {
    Verb_ArcSprayProjectile = "Verb_ArcSprayProjectile",
    Verb_Bombardment = "Verb_Bombardment",
    Verb_CastAbility = "Verb_CastAbility",
    Verb_CastPsycast = "Verb_CastPsycast",
    Verb_CastTargetEffectLances = "Verb_CastTargetEffectLances",
    Verb_FirefoamPop = "Verb_FirefoamPop",
    Verb_LaunchProjectile = "Verb_LaunchProjectile",
    Verb_MeleeApplyHediff = "Verb_MeleeApplyHediff",
    Verb_MeleeAttackDamage = "Verb_MeleeAttackDamage",
    Verb_PowerBeam = "Verb_PowerBeam",
    Verb_Shoot = "Verb_Shoot",
    Verb_ShootOneUse = "Verb_ShootOneUse",
    Verb_Smokepop = "Verb_Smokepop",
    Verb_Spawn =  "Verb_Spawn",
}