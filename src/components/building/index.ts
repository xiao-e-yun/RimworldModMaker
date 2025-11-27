import { CompComponent } from ".."

// Building Components
export * from "./power"
export * from "./storage"
export * from "./bed"
export * from "./workbench"
export * from "./door"
export * from "./trap"
export * from "./turret"

export const FlickableComponent = () => new CompComponent("CompProperties_Flickable", {
    isExtends: true,
})

/** Makes the building stunnable by EMP attacks */
export const StunnableComponent = () => new CompComponent("CompProperties_Stunnable", {
    isExtends: true,
})

/** Makes the building require a pawn to operate */
export const MannableComponent = () => new CompComponent("CompProperties_Mannable", {
    isExtends: true,
})
