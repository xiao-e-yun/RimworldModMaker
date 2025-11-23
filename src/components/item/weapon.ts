import {CompComponent, SimpleComponent} from "../../components";
import {x, xls} from "../../xml";
import {TechLevel} from "@/common";

export const EquippableComponent = () => new CompComponent("CompEquippable");
export const StyleableComponent = () => new CompComponent("CompProperties_Styleable", {isExtends: true});
export const ForbiddableComponent = () => new CompComponent("CompProperties_Forbiddable", {isExtends: true});
export const BiocodableComponent = () => new CompComponent("CompProperties_Biocodable", {isExtends: true});

export const GenericWeaponComponent = (props: GenericWeaponProps = {}) => new SimpleComponent("GenericWeapon", {
  props: [
    x("techLevel", props.techLevel ?? TechLevel.Animal),
    x("weaponClasses", xls([TechLevel.gte(props.techLevel ?? TechLevel.Animal, TechLevel.Neolithic) ? "Neolithic" : ""])),
    x("inspectorTabs", xls(["ITab_Art"])),
    x("tradeTags", xls(["Weapon"])),
  ]
});

export interface GenericWeaponProps {
  tags?: string[];
  techLevel?: TechLevel;
  equippedAngle?: number;
}

// Melee Weapon
export const MeleeWeaponComponent = (type: MeleeWeaponType) => new SimpleComponent("MeleeWeapon", {
  props: [
    x("thingCategories", xls(["WeaponsMelee"])),
    x("weaponClasses", xls(["Melee", type])),
    x("tradeTags", xls(["WeaponMelee"])),
  ],
  required: ["GenericWeapon"]
});

export enum MeleeWeaponType {
  Sharp = "MeleePiercer",
  Blunt = "MeleeBlunt",
}

// Ranged Weapon
export const RangedWeaponComponent = () => new SimpleComponent("RangedWeapon", {
  props: [
    x("thingCategories", xls(["WeaponsRanged"])),
    x("weaponClasses", xls(["Ranged"])),
    x("tradeTags", xls(["WeaponRanged"])),
  ],
  required: ["GenericWeapon"]
});
