import { x, xls, xobj, xstats } from "@/xml";
import { SimpleComponent } from "..";
import { BodyPartGroupDefId, DamageDefId, SoundDefId, ThingDefId, getDefId, ToolCapacityDefId, VanillaThingDef } from "@/defs";

// Attack
export const MeleeAttackComponent = (props: MeleeAttack[]) => new SimpleComponent("MeleeAttack", {
  props: [
    x("tools", props.map(a => x("li", [
      x("label", a.label),
      x("capacities", xls(getDefId(a.capacities))),
      x("power", a.power),
      x("cooldownTime", a.cooldown),
      x("chanceFactor", a.chanceFactor),
      x("armorPenetration", a.armorPenetration),
      x("linkedBodyPartsGroup", getDefId(a.linkedBodyPartsGroup)),
      x("ensureLinkedBodyPartsGroupAlwaysUsable", a.ensureLinkedBodyPartsGroupAlwaysUsable),
      x("alwaysTreatAsWeapon", a.alwaysTreatAsWeapon),
      ...(a.extraMeleeDamages ? [
        x("extraMeleeDamages", a.extraMeleeDamages.map(dmg => x("li", [
          x("amount", dmg.amount),
          x("chance", dmg.chance),
          x("def", getDefId(dmg.damage))
        ])))
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
      defaultProjectile: getDefId(props.defaultProjectile ?? VanillaThingDef.Bullet_AssaultRifle),
      warmupTime: props.warmupTime,
      range: props.range,
      burstShotCount: props.burstShotCount ?? 2,
      ticksBetweenBurstShots: 3600 / (props.rpm ?? 120),
      soundCast: getDefId(props.soundCast),
      soundCastTail: getDefId(props.soundCastTail),
      muzzleFlashScale: props.muzzleFlashScale,
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
  burstShotCount?: number;
  /**
   * @max 3600
   */
  rpm?: number
  soundCast?: SoundDefId;
  soundCastTail?: SoundDefId;
  muzzleFlashScale?: number;
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
