import { BaseDefProps, DefNode, registerDef } from ".";
import type { HediffDefId } from "./vanilla";
import { Component } from "@/components";
import { ContextWithoutFunctions } from "@/utils";
import { x, xls, xobj } from "@/xml";

export const defineHediff = (context: ContextWithoutFunctions, props: HediffProps, components: Component[] = []): HediffDefId => {
    const nodes = xobj({
        description: props.description,
        hediffClass: props.hediffClass,
        defaultLabelColor: props.defaultLabelColor,
        labelNoun: props.labelNoun,
        labelNounPretty: props.labelNounPretty,
        initialSeverity: props.initialSeverity,
        maxSeverity: props.maxSeverity,
        lethalSeverity: props.lethalSeverity,
        tendable: props.tendable,
        isBad: props.isBad,
        chronic: props.chronic,
        priceImpact: props.priceImpact,
        priceOffset: props.priceOffset,
        scenarioCanAdd: props.scenarioCanAdd,
        makesSickThought: props.makesSickThought,
        causesNeed: props.causesNeed,
        displayWound: props.displayWound,
        keepOnBodyPartRestoration: props.keepOnBodyPartRestoration,
        everCurableByItem: props.everCurableByItem,
        countsAsAddedPartOrImplant: props.countsAsAddedPartOrImplant,
        forceRenderTreeRecache: props.forceRenderTreeRecache,
    });

    // Stages
    nodes.push(x("stages", xls(props.stages?.map(stage => xobj({
        label: stage.label,
        minSeverity: stage.minSeverity,
        lifeThreatening: stage.lifeThreatening,
        painOffset: stage.painOffset,
        painFactor: stage.painFactor,
        partEfficiencyOffset: stage.partEfficiencyOffset,
        forgetMemoryThoughtMtbDays: stage.forgetMemoryThoughtMtbDays,
        purgeMtbDays: stage.purgeMtbDays,
        deathMtbDays: stage.deathMtbDays,
        vomitMtbDays: stage.vomitMtbDays,
        becomeVisible: stage.becomeVisible,
        capMods: xls(stage.capMods?.map(cap => xobj({
            capacity: cap.capacity,
            offset: cap.offset,
            setMax: cap.setMax,
            postFactor: cap.postFactor,
        }))),
        statOffsets: xobj(stage.statOffsets),
        statFactors: xobj(stage.statFactors),
        mentalStateGivers: xls(stage.mentalStateGivers?.map(giver => xobj({
            mentalState: giver.mentalState,
            mtbDays: giver.mtbDays,
        }))),
        hediffGivers: xls(stage.hediffGivers?.map(giver => xobj({
            hediff: giver.hediff,
            mtbDays: giver.mtbDays,
            partsToAffect: xls(giver.partsToAffect),
        }))),
    })
    ))));

    // Injury props
    nodes.push(x("injuryProps", xobj({
        painPerSeverity: props.injuryProps?.painPerSeverity,
        averagePainPerSeverityPermanent: props.injuryProps?.averagePainPerSeverityPermanent,
        bleedRate: props.injuryProps?.bleedRate,
        canMerge: props.injuryProps?.canMerge,
        destroyedLabel: props.injuryProps?.destroyedLabel,
        destroyedOutLabel: props.injuryProps?.destroyedOutLabel,
    })));

    // Adding props
    nodes.push(x("addedPartProps", xobj({
        solid: props.addedPartProps?.solid,
        partEfficiency: props.addedPartProps?.partEfficiency,
        betterThanNatural: props.addedPartProps?.betterThanNatural,
    })));

    return registerDef(context, new DefNode("HediffDef", {
        name: props.name,
        label: props.label,
        contents: nodes,
        components,
    }));
};

/**
 * Defines a health condition (hediff) for pawns.
 * 
 * HediffDefs represent injuries, diseases, implants, addictions, and any other condition
 * that can be attached to a body part or affect a pawn's health.
 * 
 * @example
 * ```typescript
 * // Simple injury
 * ctx.defineHediff({
 *   name: "Burn",
 *   label: "burn",
 *   description: "A burn injury.",
 *   hediffClass: "Hediff_Injury",
 *   tendable: true,
 *   displayWound: true,
 *   injuryProps: {
 *     painPerSeverity: 0.01875,
 *     bleedRate: 0.02
 *   }
 * });
 * 
 * // Disease with stages
 * ctx.defineHediff({
 *   name: "Flu",
 *   label: "flu",
 *   description: "A flu infection.",
 *   makesSickThought: true,
 *   stages: [
 *     { label: "minor", minSeverity: 0.0 },
 *     { label: "major", minSeverity: 0.5, vomitMtbDays: 0.5 },
 *     { label: "extreme", minSeverity: 0.8, deathMtbDays: 6 }
 *   ]
 * });
 * ```
 */
export interface HediffProps extends BaseDefProps {
    /**
     * Description of this health condition
     */
    description?: string;

    /**
     * C# class that implements this hediff's behavior
     * @default "Hediff"
     * @example "Hediff_Injury"
     * @example "Hediff_MissingPart"
     * @example "Hediff_Implant"
     * @example "Hediff_Addiction"
     */
    hediffClass?: string;

    /**
     * Default color for displaying this hediff in the UI
     * @example "(0.5, 0.5, 0.5)" - gray
     * @example "(1, 0, 0)" - red
     */
    defaultLabelColor?: string;

    /**
     * Noun form of the label
     * @example "a burn"
     * @example "an infection"
     */
    labelNoun?: string;

    /**
     * Formatted label with body part
     * @example "burn in the {1}"
     * @example "missing a {1}"
     */
    labelNounPretty?: string;

    /**
     * Initial severity when first applied
     * @default 0.5
     * @example 1.0
     */
    initialSeverity?: number;

    /**
     * Maximum severity this hediff can reach
     * @default 1.0
     * @example 5.0
     */
    maxSeverity?: number;

    /**
     * Severity at which this hediff kills the pawn
     * @example 1.0
     * @example -1 (never lethal)
     */
    lethalSeverity?: number;

    /**
     * Whether this hediff can be tended by doctors
     * @default false
     */
    tendable?: boolean;

    /**
     * Whether this is generally a bad hediff
     * @default false
     */
    isBad?: boolean;

    /**
     * Whether this is a chronic (permanent) condition
     * @default false
     */
    chronic?: boolean;

    /**
     * Whether this affects pawn market value
     * @default false
     */
    priceImpact?: boolean;

    /**
     * Fixed price offset from this hediff
     */
    priceOffset?: number;

    /**
     * Whether this can be added in scenario editor
     * @default true
     */
    scenarioCanAdd?: boolean;

    /**
     * Whether this makes pawns have sick thoughts
     * @default false
     */
    makesSickThought?: boolean;

    /**
     * Need caused by this hediff
     * @example "Chemical_Luciferium"
     */
    causesNeed?: string;

    /**
     * Whether to display wound visuals
     * @default false
     */
    displayWound?: boolean;

    /**
     * Whether to keep this hediff when the body part is restored
     * @default false
     */
    keepOnBodyPartRestoration?: boolean;

    /**
     * Whether this can ever be cured by an item
     * @default true
     */
    everCurableByItem?: boolean;

    /**
     * Whether this counts as an added part or implant
     * @default false
     */
    countsAsAddedPartOrImplant?: boolean;

    /**
     * Whether to force recache of the pawn render tree
     * @default false
     */
    forceRenderTreeRecache?: boolean;

    /**
     * Stages of this hediff (for progressive conditions)
     */
    stages?: HediffStage[];

    /**
     * Injury-specific properties
     */
    injuryProps?: InjuryProps;

    /**
     * Added part/implant properties
     */
    addedPartProps?: AddedPartProps;
}

/**
 * A stage of a progressive hediff
 */
export interface HediffStage {
    /**
     * Label for this stage
     * @example "minor"
     * @example "major"
     * @example "extreme"
     */
    label?: string;

    /**
     * Minimum severity to reach this stage
     * @example 0.0
     * @example 0.5
     * @example 0.8
     */
    minSeverity?: number;

    /**
     * Whether this stage is life-threatening
     * @default false
     */
    lifeThreatening?: boolean;

    /**
     * Pain added at this stage
     * @example 0.1
     * @example 0.5
     */
    painOffset?: number;

    /**
     * Pain multiplier at this stage
     * @example 1.5
     * @example 2.0
     */
    painFactor?: number;

    /**
     * Efficiency offset for the affected body part
     * @example -0.5 (50% less efficient)
     */
    partEfficiencyOffset?: number;

    /**
     * Mean time between forgetting thoughts (in days)
     * @example 0.5
     */
    forgetMemoryThoughtMtbDays?: number;

    /**
     * Mean time between purging attempts (in days)
     * @example 2
     */
    purgeMtbDays?: number;

    /**
     * Mean time between death checks (in days)
     * @example 6
     */
    deathMtbDays?: number;

    /**
     * Mean time between vomiting (in days)
     * @example 0.5
     */
    vomitMtbDays?: number;

    /**
     * Whether hediff becomes visible at this stage
     * @default true
     */
    becomeVisible?: boolean;

    /**
     * Capacity modifications at this stage
     */
    capMods?: CapacityModifier[];

    /**
     * Stat offsets at this stage
     * @example { MoveSpeed: -0.1 }
     */
    statOffsets?: Record<string, number>;

    /**
     * Stat multipliers at this stage
     * @example { WorkSpeedGlobal: 0.8 }
     */
    statFactors?: Record<string, number>;

    /**
     * Mental state givers at this stage
     */
    mentalStateGivers?: MentalStateGiver[];

    /**
     * Hediff givers at this stage (apply other hediffs)
     */
    hediffGivers?: HediffGiver[];
}

/**
 * Capacity modifier for a hediff stage
 */
export interface CapacityModifier {
    /**
     * Capacity to modify
     * @example "Consciousness"
     * @example "Moving"
     * @example "Sight"
     */
    capacity: string;

    /**
     * Offset to apply
     * @example -0.1
     */
    offset?: number;

    /**
     * Maximum cap to set
     * @example 0.5
     */
    setMax?: number;

    /**
     * Multiplier to apply after other calculations
     * @example 0.8
     */
    postFactor?: number;
}

/**
 * Mental state giver for hediff stages
 */
export interface MentalStateGiver {
    /**
     * Mental state to give
     * @example "Berserk"
     * @example "Wander_Psychotic"
     */
    mentalState: string;

    /**
     * Mean time between mental breaks (in days)
     * @example 0.5
     */
    mtbDays: number;
}

/**
 * Hediff giver for hediff stages
 */
export interface HediffGiver {
    /**
     * Hediff to apply
     */
    hediff: HediffDefId | string;

    /**
     * Mean time between applications (in days)
     * @example 2.0
     */
    mtbDays: number;

    /**
     * Body parts to affect
     * @example ["Brain"]
     */
    partsToAffect?: string[];
}

/**
 * Properties specific to injury hediffs
 */
export interface InjuryProps {
    /**
     * Pain per point of severity
     * @example 0.0125
     * @example 0.01875
     */
    painPerSeverity?: number;

    /**
     * Average pain per severity for permanent injuries
     * @example 0.00625
     */
    averagePainPerSeverityPermanent?: number;

    /**
     * Bleeding rate per severity
     * @example 0.02
     * @example 0.06
     */
    bleedRate?: number;

    /**
     * Whether similar injuries can merge together
     * @default false
     */
    canMerge?: boolean;

    /**
     * Label when body part is destroyed
     * @example "Destroyed"
     * @example "Burned off"
     * @example "Crushed"
     */
    destroyedLabel?: string;

    /**
     * Label when internal part is destroyed
     * @example "Destroyed out"
     * @example "Burned out"
     */
    destroyedOutLabel?: string;
}

/**
 * Properties for added parts and implants
 */
export interface AddedPartProps {
    /**
     * Whether this is a solid part
     * @default false
     */
    solid?: boolean;

    /**
     * Efficiency of the added part (1.0 = 100%)
     * @example 1.0
     * @example 1.25 (bionic - better than natural)
     */
    partEfficiency?: number;

    /**
     * Whether this is better than a natural part
     * @default false
     */
    betterThanNatural?: boolean;
}
