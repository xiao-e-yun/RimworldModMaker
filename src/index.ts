import { chain, kebabCase } from "lodash";
import { bindContext, $console, Context, CONTEXT_BINDINGS } from "@/utils";
import { x, xls } from "@/xml";
import { existsSync, rmdirSync } from "fs";
import path from "path";

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
        defsTree: {},
        assets: {},
        requiredRuntime: false,
    }, CONTEXT_BINDINGS)

    if (existsSync(context.appSettings.outputPath)) {
        if (!options.clean) return $console.error(`Output directory already exists: ${context.appSettings.outputPath}, use the 'clean' option to overwrite.`);
        $console.warn(`Cleaning output directory: ${context.appSettings.outputPath}`);
        try {
            rmdirSync(context.appSettings.outputPath, { recursive: true });
        } catch (e) {
            $console.warn(`Failed to clean output directory: ${e}`);
        }
    }

    $console.log(`Building mod: ${options.name} (${options.id})`);
    $console.log(`Writing About.xml...`);
    const firstAuthor = Array.isArray(options.author) ? options.author[0] : options.author;
    context.writeXmlFile(`About/About.xml`,
        x("ModMetaData", [
            x("packageId", `${kebabCase(firstAuthor)}.${kebabCase(options.id)}`),
            x("name", options.name),
            x("author", options.author),
            x("description", options.description || ""),
            x("modVersion", options.version),
            x("supportedVersions", xls(options.supportedVersions)),
        ])
    );

    $console.log(`Copying icon and preview files...`);
    if (options.iconPath) context.copyFile(options.iconPath, `About/ModIcon.png`);
    if (options.previewPath) context.copyFile(options.previewPath, `About/Preview.png`);

    $console.log(`Setting up mod...`);
    setup(context);

    $console.log(`Writing definitions...`);
    const defs = Object.values(context.defsTree).flat();
    context.writeXmlFile(`Defs/Defs.xml`, x("Defs", defs));

    if (!context.requiredRuntime || options.hotReload) {
        $console.log(`Bundling runtime...`);
        const dll = path.join(import.meta.dir, "RimWorldModMakerRuntime.dll")
        context.copyFile(dll, `Assemblies/RimWorldModMakerRuntime.dll`);
        context.writeRuntimeJson({ hotReload: options.hotReload });
    }

    $console.log(`Mod build completed: ${context.appSettings.outputPath}`);

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

    /* Trigger hot reload */
    if (options.hotReload)
        fetch("http://localhost:8700/hot-reload", { method: "POST" })
            .catch(() => $console.warn("Failed to trigger hot reload."));
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
