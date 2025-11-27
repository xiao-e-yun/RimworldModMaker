import { Component, GraphicProps } from "@/components";
import { ContextWithoutFunctions, withDefaults, x, xls, xobj, xstats } from "@/utils";
import { DefNode, EffecterDefId, registerDef, SoundDefId, TerrainAffordanceDefId, ThingDefId, ThingDefProps, ThingStats } from "..";
import { DesignationCategoryDefId, DrawStyleCategoryDefId, StuffCategoryDefId } from "@/defs/vanilla";
import { omit } from "lodash-es";
import { AltitudeLayer, TickerType } from "@/common";


/**
 * Defines a building ThingDef.
 * 
 */
export const defineBuilding = (context: ContextWithoutFunctions, props: BuildingProps, stats: BuildingStats, components: Component[]) => {

    const $props = withDefaults(props, {
        description: props.label || "No description provided.",
        thingClass: "Building",
        category: "Building",
        drawerType: "MapMeshOnly",
        altitudeLayer: AltitudeLayer.Building,
        tickerType: TickerType.Never,
        useHitPoints: true,
        pathCost: 14,
        selectable: true,
        rotatable: false,
        settings: {},
    } as const)

    const $stats = withDefaults(stats, {
        Mass: 3.0,
        Beauty: -3,
        Flammability: 0.8,
        SellPriceFactor: 0.5,
        DeteriorationRate: 0,
    } as const)
    //

    return registerDef(context, new DefNode("ThingDef", {
        name: props.name,
        label: props.label,
        contents: [
            ...xobj(omit($props, ["name", "label", "settings", "uiIconPath", "uiIconPathsStuff", "stuffCategories", "replaceTags"])),
            x("uiIconPath", $props.uiIconPath),
            x("stuffCategories", xls($props.stuffCategories)),
            x("replaceTags", xls($props.replaceTags)),
            x("building", xobj({
                ...$props.settings as Record<string, unknown>,
                relatedBuildCommands: xls($props.settings.relatedBuildCommands),
            })),
            x("uiIconPathsStuff", xls($props.uiIconPathsStuff?.map(e => xobj({ appearance: e.appearance, iconPath: e.iconPath })))),
            xstats($stats),
        ],
        components,
    }));
}

export interface BuildingProps extends ThingDefProps {
    description: string;

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
    costStuffCount?: number;
    stuffCategories?: StuffCategoryDefId[];
    useStuffTerrainAffordance?: boolean;
    designationCategory?: DesignationCategoryDefId;
    drawStyleCategory?: DrawStyleCategoryDefId;
    uiIconPath?: string;
    uiIconPathsStuff?: UiIconStuffEntry[];
    uiOrder?: number;
    replaceTags?: string[];
    neverMultiSelect?: boolean;
    noRightClickDraftAttack?: boolean;

    settings?: BuildingSettings;
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

// <ThingDef>
//   <defName>Wall</defName>
//   <altitudeLayer>Building</altitudeLayer>
//   <blockLight>true</blockLight>
//   <blockWind>true</blockWind>
//   <building>
//     <paintable>true</paintable>
//     <isInert>true</isInert>
//     <isWall>true</isWall>
//     <isPlaceOverableWall>true</isPlaceOverableWall>
//     <ai_chillDestination>false</ai_chillDestination>
//     <supportsWallAttachments>true</supportsWallAttachments>
//     <isStuffableAirtight>true</isStuffableAirtight>
//     <blueprintGraphicData>
//       <texPath>Things/Building/Linked/Wall_Blueprint_Atlas</texPath>
//     </blueprintGraphicData>
//     <relatedBuildCommands>
//       <li>Door</li>
//       <li>Autodoor</li>
//       <li>OrnateDoor</li>
//       <li MayRequire="Ludeon.RimWorld.Anomaly">SecurityDoor</li>
//       <li MayRequire="Ludeon.RimWorld.Odyssey">VacBarrier</li>
//       <li>Cooler</li>
//       <li>Vent</li>
//     </relatedBuildCommands>
//   </building>
//   <canOverlapZones>false</canOverlapZones>
//   <castEdgeShadows>true</castEdgeShadows>
//   <category>Building</category>
//   <costStuffCount>5</costStuffCount>
//   <coversFloor>true</coversFloor>
//   <description>An impassable wall. Capable of holding up a roof.</description>
//   <designationCategory>Structure</designationCategory>
//   <drawStyleCategory>Walls</drawStyleCategory>
//   <drawerType>MapMeshOnly</drawerType>
//   <fertility>0</fertility>
//   <fillPercent>1</fillPercent>
//   <filthLeaving>Filth_RubbleBuilding</filthLeaving>
//   <graphicData>
//     <texPath>Things/Building/Linked/Wall</texPath>
//     <graphicClass>Graphic_Appearances</graphicClass>
//     <linkType>CornerFiller</linkType>
//     <linkFlags>
//       <li>Wall</li>
//       <li>Rock</li>
//     </linkFlags>
//     <damageData>
//       <cornerTL>Damage/Corner</cornerTL>
//       <cornerTR>Damage/Corner</cornerTR>
//       <cornerBL>Damage/Corner</cornerBL>
//       <cornerBR>Damage/Corner</cornerBR>
//       <edgeTop>Damage/Edge</edgeTop>
//       <edgeBot>Damage/Edge</edgeBot>
//       <edgeLeft>Damage/Edge</edgeLeft>
//       <edgeRight>Damage/Edge</edgeRight>
//     </damageData>
//   </graphicData>
//   <holdsRoof>true</holdsRoof>
//   <label>wall</label>
//   <leaveResourcesWhenKilled>false</leaveResourcesWhenKilled>
//   <neverMultiSelect>true</neverMultiSelect>
//   <noRightClickDraftAttack>true</noRightClickDraftAttack>
//   <passability>Impassable</passability>
//   <repairEffect>Repair</repairEffect>
//   <replaceTags>
//     <li>Wall</li>
//   </replaceTags>
//   <rotatable>false</rotatable>
//   <selectable>true</selectable>
//   <soundImpactDefault>BulletImpact_Metal</soundImpactDefault>
//   <statBases>
//     <MaxHitPoints>300</MaxHitPoints>
//     <WorkToBuild>135</WorkToBuild>
//     <Flammability>1.0</Flammability>
//     <MeditationFocusStrength>0.22</MeditationFocusStrength>
//   </statBases>
//   <staticSunShadowHeight>1.0</staticSunShadowHeight>
//   <stuffCategories>
//     <li>Metallic</li>
//     <li>Woody</li>
//     <li>Stony</li>
//   </stuffCategories>
//   <terrainAffordanceNeeded>Heavy</terrainAffordanceNeeded>
//   <thingClass>Building</thingClass>
//   <tickerType>Never</tickerType>
//   <uiIconPath>Things/Building/Linked/WallSmooth_MenuIcon</uiIconPath>
//   <uiIconPathsStuff>
//     <li>
//       <appearance>Planks</appearance>
//       <iconPath>Things/Building/Linked/WallPlanks_MenuIcon</iconPath>
//     </li>
//     <li>
//       <appearance>Bricks</appearance>
//       <iconPath>Things/Building/Linked/WallBricks_MenuIcon</iconPath>
//     </li>
//   </uiIconPathsStuff>
//   <uiOrder>2000</uiOrder>
//   <useStuffTerrainAffordance>true</useStuffTerrainAffordance>
// </ThingDef>