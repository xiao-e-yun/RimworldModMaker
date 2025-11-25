import { x, xls, XmlChild, xobj, xstats } from "@/xml";
import { SimpleComponent } from "..";
import { BodyPartGroupDefId, DamageDefId, SoundDefId, ThingDefId, ToolCapacityDefId, VanillaThingDef, ThingCategoryDefId, FactionDefId, RulePackDefId } from "@/defs";

// Attack
export const MeleeAttackComponent = (props: MeleeAttack[]) => new SimpleComponent("MeleeAttack", {
  props: [
    x("tools", props.map(a => x("li", [
      x("label", a.label),
      x("capacities", xls(a.capacities)),
      x("power", a.power),
      x("cooldownTime", a.cooldown),
      x("chanceFactor", a.chanceFactor),
      x("armorPenetration", a.armorPenetration),
      x("linkedBodyPartsGroup", a.linkedBodyPartsGroup),
      x("ensureLinkedBodyPartsGroupAlwaysUsable", a.ensureLinkedBodyPartsGroupAlwaysUsable),
      x("alwaysTreatAsWeapon", a.alwaysTreatAsWeapon),
      ...(a.extraMeleeDamages ? [
        x("extraMeleeDamages", xls(a.extraMeleeDamages.map(dmg => xobj({
          amount: dmg.amount,
          chance: dmg.chance,
          def: dmg.damage
        }))))
      ] : []),
    ])))
  ],
  required: ["CompEquippable"]
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

// Ranged Attack
export const RangedAttackComponent = (props: RangedAttack[], options?: GenericRangedAttack) => new SimpleComponent("RangedAttack", {
  props: [
    x("verbs", xls(props.map(props => xobj({
      verbClass: props.verbClass,
      hasStandardCommand: props.hasStandardCommand ?? true,
      defaultProjectile: props.defaultProjectile ?? VanillaThingDef.Bullet_AssaultRifle,
      warmupTime: props.warmupTime,
      range: props.range,
      noiseRadius: props.noiseRadius,
      burstShotCount: props.burstShotCount ?? 2,
      ticksBetweenBurstShots: Math.round(3600 / (props.rpm ?? 120)),
      soundCast: props.soundCast,
      soundCastTail: props.soundCastTail,
      muzzleFlashScale: props.muzzleFlashScale,
      forcedMissRadius: props.forcedMissRadius,
      aiCanDestroyBuilding: props.aiCanDestroyBuilding,
      rangedFireRulepack: props.rulepack,
      targetParams: xobj(props.targets as Record<string, XmlChild | XmlChild[]>),
    })))),
    xstats({
      AccuracyTouch: options?.accuracy?.touch,
      AccuracyShort: options?.accuracy?.short,
      AccuracyMedium: options?.accuracy?.medium,
      AccuracyLong: options?.accuracy?.long,
      RangedWeapon_Cooldown: options?.cooldown,
    })
  ],
  required: ["CompEquippable"]
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
  /**
   * @max 3600
   */
  rpm?: number
  soundCast?: SoundDefId;
  soundCastTail?: SoundDefId;
  muzzleFlashScale?: number;
  aiCanDestroyBuilding?: boolean;
  targets?: RangedTargetingParameters;
  /**
   * @example VanillaRulePackDef.Combat_RangedFire
   */
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
  canTargetLocations?: boolean
  canTargetSelf?: boolean
  canTargetPawns?: boolean
  canTargetFires?: boolean
  canTargetBuildings?: boolean
  canTargetItems?: boolean
  canTargetAnimals?: boolean
  canTargetHumans?: boolean
  canTargetMechs?: boolean
  canTargetPlants?: boolean
  canTargetSubhumans?: boolean
  canTargetEntities?: boolean
  onlyTargetFactions?: FactionDefId[]
  onlyTargetFlammables?: boolean
  targetSpecificThing?: ThingDefId
  mustBeSelectable?: boolean
  neverTargetDoors?: boolean
  neverTargetIncapacitated?: boolean
  neverTargetHostileFaction?: boolean
  onlyTargetSameIdeo?: boolean
  onlyTargetThingsAffectingRegions?: boolean
  onlyTargetDamagedThings?: boolean
  mapObjectTargetsMustBeAutoAttackable?: boolean
  onlyTargetIncapacitatedPawns?: boolean
  onlyTargetColonistsOrPrisoners?: boolean
  onlyTargetColonistsOrPrisonersOrSlaves?: boolean
  onlyTargetColonistsOrPrisonersOrSlavesAllowMinorMentalBreaks?: boolean
  onlyTargetControlledPawns?: boolean
  onlyTargetColonists?: boolean
  onlyTargetPrisonersOfColony?: boolean
  onlyTargetPsychicSensitive?: boolean
  onlyTargetAnimaTrees?: boolean
  canTargetBloodfeeders?: boolean
  onlyRepairableMechs?: boolean
  thingCategory?: ThingCategoryDefId
  onlyTargetDoors?: boolean
  canTargetCorpses?: boolean
  onlyTargetCorpses?: boolean
  mapBoundsContractedBy?: number
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
