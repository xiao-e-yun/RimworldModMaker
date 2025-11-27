import { x, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { ForbiddableComponent } from "../weapon";
import { SoundDefId } from "@/defs";

export const DoorComponent = (props?: DoorProps) => new SimpleComponent("DoorComponent", {
    props: [
        x("thingClass", "Building_Door"),
        x("altitudeLayer", "DoorMoveable"),
        x("drawerType", "RealtimeOnly"),
        x("tickerType", "Normal"),
        x("holdsRoof", "true"),
        x("blockLight", "true"),
        x("blockWind", "true"),
    ],
    setup: (def) => {
        // Add forbiddable comp with allowNonPlayer
        ForbiddableComponent({ allowNonPlayer: true }).modify(def);

        const building = def.getOrCreate("building");
        building.mergeChildren(...xobj({
            isInert: true,
            canPlaceOverWall: props?.canPlaceOverWall ?? true,
            blueprintClass: "Blueprint_Door",
            soundDoorOpenPowered: props?.soundDoorOpenPowered,
            soundDoorClosePowered: props?.soundDoorClosePowered,
            soundDoorOpenManual: props?.soundDoorOpenManual,
            soundDoorCloseManual: props?.soundDoorCloseManual,
            roamerCanOpen: props?.roamerCanOpen,
            isStuffableAirtight: props?.isStuffableAirtight,
        }));
    }
});

export interface DoorProps {
    canPlaceOverWall?: boolean;
    soundDoorOpenPowered?: SoundDefId;
    soundDoorClosePowered?: SoundDefId;
    soundDoorOpenManual?: SoundDefId;
    soundDoorCloseManual?: SoundDefId;
    roamerCanOpen?: boolean;
    isStuffableAirtight?: boolean;
}
