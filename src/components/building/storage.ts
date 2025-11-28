import { xls, xobj } from "@/xml";
import { SimpleComponent } from "..";
import { ThingCategoryDefId, ThingDefId } from "@/defs";

export const StorageComponent = (props: StorageProps) => new SimpleComponent("StorageComponent", {
    props: xobj({
        thingClass: "Building_Storage",
        surfaceType: "Item",
        inspectorTabs: xls(["ITab_Storage"]),
        canOverlapZones: props.canOverlapZones,
        building: xobj({
            preventDeteriorationOnTop: props.preventDeteriorationOnTop,
            ignoreStoredThingsBeauty: props.ignoreStoredThingsBeauty,
            maxItemsInCell: props.maxItemsInCell,
            storageGroupTag: props.storageGroupTag,
            blueprintClass: "Blueprint_Storage",
            fixedStorageSettings: props.fixedStorageSettings && storageSettingsToXml(props.fixedStorageSettings),
            defaultStorageSettings: props.defaultStorageSettings && storageSettingsToXml(props.defaultStorageSettings),
        }),
    }),
});

const storageSettingsToXml = (settings: StorageSettings) => xobj({
    priority: settings.priority,
    filter: xobj({
        categories: xls(settings.filter?.categories),
        disallowedCategories: xls(settings.filter?.disallowedCategories),
        thingDefs: xls(settings.filter?.thingDefs),
        disallowedThingDefs: xls(settings.filter?.disallowedThingDefs),
        specialFiltersToDisallow: xls(settings.filter?.specialFiltersToDisallow),
    }),
});

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
