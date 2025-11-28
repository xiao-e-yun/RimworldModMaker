import { CompComponent, SimpleComponent } from "..";
import { xls, xobj } from "@/xml";

export * from "./attack";
export * from "./abilities";

export const EquippableComponent = () => new CompComponent("CompEquippable");
export const StyleableComponent = () => new CompComponent("CompProperties_Styleable", { isExtends: true });
export const BiocodableComponent = () => new CompComponent("CompProperties_Biocodable", { isExtends: true });

export const GenericWeaponComponent = (props: GenericWeaponProps = {}) => new SimpleComponent("GenericWeapon", {
    props: xobj({
        inspectorTabs: xls(["ITab_Art"]),
        tradeTags: xls(["Weapon"]),
    }),
});

export interface GenericWeaponProps {
    /** 
     * vanilla melee weapons being -65 degrees, -25 degrees (ikwa), or -20 degrees (thrumbo horns, elephant tusks).
     */
    equippedAngle?: number;
}

export const MeleeWeaponComponent = (type: MeleeWeaponType) => new SimpleComponent("MeleeWeapon", {
    props: xobj({
        thingCategories: xls(["WeaponsMelee"]),
        weaponClasses: xls(["Melee", type]),
        tradeTags: xls(["WeaponMelee"]),
    }),
});

export enum MeleeWeaponType {
    Sharp = "MeleePiercer",
    Blunt = "MeleeBlunt",
}

export const RangedWeaponComponent = () => new SimpleComponent("RangedWeapon", {
    props: xobj({
        thingCategories: xls(["WeaponsRanged"]),
        weaponClasses: xls(["Ranged"]),
        tradeTags: xls(["WeaponRanged"]),
    }),
});
