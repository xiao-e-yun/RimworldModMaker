import { xobj } from "@/xml";
import { SimpleComponent } from "..";
import { SoundDefId } from "@/defs";
import { AltitudeLayer, DrawerType, TickerType } from "@/common";

export const DoorComponent = (props?: DoorProps) => new SimpleComponent("DoorComponent", {
    props: xobj({
        "thingClass": "Building_Door",
        "altitudeLayer": AltitudeLayer.Building,
        "drawerType": DrawerType.RealtimeOnly,
        "tickerType": TickerType.Normal,
        "holdsRoof": true,
        "blockLight": true,
        "blockWind": true,
        "building": xobj({
            isInert: true,
            canPlaceOverWall: props?.canPlaceOverWall ?? true,
            blueprintClass: "Blueprint_Door",
            soundDoorOpenPowered: props?.soundDoorOpenPowered,
            soundDoorClosePowered: props?.soundDoorClosePowered,
            soundDoorOpenManual: props?.soundDoorOpenManual,
            soundDoorCloseManual: props?.soundDoorCloseManual,
            roamerCanOpen: props?.roamerCanOpen,
            isStuffableAirtight: props?.isStuffableAirtight,
        })
    }),
    required: ["CompProperties_Forbiddable"]
});

export interface DoorProps {
    canPlaceOverWall?: boolean;
    soundDoorOpenPowered?: SoundDefId;
    soundDoorClosePowered?: SoundDefId;
    soundDoorOpenManual?: SoundDefId;
    soundDoorCloseManual?: SoundDefId;
    isStuffableAirtight?: boolean;
    roamerCanOpen?: boolean;
    openSpeed?: number;
}
