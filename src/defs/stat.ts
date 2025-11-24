import {
    BaseDefProps,
    registerDef,
    StatDefId,
    DefNode
} from ".";
import { ContextWithoutFunctions, xls, xobj } from "@/utils"

export const defineStat = (context: ContextWithoutFunctions, props: StatProps): StatDefId => {
    return registerDef(context, new DefNode("StatDef", {
        name: props.name,
        label: props.label,
        contents: xobj({
            description: props.description,
            category: props.category,
            defaultBaseValue: props.value.default,
            minValue: props.value.min,
            maxValue: props.value.max,
            toStringStyle: props.value.style,
            showIfModsLoaded: xls(props.show?.modsLoaded),
            showIfUndefined: props.show?.undefined,
            showOnAnimals: props.show?.animals,
            showOnEntities: props.show?.entities,
            showOnDrones: props.show?.drones,
            showDevelopmentalStageFilter: props.show?.developmentalStageFilter,
            hideAtValue: props.hideAtValue,
            scenarioRandomizable: props.scenarioRandomizable,
            displayPriorityInCategory: props.displayPriorityInCategory,
        })
    }))
};

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