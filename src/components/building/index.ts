import { CompComponent } from "..";
import { xls, xobj } from "@/xml";
import { VanillaDamageDef } from "@/defs/vanilla";
import type { DefId } from "@/defs";
import { toVec } from "@/utils";

// Building Components
export * from "./power";
export * from "./storage";
export * from "./bed";
export * from "./workbench";
export * from "./door";
export * from "./trap";
export * from "./turret";
export * from "./recipe";

export const FlickableComponent = () => new CompComponent("CompProperties_Flickable", {
    isExtends: true,
});

export interface GlowerComponentProps {
    /** The radius of the glow effect. Default is 14. Max is 40. */
    glowRadius?: number;
    /** 
     * The color of the glow effect as RGBA values. 
     * The alpha channel (4th value) is typically 0 for lights.
     * Example: [214, 148, 94, 0] for a warm orange light
     */
    glowColor?: [number, number, number, number];
    /** Radius for overlight effect (used by sun lamps to accelerate plant growth) */
    overlightRadius?: number;
    /** Whether the player can change the light color (requires ColoredLights research) */
    colorPickerEnabled?: boolean;
    /** Whether the player can toggle between normal light and darklight */
    darklightToggle?: boolean;
    /** Override for cave plant detection */
    overrideIsCavePlant?: boolean;
}

/** Makes the building emit light */
export const GlowerComponent = (props: GlowerComponentProps = {}) => new CompComponent("CompProperties_Glower", {
    isExtends: true,
    props: xobj({
        glowRadius: props.glowRadius,
        glowColor: toVec(props.glowColor),
        overlightRadius: props.overlightRadius,
        colorPickerEnabled: props.colorPickerEnabled,
        darklightToggle: props.darklightToggle,
        overrideIsCavePlant: props.overrideIsCavePlant,
    }),
});

export interface StunnableComponentProps {
    /** Damage types that can stun this building. Defaults to [Stun, EMP] */
    affectedDamageDefs?: DefId<"DamageDef">[];
}

/** Makes the building stunnable by EMP attacks */
export const StunnableComponent = (props: StunnableComponentProps = {}) => new CompComponent("CompProperties_Stunnable", {
    isExtends: true,
    props: xobj({
        affectedDamageDefs: xls(props.affectedDamageDefs ?? [VanillaDamageDef.Stun, VanillaDamageDef.EMP]),
    }),
});

/** Makes the building require a pawn to operate */
export const MannableComponent = () => new CompComponent("CompProperties_Mannable", {
    isExtends: true,
});
