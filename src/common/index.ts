/** Drawer types for RimWorld defs. */
export enum DrawerType {
    MapMeshAndRealTime,
    RealtimeOnly,
    MapMeshOnly,
    None,
}

export enum FilthLeaving {
    Filth_MachineBits = "Filth_MachineBits",
    Filth_RubbleBuilding = "Filth_RubbleBuilding",
    Filth_RubbleRock = "Filth_RubbleRock",
    SandbagRubble = "SandbagRubble",
}

export enum RepairEffect {
    ConstructDirt = "ConstructDirt",
    ConstructMetal = "ConstructMetal",
    Repair = "Repair",
}

export enum TerrainAffordance {
    Bridgeable = "Bridgeable",
    Diggable = "Diggable",
    GrowSoil = "GrowSoil",
    Heavy = "Heavy",
    Light = "Light",
    Medium = "Medium",
    MovingFluid = "MovingFluid",
    ShallowWater = "ShallowWater",
    SmoothableStone = "SmoothableStone",
    Walkable = "Walkable",
    WaterproofConduitable = "WaterproofConduitable",
}

export enum TechLevel {
    Undefined = "Undefined",
    Animal = "Animal",
    Neolithic = "Neolithic",
    Medieval = "Medieval",
    Midworld = "Midworld",
    Spacer = "Spacer",
    Ultra = "Ultra",
    Transcendent = "Transcendent",
}
export namespace TechLevel {
    export const ORDER: TechLevel[] = [
        TechLevel.Undefined,
        TechLevel.Animal,
        TechLevel.Neolithic,
        TechLevel.Medieval,
        TechLevel.Midworld,
        TechLevel.Spacer,
        TechLevel.Ultra,
        TechLevel.Transcendent,
    ];
    export const eq = (a: TechLevel, b: TechLevel) => ORDER.indexOf(a) === ORDER.indexOf(b);
    export const gt = (a: TechLevel, b: TechLevel) => ORDER.indexOf(a) > ORDER.indexOf(b);
    export const lt = (a: TechLevel, b: TechLevel) => ORDER.indexOf(a) < ORDER.indexOf(b);
    export const gte = (a: TechLevel, b: TechLevel) => ORDER.indexOf(a) >= ORDER.indexOf(b);
    export const lte = (a: TechLevel, b: TechLevel) => ORDER.indexOf(a) <= ORDER.indexOf(b);
}

export enum TickerType {
    Never = "Never",
    Normal = "Normal",
    Rare = "Rare",
    Long = "Long",
}