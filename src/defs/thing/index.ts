import { AltitudeLayer, TechLevel, TickerType } from "@/common";
import { BaseDefProps } from "..";

export * from "./building"
export * from "./category"
export * from "./weapon"

export type ThingDefProps = {
    thingClass: string;
    category: string;
    drawerType: "None" | "RealtimeOnly" | "MapMeshOnly" | "MapMeshAndRealTime";
    drawGUIOverlay: boolean;
    description: string;
    altitudeLayer: AltitudeLayer;
    alwaysHaulable: boolean;
    tickerType: TickerType;
    useHitPoints: boolean;
    pathCost: number;
    selectable: boolean;
    rotatable: boolean;
    techLevel: TechLevel;
    allowedArchonexusCount?: number;
} & BaseDefProps

export interface ThingStats {
    Mass: number;
    Beauty?: number;
    MarketValue?: number;
    MaxHitPoints?: number;
    Flammability?: number;
    SellPriceFactor?: number;
    DeteriorationRate?: number;
}