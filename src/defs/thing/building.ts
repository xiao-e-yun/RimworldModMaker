import { Component, GraphicProps } from "@/components";
import { ContextWithoutFunctions, toVec, withDefaults, x, xls, xobj, xstats } from "@/utils";
import { DefNode, EffecterDefId, registerDef, SoundDefId, TerrainAffordanceDefId, ThingDefId, ThingDefProps, ThingStats } from "..";
import { DesignationCategoryDefId, DrawStyleCategoryDefId } from "@/defs/vanilla";
import { AltitudeLayer, DrawerType, TickerType } from "@/common";
import { isString } from "lodash-es";


/**
 * Defines a building ThingDef.
 * 
 */
export const defineBuilding = (context: ContextWithoutFunctions, options: BuildingProps, components: Component[]) => {

    const {
        name,
        label,
        building,
        size,
        uiIconPaths,
        replaceTags,
        stats: $stats,
        ...props
    } = withDefaults(options, {
        description: options.label || "No description provided.",
        thingClass: "Building",
        category: "Building",
        drawerType: DrawerType.MapMeshOnly,
        altitudeLayer: AltitudeLayer.Building,
        tickerType: TickerType.Never,
        useHitPoints: true,
        pathCost: 14,
        selectable: true,
        rotatable: false,
        building: {},
    } as const)

    const stats = withDefaults($stats, {
        Mass: 3.0,
        Beauty: -3,
        Flammability: 0.8,
        SellPriceFactor: 0.5,
        DeteriorationRate: 0,
    } as const)
    //

    return registerDef(context, new DefNode("ThingDef", {
        name: options.name,
        label: options.label,
        contents: [
            ...xobj(props),
            x("size", toVec(size)),
            x("replaceTags", xls(replaceTags)),
            x("building", xobj({
                ...building as Record<string, unknown>,
                relatedBuildCommands: xls(building.relatedBuildCommands),
            })),
            ...[
                isString(uiIconPaths) ?
                    x("uiIconPath", uiIconPaths) :
                    x("uiIconPathsStuff", xls(uiIconPaths?.map(e => xobj({
                        appearance: e.appearance,
                        iconPath: e.iconPath
                    }))))
            ],
            xstats(stats),
        ],
        components,
    }));
}

export interface BuildingProps extends ThingDefProps {
    description: string;

    /** Building size in cells [x, z]. Default is [1, 1]. */
    size?: [number, number];
    soundImpactDefault?: SoundDefId;
    terrainAffordanceNeeded?: TerrainAffordanceDefId;
    leaveResourcesWhenKilled?: boolean;
    repairEffect?: EffecterDefId;
    filthLeaving?: ThingDefId;
    blockLight?: boolean;
    blockWind?: boolean;
    canOverlapZones?: boolean;
    castEdgeShadows?: boolean;

    // Core building/top-level placement & material
    holdsRoof?: boolean;
    passability?: "Impassable" | "PassThroughOnly" | "Standable";
    fillPercent?: number;
    coversFloor?: boolean;
    useStuffTerrainAffordance?: boolean;
    designationCategory?: DesignationCategoryDefId;
    drawStyleCategory?: DrawStyleCategoryDefId;
    uiIconPaths?: string | UiIconStuffEntry[];
    uiOrder?: number;
    replaceTags?: string[];
    neverMultiSelect?: boolean;
    noRightClickDraftAttack?: boolean;

    building?: BuildingSettings;
    stats?: BuildingStats;
}

export interface BuildingSettings {
    paintable?: boolean,
    isInert?: boolean,
    isWall?: boolean,
    isPlaceOverableWall?: boolean,
    ai_chillDestination?: boolean,
    supportsWallAttachments?: boolean,
    isStuffableAirtight?: boolean,
    blueprintGraphicData?: GraphicProps,
    relatedBuildCommands?: ThingDefId[],

    // Structural & interaction flags
    claimable?: boolean,
    deconstructible?: boolean,
    supportsPlants?: boolean,
    canPlaceOver?: boolean,
    allowAutoroof?: boolean,
    preventDeteriorationInside?: boolean,
}

export interface BuildingStats extends ThingStats {
    WorkToBuild?: number;
}

export interface UiIconStuffEntry {
    appearance: string;
    iconPath: string;
}