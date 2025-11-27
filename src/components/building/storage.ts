import { x, xls, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { ThingCategoryDefId, ThingDefId } from "@/defs";

export const StorageComponent = (props: StorageProps) => new SimpleComponent("StorageComponent", {
    props: [
        x("thingClass", "Building_Storage"),
        x("surfaceType", "Item"),
        x("canOverlapZones", props.canOverlapZones),
        x("inspectorTabs", [x("li", "ITab_Storage")]),
    ],
    setup: (def) => {
        const building = def.getOrCreate("building");
        building.mergeChildren(...xobj({
            preventDeteriorationOnTop: props.preventDeteriorationOnTop,
            ignoreStoredThingsBeauty: props.ignoreStoredThingsBeauty,
            maxItemsInCell: props.maxItemsInCell,
            storageGroupTag: props.storageGroupTag,
            blueprintClass: "Blueprint_Storage",
            fixedStorageSettings: props.fixedStorageSettings ? storageSettingsToXml(props.fixedStorageSettings) : undefined,
            defaultStorageSettings: props.defaultStorageSettings ? storageSettingsToXml(props.defaultStorageSettings) : undefined,
        }));
    }
});

function storageSettingsToXml(settings: StorageSettings) {
    return xobj({
        priority: settings.priority,
        filter: xobj({
            categories: xls(settings.filter?.categories),
            disallowedCategories: xls(settings.filter?.disallowedCategories),
            thingDefs: xls(settings.filter?.thingDefs),
            disallowedThingDefs: xls(settings.filter?.disallowedThingDefs),
            specialFiltersToDisallow: xls(settings.filter?.specialFiltersToDisallow),
        }),
    });
}

export interface StorageProps {
    canOverlapZones?: boolean;
    preventDeteriorationOnTop?: boolean;
    ignoreStoredThingsBeauty?: boolean;
    maxItemsInCell?: number;
    storageGroupTag?: string;
    fixedStorageSettings?: StorageSettings;
    defaultStorageSettings?: StorageSettings;
}

export interface StorageSettings {
    priority?: "Low" | "Normal" | "Preferred" | "Important" | "Critical";
    filter?: {
        categories?: ThingCategoryDefId[];
        disallowedCategories?: ThingCategoryDefId[];
        thingDefs?: ThingDefId[];
        disallowedThingDefs?: ThingDefId[];
        specialFiltersToDisallow?: string[];
    };
}
