import { xls, XmlChild, xobj, xstats } from "@/xml";
import { SimpleComponent } from "..";
import { BodyPartGroupDefId, DamageDefId, SoundDefId, ThingDefId, ToolCapacityDefId, VanillaThingDef, ThingCategoryDefId, FactionDefId, RulePackDefId } from "@/defs";

export const MeleeAttackComponent = (props: MeleeAttack[]) => new SimpleComponent("MeleeAttack", {
    required: ["CompEquippable"],
    props: xobj({
        tools: xls(props.map(a => xobj({
            label: a.label,
            capacities: xls(a.capacities),
            power: a.power,
            cooldownTime: a.cooldown,
            chanceFactor: a.chanceFactor,
            armorPenetration: a.armorPenetration,
            linkedBodyPartsGroup: a.linkedBodyPartsGroup,
            ensureLinkedBodyPartsGroupAlwaysUsable: a.ensureLinkedBodyPartsGroupAlwaysUsable,
            alwaysTreatAsWeapon: a.alwaysTreatAsWeapon,
            extraMeleeDamages: a.extraMeleeDamages && xls(a.extraMeleeDamages.map(dmg => xobj({
                def: dmg.damage,
                amount: dmg.amount,
                chance: dmg.chance,
            }))),
        }))),
    }),
});

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

export const RangedAttackComponent = (props: RangedAttack[], options?: GenericRangedAttack) => new SimpleComponent("RangedAttack", {
    required: ["CompEquippable"],
    props: [
        ...xobj({
            verbs: xls(props.map(p => xobj({
                verbClass: p.verbClass,
                hasStandardCommand: p.hasStandardCommand ?? true,
                defaultProjectile: p.defaultProjectile ?? VanillaThingDef.Bullet_AssaultRifle,
                warmupTime: p.warmupTime,
                range: p.range,
                noiseRadius: p.noiseRadius,
                burstShotCount: p.burstShotCount ?? 2,
                ticksBetweenBurstShots: Math.round(3600 / (p.rpm ?? 120)),
                soundCast: p.soundCast,
                soundCastTail: p.soundCastTail,
                muzzleFlashScale: p.muzzleFlashScale,
                forcedMissRadius: p.forcedMissRadius,
                aiCanDestroyBuilding: p.aiCanDestroyBuilding,
                rangedFireRulepack: p.rulepack,
                targetParams: p.targets && xobj(p.targets as Record<string, XmlChild | XmlChild[]>),
            }))),
        }),
        xstats({
            AccuracyTouch: options?.accuracy?.touch,
            AccuracyShort: options?.accuracy?.short,
            AccuracyMedium: options?.accuracy?.medium,
            AccuracyLong: options?.accuracy?.long,
            RangedWeapon_Cooldown: options?.cooldown,
        }),
    ],
});

export interface RangedAttack {
    verbClass?: VerbClass;
    hasStandardCommand?: boolean;
    defaultProjectile?: ThingDefId;
    warmupTime?: number;
    range?: number;
    forcedMissRadius?: number;
    noiseRadius?: number;
    burstShotCount?: number;
    /** @max 3600 */
    rpm?: number;
    soundCast?: SoundDefId;
    soundCastTail?: SoundDefId;
    muzzleFlashScale?: number;
    aiCanDestroyBuilding?: boolean;
    targets?: RangedTargetingParameters;
    /** @example VanillaRulePackDef.Combat_RangedFire */
    rulepack?: RulePackDefId;
}

export interface GenericRangedAttack {
    cooldown?: number;
    accuracy?: {
        touch?: number;
        short?: number;
        medium?: number;
        long?: number;
    };
}

export interface RangedTargetingParameters {
    canTargetLocations?: boolean;
    canTargetSelf?: boolean;
    canTargetPawns?: boolean;
    canTargetFires?: boolean;
    canTargetBuildings?: boolean;
    canTargetItems?: boolean;
    canTargetAnimals?: boolean;
    canTargetHumans?: boolean;
    canTargetMechs?: boolean;
    canTargetPlants?: boolean;
    canTargetSubhumans?: boolean;
    canTargetEntities?: boolean;
    onlyTargetFactions?: FactionDefId[];
    onlyTargetFlammables?: boolean;
    targetSpecificThing?: ThingDefId;
    mustBeSelectable?: boolean;
    neverTargetDoors?: boolean;
    neverTargetIncapacitated?: boolean;
    neverTargetHostileFaction?: boolean;
    onlyTargetSameIdeo?: boolean;
    onlyTargetThingsAffectingRegions?: boolean;
    onlyTargetDamagedThings?: boolean;
    mapObjectTargetsMustBeAutoAttackable?: boolean;
    onlyTargetIncapacitatedPawns?: boolean;
    onlyTargetColonistsOrPrisoners?: boolean;
    onlyTargetColonistsOrPrisonersOrSlaves?: boolean;
    onlyTargetColonistsOrPrisonersOrSlavesAllowMinorMentalBreaks?: boolean;
    onlyTargetControlledPawns?: boolean;
    onlyTargetColonists?: boolean;
    onlyTargetPrisonersOfColony?: boolean;
    onlyTargetPsychicSensitive?: boolean;
    onlyTargetAnimaTrees?: boolean;
    canTargetBloodfeeders?: boolean;
    onlyRepairableMechs?: boolean;
    thingCategory?: ThingCategoryDefId;
    onlyTargetDoors?: boolean;
    canTargetCorpses?: boolean;
    onlyTargetCorpses?: boolean;
    mapBoundsContractedBy?: number;
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
