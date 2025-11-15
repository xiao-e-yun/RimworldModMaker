import { x, xls } from "@/xml";
import { SimpleComponent, xStateBase } from "..";
import { BodyPartGroupDefId, DamageDefId, SoundDefId, ThingDefId, ToolCapacityDefId, VanillaThingDef } from "@/defs";

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
export const RangedAttackComponent = (props: RangedAttack) => new SimpleComponent("RangedAttack", [
    x("verbs", [x("li", [
        x("verbClass", props.verbClass),
        x("hasStandardCommand", props.hasStandardCommand ?? true),
        x("defaultProjectile", (props.defaultProjectile ?? VanillaThingDef.Bullet_AssaultRifle).id),
        x("warmupTime", props.warmupTime),
        x("range", props.range),
        x("burstShotCount", props.burstShotCount),
        x("ticksBetweenBurstShots", props.rpm && 3600 / props.rpm),
        x("soundCast", props.soundCast?.id),
        x("soundCastTail", props.soundCastTail?.id),
        x("muzzleFlashScale", props.muzzleFlashScale),
    ])]),
    xStateBase({
        AccuracyTouch: props.accuracy?.touch,
        AccuracyShort: props.accuracy?.short,
        AccuracyMedium: props.accuracy?.medium,
        AccuracyLong: props.accuracy?.long,
        RangedWeapon_Cooldown: props.cooldown,
    })
], ["GenericWeapon"]);

export interface RangedAttack {
    verbClass?: VerbClass;
    hasStandardCommand?: boolean;
    defaultProjectile?: ThingDefId;
    warmupTime?: number;
    cooldown?: number;
    range?: number;
    burstShotCount?: number;
    /**
     * @max 3600
     */
    rpm?: number
    soundCast?: SoundDefId;
    soundCastTail?: SoundDefId;
    muzzleFlashScale?: number;
    accuracy?: {
        touch?: number;
        short?: number;
        medium?: number;
        long?: number;
    };
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
    Verb_Spawn = "Verb_Spawn",
}