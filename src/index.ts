import { camelCase, chain } from "lodash";
import { bindContext, $console, Context, CONTEXT_BINDINGS } from "@/utils";
import { x, xls, xobj } from "@/xml";
import { existsSync, rmdirSync } from "fs";
import path from "path";
import { ModDependency, xDependency } from "./common/mod";

export * from "@/defs"
export * from "@/components"
export * from "@/common"
export * from "@/utils"

export function defineMod(
    options: ModOptions,
    setup: (ctx: Context) => void,
) {
    const context: Context = bindContext({
        appSettings: {
            id: options.id,
            pretty: !!options.pretty,
            outputPath: options.output || `./output/${options.id}`,
        },
        packageId: camelCase(Array.isArray(options.author) ? options.author[0] : options.author) + "." + camelCase(options.id),
        defsTree: {},
        assets: {},
        requiredRuntime: false,
        dependencies: new Map<string, ModDependency>(),
    }, CONTEXT_BINDINGS)

    cleanupOutput(context, options);

    $console.log(`Setting up mod...`);
    setup(context);

    $console.log(`Building mod: ${options.name} (${options.id})`);
    const modDependencies = Array.from(context.dependencies.values());
    if (options.hotReload) preHotReload(context, modDependencies);

    // Write xml files
    $console.log(`Writing About.xml...`);
    writeAboutXml(context, options, modDependencies);

    $console.log(`Writing Defs.xml...`);
    writeDefsXml(context);
    // End write xml files

    // Bundle assets
    $console.log(`Bundling icon and preview files...`);
    if (options.iconPath) context.copyFile(options.iconPath, `About/ModIcon.png`);
    if (options.previewPath) context.copyFile(options.previewPath, `About/Preview.png`);

    $console.log(`Bundling runtime...`);
    if (context.requiredRuntime) bundleRuntime(context);
    // End bundle assets

    $console.log(`Mod build succeeded.`);

    if (options.hotReload) triggerHotReload(context.packageId);
    $console.log(`Mod build completed: ${context.appSettings.outputPath}`);

    displayDefTree(context);
}

export type ModOptions = {
    /** The mod unique identifier. */
    id: string;
    /** The mod name. */
    name: string;
    /** The mod authors. */
    author: string | string[];
    /** The mod description. */
    description?: string;
    /** The mod version. */
    version: string;
    /** The supported game versions. */
    supportedVersions: string[];
    /** The path to the mod icon file. */
    iconPath?: string;
    /** The path to the mod preview file */
    previewPath?: string;
    /** The output directory for the built mod. */
    output?: string;
    /** Pretty print the output XML files. */
    pretty?: boolean;
    /** Clean the output directory before building. */
    clean?: boolean;
    /** Hot reload support. */
    hotReload?: boolean;
}

export const RUNTIME_ID = "RimWorldModMakerRuntime";
export const runtimeClass = (className: string) => `${RUNTIME_ID}.${className}`;

//
const cleanupOutput = (context: Context, options: ModOptions) => {
    if (!existsSync(context.appSettings.outputPath)) return;
    if (!options.clean) return $console.error(`Output directory already exists: ${context.appSettings.outputPath}, use the 'clean' option to overwrite.`);
    $console.warn(`Cleaning output directory: ${context.appSettings.outputPath}`);
    try {
        rmdirSync(context.appSettings.outputPath, { recursive: true });
    } catch (e) {
        $console.warn(`Failed to clean output directory: ${e}`);
    }
}

const bundleRuntime = (context: Context) => {
    const dll = "RimWorldModMakerRuntime.dll"
    context.copyFile(path.join(import.meta.dir, dll), `Assemblies/${dll}`);
}

const preHotReload = async (context: Context, modDependencies: ModDependency[]) => {
    modDependencies.push({
        version: "1.0.0",
        displayName: "Hot Reload",
        packageId: "xiaoeyun.hotReload",
        steamWorkshopUrl: "steam://url/CommunityFilePage/3610957393",
    })
    context.writeJson("hotReload.json", {
        enabled: true,
        assets: true,
        defs: true,
        watch: false,
        api: true
    });
}

const triggerHotReload = (packageId: string) => fetch("http://localhost:8700/hot-reload", { method: "POST", body: JSON.stringify({ mods: [packageId] }) })
    .catch(() => $console.warn("Failed to trigger hot reload."));

const writeDefsXml = (context: Context) => {
    const defs = Object.values(context.defsTree).flat();
    context.writeXmlFile(`Defs/Defs.xml`, x("Defs", defs));
}

const writeAboutXml = (context: Context, options: ModOptions, modDependencies: ModDependency[]) => {
    context.writeXmlFile(`About/About.xml`,
        x("ModMetaData", xobj({
            packageId: context.packageId,
            name: options.name,
            author: options.author,
            description: options.description,
            modVersion: options.version,
            supportedVersions: xls(options.supportedVersions),
            modDependencies: modDependencies.map(dep => x("li", xDependency(dep))),
        }))
    );
}

const displayDefTree = (context: Context) => {
    const tree = Object.entries(context.defsTree);
    if (tree.length === 0) return;

    tree.sort(([a], [b]) => a.localeCompare(b));
    $console.log(`Definitions tree:`);

    const registered = new Set<string>();
    for (const [type, nodes] of tree) {
        $console.log(`* [${type}]`);
        const hasDuplicates = chain(nodes)
            .map(n => n.get("defName")?.text() || "<unnamed>")
            .sortBy()
            .some(defName => {
                if (registered.has(defName)) {
                    $console.error(`Duplicate defName detected: ${defName}`);
                    $console.error(`  Each definition must have a unique defName.`);
                    return true;
                }
                $console.log(`  |- ${defName}`)
                registered.add(defName);
                return false
            })
            .value();
        if (hasDuplicates) return
    }
}