import { CompComponent } from ".";
import { x } from "@/utils";

export const TendDurationComponent = (
    tendedWell: string,
    tendedWellInner: string,
    labelSolidTendedWell: string,
) => new CompComponent("HediffCompProperties_TendDuration", {
    isExtends: true,
    props: [
        x("labelTendedWell", tendedWell),
        x("labelTendedWellInner", tendedWellInner),
        x("labelSolidTendedWell", labelSolidTendedWell),
    ]
});
export const InfecterComponent = () => new CompComponent("HediffCompProperties_Infecter", { isExtends: true });
export const GetsPermanentComponent = (label: string) => new CompComponent("HediffCompProperties_GetsPermanent", { isExtends: true, props: [x("permanentLabel", label)] });
