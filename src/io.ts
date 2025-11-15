import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { $console, ContextWithoutFunctions, XmlNode, random } from "@/utils";

export const IO_CONTEXT_BINDINGS = { getPath, writeXmlFile, copyFile, bundleTextures } as const;

export function getPath(ctx: ContextWithoutFunctions, path: string) {
    if (path.startsWith("/")) {
        $console.error(`Path should not start with '/': ${path}`);
        path = path.slice(1);
    }
    return ctx.appSettings.outputPath + "/" + path;
}

export function writeXmlFile(ctx: ContextWithoutFunctions, path: string, xml: XmlNode) {
    const normalizedPath = getPath(ctx, path);
    const xmlDeclaration = '<?xml version="1.0" encoding="utf-8"?>\n';
    createDirectoryBasedFile(normalizedPath);
    writeFileSync(normalizedPath, xmlDeclaration + xml.stringify(ctx.appSettings.pretty));
}

export function copyFile(ctx: ContextWithoutFunctions, src: string, dest: string) {
    const normalizedDest = getPath(ctx, dest);

    if (!existsSync(src)) {
        $console.error(`Source file does not exist: ${src}`);
    } else {
        createDirectoryBasedFile(normalizedDest);
        copyFileSync(src, normalizedDest);
    }
}

function createDirectoryBasedFile(path: string) {
    const cleanedPath = path.slice(0, path.lastIndexOf("/"));
    if (existsSync(cleanedPath)) return;
    mkdirSync(cleanedPath, { recursive: true });
}

export function bundleTextures(ctx: ContextWithoutFunctions, sources: string | string[]) {
    const sourcesKey = Array.isArray(sources) ? sources.join(",") : sources;
    if (ctx.textureAssets.has(sourcesKey)) return ctx.textureAssets.get(sourcesKey)!;

    const textureId = random();
    const texurePath = `${ctx.appSettings.id}/${textureId}`;
    ctx.textureAssets.set(sourcesKey, texurePath);

    if (!Array.isArray(sources)) {
        const ext = sources.split(".").pop();
        copyFile(ctx, sources, `Textures/${texurePath}.${ext}`);
        return texurePath;
    }

    for (const idx in sources) {
        const source = sources[idx];
        const ext = source.split(".").pop();
        copyFile(ctx, source, `Textures/${texurePath}/${idx}.${ext}`);
    }

    return texurePath;
}