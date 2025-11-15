import { BodyPartGroupDefId, DamageDefId, ToolCapacityDefId } from "@/defs";
import { CompComponent, SimpleComponent } from "../../components";
import { x, xls } from "../../xml";
import { TechLevel } from "@/common";

export const EquippableComponent = () => new CompComponent("CompEquippable");
export const StyleableComponent = () => new CompComponent("CompProperties_Styleable", { isExtends: true });
export const ForbiddableComponent = () => new CompComponent("CompProperties_Forbiddable", { isExtends: true });
export const BiocodableComponent = () => new CompComponent("CompProperties_Biocodable", { isExtends: true });

export const GenericWeaponComponent = (props: GenericWeaponProps) => new SimpleComponent("GenericWeapon", [
    x("techLevel", props.techLevel ?? TechLevel.Animal),
    x("weaponClasses", xls([TechLevel.gte(props.techLevel ?? TechLevel.Animal, TechLevel.Neolithic) ? "Neolithic" : ""])),
    x("inspectorTabs", xls(["ITab_Art"])),
    x("tradeTags", xls(["Weapon"])),
    x("weaponTags", xls(props.tags)),
    //
    x("equippedAngleOffset", props.equippedAngle ?? -65),
], []);

export interface GenericWeaponProps {
    tags: string[];
    techLevel?: TechLevel;
    equippedAngle?: number;
}

// Melee Weapon
export const MeleeWeaponComponent = (props: MeleeWeaponProps) => new SimpleComponent("MeleeWeapon", [
    x("techLevel", props.techLevel ?? TechLevel.Animal),
    x("thingCategories", xls(["WeaponsMelee"])),
    x("weaponClasses", xls(["Melee"])),
    x("tradeTags", xls(["WeaponMelee"])),
    x("equippedAngleOffset", props.equippedAngle ?? -65),
], ["GenericWeapon", "MeleeAttack"]);

export enum MeleeWeaponType {
    Sharp = "MeleePiercer",
    Blunt = "MeleeBlunt",
}

export interface MeleeWeaponProps {
    type: MeleeWeaponType;
    tags: string[];
    techLevel?: TechLevel;
    equippedAngle?: number;
    attacks: {
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
    }[]
}

// Ranged Weapon
export const RangedWeaponComponent = (props: MeleeWeaponProps) => new SimpleComponent("MeleeWeapon", [
    x("techLevel", props.techLevel ?? TechLevel.Animal),
    x("thingCategories", xls(["WeaponsRanged"])),
    x("weaponClasses", xls(["Ranged"])),
    x("tradeTags", xls(["WeaponRanged"])),
], ["GenericWeapon"]);