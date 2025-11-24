import { SimpleComponent } from "../";
import { toVec, x, xobj } from "@/utils";

export const GraphicComponent = (props: GraphicProps) => new SimpleComponent("GraphicComponent", {
  props: [getGraphicNode("graphicData", props)],
})

export const getGraphicNode = (name: string, props: GraphicProps) => x(name, xobj({
  texPath: props.textures,
  maskPath: props.masks,
  graphicClass: props.graphic,
  shaderType: props.shader,
  drawSize: Array.isArray(props?.scale) ? toVec(props.scale) : props.scale,
  drawOffsetNorth: props.offset?.north,
  drawOffsetEast: props.offset?.east,
  drawOffsetSouth: props.offset?.south,
  drawOffsetWest: props.offset?.west,
  onGroundRandomRotateAngle: props.dropRandomlyRotated,
  drawRotated: props.drawRotated,
  allowFlip: props.allowFlip,
}))

export interface GraphicProps {
  textures: string,
  masks?: string,
  graphic: GraphicType,
  props?: GraphicProps
}

export interface GraphicProps {
  shader?: ShaderType;
  scale?: number | [number, number];
  offset?: {
    north?: [number, number, number]
    east?: [number, number, number]
    south?: [number, number, number]
    west?: [number, number, number]
  }
  dropRandomlyRotated?: number;
  drawRotated?: boolean;
  allowFlip?: boolean;
}

export enum GraphicType {
  MoteRandomWithAgeSecs = "GraphicMote_RandomWithAgeSecs",
  Appearances = "Graphic_Appearances",
  Cluster = "Graphic_Cluster",
  ClusterTight = "Graphic_ClusterTight",
  Fleck = "Graphic_Fleck",
  FleckPulse = "Graphic_FleckPulse",
  FleckSplash = "Graphic_FleckSplash",
  Flicker = "Graphic_Flicker",
  Genepack = "Graphic_Genepack",
  MealVariants = "Graphic_MealVariants",
  Mote = "Graphic_Mote",
  MoteRandom = "Graphic_MoteRandom",
  MoteWithAgeSecs = "Graphic_MoteWithAgeSecs",
  MoteWithParentRotation = "Graphic_MoteWithParentRotation",
  Multi = "Graphic_Multi",
  PawnBodySilhouette = "Graphic_PawnBodySilhouette",
  Random = "Graphic_Random",
  Single = "Graphic_Single",
  StackCount = "Graphic_StackCount",
}

export enum ShaderType {
  AdditiveChangeHue = "AdditiveChangeHue",
  Cutout = "Cutout",
  CutoutAnimated = "CutoutAnimated",
  CutoutComplex = "CutoutComplex",
  CutoutFlying = "CutoutFlying",
  CutoutFlying01 = "CutoutFlying01",
  CutoutPlant = "CutoutPlant",
  CutoutSkin = "CutoutSkin",
  CutoutWithOverlay = "CutoutWithOverlay",
  EdgeDetect = "EdgeDetect",
  GlowAnimated = "GlowAnimated",
  Lightshaft = "Lightshaft",
  Mote = "Mote",
  MoteApocritonPulse = "MoteApocritonPulse",
  MoteBeam = "MoteBeam",
  MoteBouncing = "MoteBouncing",
  MoteBouncingRotating = "MoteBouncingRotating",
  MoteChargingPulse = "MoteChargingPulse",
  MoteCircularSparks = "MoteCircularSparks",
  MoteDistorted = "MoteDistorted",
  MoteGlow = "MoteGlow",
  MoteGlowCircularScrolling = "MoteGlowCircularScrolling",
  MoteGlowDistortBackground = "MoteGlowDistortBackground",
  MoteGlowDistorted = "MoteGlowDistorted",
  MoteGlowParentRotation = "MoteGlowParentRotation",
  MoteGlowPulse = "MoteGlowPulse",
  MoteHeatDiffusion = "MoteHeatDiffusion",
  MoteHellfireCannon_Aim = "MoteHellfireCannon_Aim",
  MoteHellfireCannon_Charge = "MoteHellfireCannon_Charge",
  MoteHellfireCannon_Target = "MoteHellfireCannon_Target",
  MoteLargeDistortionWave = "MoteLargeDistortionWave",
  MoteMechGestatorGlow = "MoteMechGestatorGlow",
  MoteMultiplyAddCircular = "MoteMultiplyAddCircular",
  MoteMultiplyAddCircularGrayscale = "MoteMultiplyAddCircularGrayscale",
  MoteMultiplyAddScroll = "MoteMultiplyAddScroll",
  MoteMultiplyCircularGrayscale = "MoteMultiplyCircularGrayscale",
  MotePawnBodyColor = "MotePawnBodyColor",
  MotePawnBodyGlow = "MotePawnBodyGlow",
  MotePollutionPump = "MotePollutionPump",
  MotePsychicConditionCauser = "MotePsychicConditionCauser",
  MotePsychicSkipFlash = "MotePsychicSkipFlash",
  MotePsychicSkipInner = "MotePsychicSkipInner",
  MotePsychicSkipRing = "MotePsychicSkipRing",
  MotePsychicWarmupNeuroquake = "MotePsychicWarmupNeuroquake",
  MoteSoftScannerGlow = "MoteSoftScannerGlow",
  MoteSubcoreEncoder = "MoteSubcoreEncoder",
  MoteWater = "MoteWater",
  PawnSilhouetteStencil = "PawnSilhouetteStencil",
  PawnSilhouetteStencilColorAnimated = "PawnSilhouetteStencilColorAnimated",
  RitualGlow = "RitualGlow",
  RitualGlowSingleRay = "RitualGlowSingleRay",
  RitualOutline = "RitualOutline",
  RitualSmoke = "RitualSmoke",
  RitualSmokeNoMask = "RitualSmokeNoMask",
  Transparent = "Transparent",
  TransparentAnimated = "TransparentAnimated",
  TransparentBelowSnow = "TransparentBelowSnow",
  TransparentPlant = "TransparentPlant",
  TransparentPostLight = "TransparentPostLight",
  TransparentShaking = "TransparentShaking",
}
