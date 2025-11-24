import { Component, GraphicProps } from "@/components";
import { ContextWithoutFunctions } from "@/utils";
import { BaseDefProps } from "..";

export const defineBuilding = (context: ContextWithoutFunctions, props: BuildingProps, components: Component[])  => {
    //
}

export interface BuildingProps extends BaseDefProps {
    description?: string;
    state: {
        paintable: boolean,
        isInert: boolean,
        isWall: boolean,
        isPlaceOverableWall: boolean,
        aiChillDestination: boolean,
        supportsWallAttachments: boolean,
        isStuffableAirtight: boolean,
        blueprintGraphicData: GraphicProps,
    }
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