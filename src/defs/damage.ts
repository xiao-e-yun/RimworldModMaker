import { BaseDefProps, DamageArmorCategoryDefId, includeBaseDef, registerDef } from ".";
import { ContextWithoutFunctions, toVec, x } from "@/utils";

export const defineDamage = (context: ContextWithoutFunctions, props: DamageProps): DamageArmorCategoryDefId => {
    const explosion = props.behavior?.explosion && typeof props.behavior.explosion === 'object' ? props.behavior.explosion : null;

    const nodes = [
        ...includeBaseDef(props),
        x("workerClass", props.workerClass),
    ];

    if (props.messages) {
        const messages = props.messages;
        nodes.push(
            x("description", messages.description),
            x("deathMessage", messages.death),
            x("combatLogRules", messages.combat),
        );
    }

    if (props.health) {
        const health = props.health;
        nodes.push(
            x("hediff", health.hediff),
            x("hediffSolid", health.hediffSolid),
            x("harmAllLayersUntilOutside", health.harmAllLayersUntilOutside),
        );
    }

    if (props.effects) {
        const effects = props.effects;
        nodes.push(x("impactSoundType", effects.impactSoundType));
        if (props.behavior.explosion && effects.explosion) nodes.push(
            x("soundExplosion", effects.explosion.sound),
            x("explosionColorCenter", toVec(effects.explosion.colorCenter)),
            x("explosionColorEdge", toVec(effects.explosion.colorEdge)),
            x("explosionCellFleck", effects.explosion.cellFleck),
        );
    }

    if (props.armor) {
        const armor = props.armor;
        nodes.push(
            x("armorCategory", armor.category),
            x("defaultArmorPenetration", armor.defaultPenetration)
        );
    }

    if (props.damage) {
        const damage = props.damage;
        nodes.push(
            x("defaultDamage", damage.default),
            x("defaultStoppingPower", damage.defaultStopping),
            x("overkillPctToDestroyPart", damage.overkillPctToDestroyPart),
            x("minDamageToFragment", damage.minToFragment),
        );
    }

    if (props.environmentFactors) {
        const env = props.environmentFactors;
        nodes.push(
            x("buildingDamageFactorImpassable", env.buildingImpassable),
            x("buildingDamageFactorPassable", env.buildingPassable),
            x("plantDamageFactor", env.plant),
            x("corpseDamageFactor", env.corpse),
        );
    }

    if (props.behavior) {
        const behavior = props.behavior;
        nodes.push(
            x("isRanged", behavior.ranged),
            x("makesAnimalsFlee", behavior.animalsFlee),
            x("hasForcefulImpact", behavior.forcefulImpact),
            x("externalViolence", behavior.externalViolence),
        );
        if (explosion) nodes.push(
            x("isExplosive", true),
            x("explosionAffectOutsidePartsOnly", explosion.affectOutsidePartsOnly),
            x("explosionPropagationSpeed", explosion.propagationSpeed),
            x("explosionHeatEnergyPerCell", explosion.heatEnergyPerCell),
        );
    }

    return registerDef(context, x("DamageDef", nodes));
}

/**
 * damage configuration
 */
export interface DamageProps extends BaseDefProps {

    /**
     * Damage worker class - defines how damage is applied to targets
     * @example "DamageWorker_*"
     */
    workerClass?: string;

    /**
     * Message configuration
     */
    messages?: Partial<{
        /**
         * Description
         */
        description?: string;

        /**
          * Death message
          * @description {0} will be replaced with the deceased's name
          * @example "{0} has been shot to death by an arrow."
          */
        death: string;

        /**
         * Combat log rules - defines how this damage is displayed in combat log
         * @example "Damage_Bomb"
         */
        combat: string;
    }>

    /**
     * Health effect configuration
     */
    health?: {
        /**
         * Wound type - applied to living beings
         * @reference HediffDef
         */
        hediff?: string;

        /**
         * Solid damage type - applied to hard materials like bones and walls
         * @reference HediffDef
         */
        hediffSolid?: string;

        /**
         * Harm all layers until outside
         * @description `true` means it will penetrate all body part layers until the outer layer
         */
        harmAllLayersUntilOutside?: boolean;
    };

    /**
     * Audio and visual effects configuration
     */
    effects?: {
        /**
         * Impact sound type
         * @example "Bullet"
         * @example "Blunt"
         * @example "Soft"
         */
        impactSoundType?: string;

        /**
         * Explosion properties configuration  
         * If `behavior.explosion` is defined, these visual effects will be used
         */
        explosion?: {
            /**
             * Explosion sound - sound definition for explosive damage
             * @example "Explosion_Bomb"
             */
            sound: string;

            /**
             * Explosion center color - RGB format
             * @example "[1, 0.5, 0.3]"
             */
            colorCenter: [number, number, number];

            /**
             * Explosion edge color - RGB format
             * @example "[0.6, 0.5, 0.4]"
             */
            colorEdge: [number, number, number];

            /**
             * Explosion cell fleck - particle effect displayed during explosion
             * @example "BlastDry"
             * @example "Fleck_Vaporize"
             */
            cellFleck: string;
        }
    };

    /**
     * Armor and penetration configuration
     */
    armor?: Partial<{
        /**
         * Armor category - determines which armor can defend against this damage
         * @example "Sharp"
         * @example "Blunt"
         * @example "Heat"
         * @reference DamageArmorCategoryDef
         */
        category: string;

        /**
         * Default armor penetration
         * @description Between 0-1, higher values penetrate armor more easily
         */
        defaultPenetration: number;
    }>

    /**
     * Damage values configuration
     */
    damage?: Partial<{
        /**
         * Default damage value - base damage amount
         * @example 50
         * @example 800
         */
        default: number;

        /**
         * Default stopping power - affects target knockdown probability
         * @example 0.5
         * @example 1.5
         */
        defaultStopping: number;

        /**
         * Overkill percentage to destroy part - range value
         * @description Determines probability of destroying body parts when overkill occurs
         * @example "0~0.7"
         */
        overkillPctToDestroyPart: string;

        /**
         * Minimum damage to fragment - no fragmentation effect below this value
         * @example 15
         */
        minToFragment: number;
    }>;

    /**
     * Building and environment damage configuration
    */
    environmentFactors?: Partial<{
        /**
         * Impassable building damage factor
         * @description Damage multiplier for impassable buildings like walls
         */
        buildingImpassable: number;

        /**
         * Passable building damage factor
         * @description Damage multiplier for passable buildings like doors
         */
        buildingPassable: number;

        /**
         * Plant damage factor - damage multiplier for plants
         */
        plant: number;

        /**
         * Corpse damage factor - damage multiplier for corpses
         */
        corpse: number;
    }>

    /**
     * Behavior configuration
     */
    behavior: {
        /**
         * Is ranged damage - marks as ranged attack
         */
        ranged: boolean;

        /**
         * Makes animals flee - this damage will scare away animals
         */
        animalsFlee: boolean;

        /**
         * Has forceful impact - produces powerful physical impact effect
         */
        forcefulImpact: boolean;


        /**
         * Is external violence - marks as external violence source
         */
        externalViolence: boolean;

        /**
         * Explosion properties configuration
         * Is explosive - marks as explosive damage
         */
        explosion?: {
            /**
             * Explosion affects outside parts only
             * @description true means explosion only damages exposed body parts
             */
            affectOutsidePartsOnly: boolean;

            /**
             * Explosion propagation speed - controls explosion spread speed
             * @example 0.3
             */
            propagationSpeed: number;

            /**
             * Explosion heat energy per cell - heat generated per affected cell
             * @warning Typo fixed: "expolosionPropagationSpeed" to "explosionPropagationSpeed"
             */
            heatEnergyPerCell: number;
        } | false
    }
}

export const defineDamageArmorCategory = (context: ContextWithoutFunctions, props: DamageArmorCategoryProps): DamageArmorCategoryDefId => {
    return registerDef(context, x("DamageArmorCategoryDef", [
        x("defName", props.name),
        x("multStat", props.multStat),
        x("armorRatingStat", props.armorRatingStat),
    ]));
};

export interface DamageArmorCategoryProps {
    name: string;
    /**
     * @example "BluntDamageMultiplier"
     */
    multStat?: string;
    /**
     * The armor rating stat associated with this category
     *  gives the armor value for this category
     * @example "ArmorRating_Blunt"
     * @used ThingDef.statBases[armorRatingStat]
     */
    armorRatingStat: string;
}