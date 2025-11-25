import { xls, xobj } from "@/xml";
import { CompComponent } from "..";
import { ResearchProjectDefId, SoundDefId } from "@/defs";

export const FlickableComponent = () => new CompComponent("CompProperties_Flickable", {
    isExtends: true,
})


export const PowerComponent = (props: PowerConsumerProps | PowerGeneratorProps) => {
    const nodes = xobj(props.type === "CompPowerTrader" ? {
        idlePowerDraw: props.idlePowerDraw,
        alwaysDisplayAsUsingPower: props.alwaysDisplayAsUsingPower,
        powerUpgrades: xls(props.powerUpgrades?.map(xobj)),
    } : {
        transmitsPower: props.transmitsPower,
        soundAmbientProducingPower: props.soundAmbientProducingPower,
    });
    new CompComponent("CompProperties_Power", {
        isExtends: true,
        props: [
            xobj({
                type: props.type,
                baseConsumption: props.baseConsumption,
                shortCircuitInRain: props.shortCircuitInRain,
            }),
            nodes,
        ].flat()
    })
}

export interface CommonPowerProps {
    baseConsumption: number;
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
