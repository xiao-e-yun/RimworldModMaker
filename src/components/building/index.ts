import { CompComponent } from ".."
import { x, xls } from "@/xml"
import { VanillaDamageDef } from "@/defs/vanilla"
import type { DefId } from "@/defs"

// Building Components
export * from "./power"
export * from "./storage"
export * from "./bed"
export * from "./workbench"
export * from "./door"
export * from "./trap"
export * from "./turret"
export * from "./recipe"

export const FlickableComponent = () => new CompComponent("CompProperties_Flickable", {
    isExtends: true,
})

export interface StunnableComponentProps {
    /** Damage types that can stun this building. Defaults to [Stun, EMP] */
    affectedDamageDefs?: DefId<"DamageDef">[]
}

/** Makes the building stunnable by EMP attacks */
export const StunnableComponent = (props: StunnableComponentProps = {}) => {
    const damageDefs = props.affectedDamageDefs ?? [VanillaDamageDef.Stun, VanillaDamageDef.EMP]
    return new CompComponent("CompProperties_Stunnable", {
        isExtends: true,
        props: [
            x("affectedDamageDefs", xls(damageDefs)),
        ],
    })
}

/** Makes the building require a pawn to operate */
export const MannableComponent = () => new CompComponent("CompProperties_Mannable", {
    isExtends: true,
})
