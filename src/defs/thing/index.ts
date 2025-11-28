import { AltitudeLayer, DrawerType, TechLevel, TickerType } from "@/common";
import { BaseDefProps } from "..";

export * from "./building"
export * from "./category"
export * from "./weapon"

export type ThingDefProps = {
    thingClass?: string;
    category?: string;
    drawerType?: DrawerType;
    drawGUIOverlay?: boolean;
    description?: string;
    altitudeLayer?: AltitudeLayer;
    alwaysHaulable?: boolean;
    tickerType?: TickerType;
    useHitPoints?: boolean;
    pathCost?: number;
    selectable?: boolean;
    rotatable?: boolean;
    techLevel?: TechLevel;
    uiIconScale?: number;
    allowedArchonexusCount?: number;
    stats?: Partial<ThingStats>;
} & BaseDefProps

export interface ThingStats extends Record<string, number | null | undefined> {
    Mass?: number;
    Beauty?: number;
    MarketValue?: number;
    MaxHitPoints?: number;
    Flammability?: number;
    SellPriceFactor?: number;
    DeteriorationRate?: number;
}