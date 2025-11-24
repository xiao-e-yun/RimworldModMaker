import { xobj } from "@/xml";

export const xDependency = (dependency: ModDependency) => {
    return xobj({
        steamWorkshopUrl: dependency.steamWorkshopUrl,
        displayName: dependency.displayName,
        packageId: dependency.packageId,
    });
}

export interface ModDependency {
    steamWorkshopUrl: string;
    displayName: string;
    packageId: string;
}