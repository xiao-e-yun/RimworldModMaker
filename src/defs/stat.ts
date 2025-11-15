import {
    BaseDefProps,
    registerDef,
    includeBaseDef,
    StatDefId
} from ".";
import { ContextWithoutFunctions,x, xls } from "@/utils"

export const defineStat = (context: ContextWithoutFunctions, props: StatProps): StatDefId => {
    return registerDef(context, x("StatDef", [
        ...includeBaseDef(props),
        x("description", props.description),
        x("category", props.category),

        x("defaultBaseValue", props.value.default),
        x("minValue", props.value.min),
        x("maxValue", props.value.max),
        x("toStringStyle", props.value.style),

        x("showIfModsLoaded", xls(props.show?.modsLoaded)),
        x("showIfUndefined", props.show?.undefined),
        x("showOnAnimals", props.show?.animals),
        x("showOnEntities", props.show?.entities),
        x("showOnDrones", props.show?.drones),
        x("showDevelopmentalStageFilter", props.show?.developmentalStageFilter),

        x("hideAtValue", props.hideAtValue),
        x("scenarioRandomizable", props.scenarioRandomizable),
        x("displayPriorityInCategory", props.displayPriorityInCategory),
    ]))
}


export interface StatProps extends BaseDefProps {
    description: string;
    category: string;
    value: {
        min?: number;
        max?: number;
        default: number;
        style?: ToStringStyle;
    },
    show: Partial<{
        modsLoaded?: string[];
        undefined?: boolean;
        animals?: boolean;
        entities?: boolean;
        drones?: boolean;
        developmentalStageFilter?: string;
    }>,
    hideAtValue?: number;
    scenarioRandomizable?: boolean;
    displayPriorityInCategory?: number;
}

export enum ToStringStyle {
    FloatMaxOne = "FloatMaxOne",
    FloatMaxThree = "FloatMaxThree",
    FloatMaxTwo = "FloatMaxTwo",
    FloatOne = "FloatOne",
    FloatTwo = "FloatTwo",
    FloatTwoOrThree = "FloatTwoOrThree",
    Integer = "Integer",
    Money = "Money",
    PercentOne = "PercentOne",
    PercentTwo = "PercentTwo",
    PercentZero = "PercentZero",
    Temperature = "Temperature",
    TemperatureOffset = "TemperatureOffset",
    WorkAmount = "WorkAmount",
}