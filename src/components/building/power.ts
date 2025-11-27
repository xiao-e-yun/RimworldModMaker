import { xls, xobj } from "@/xml";
import { CompComponent } from "..";
import { ResearchProjectDefId, SoundDefId } from "@/defs";

export const BreakdownableComponent = () => new CompComponent("CompProperties_Breakdownable", {
    isExtends: true,
})

export const PowerComponent = (props: PowerConsumerProps | PowerGeneratorProps) => {
    const typeSpecificProps = props.type === "CompPowerTrader" ? xobj({
        idlePowerDraw: props.idlePowerDraw,
        alwaysDisplayAsUsingPower: props.alwaysDisplayAsUsingPower,
        powerUpgrades: xls(props.powerUpgrades?.map(xobj)),
    }) : xobj({
        transmitsPower: props.transmitsPower,
        soundAmbientProducingPower: props.soundAmbientProducingPower,
    });
    return new CompComponent("CompProperties_Power", {
        isExtends: true,
        props: [
            ...xobj({
                compClass: props.type,
                basePowerConsumption: props.basePowerConsumption,
                shortCircuitInRain: props.shortCircuitInRain,
            }),
            ...typeSpecificProps,
        ]
    })
}

export interface CommonPowerProps {
    basePowerConsumption: number;
    shortCircuitInRain?: boolean;
}

export interface PowerConsumerProps extends CommonPowerProps {
    type: "CompPowerTrader",
    idlePowerDraw?: number;
    alwaysDisplayAsUsingPower?: boolean;
    powerUpgrades?: {
        researchProject: ResearchProjectDefId;
        factor: number;
    }[]
}

export interface PowerGeneratorProps extends CommonPowerProps {
    type: "CompPowerPlant",
    transmitsPower?: boolean;
    soundAmbientProducingPower?: SoundDefId;
}
