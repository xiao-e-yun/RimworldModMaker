import { xls, xobj } from "@/xml"
import { CompComponent } from ".."
import { ThingDefId } from "@/defs";

export const RefuelableComponent = (props: RefuelableProps) => new CompComponent("CompProperties_Refuelable", {
    isExtends: true,
    props: xobj({
        fuelLabel: props.label,
        fuelCapacity: props.capacity,
        fuelFilter: xobj({
            thingDefs: xls(props.fuelFilter)
        }),
        fuelConsumptionRate: props.consumptionRate,
        initialFuelPercent: props.initialFuelPercent,
        showAllowAutoRefuelToggle: props.showAllowAutoRefuelToggle,
        externalTicking: props.externalTicking,
        autoRefuelPercent: props.autoRefuelPercent,
        canEjectFuel: props.canEjectFuel,
    })
})

export interface RefuelableProps {
    label: string;
    capacity: number;
    fuelFilter: ThingDefId[];
    consumptionRate?: number;
    initialFuelPercent?: number;
    showAllowAutoRefuelToggle?: boolean;
    externalTicking?: boolean;
    autoRefuelPercent?: number;
    canEjectFuel?: boolean;
}