import {copyFileSync, existsSync, mkdirSync, writeFileSync} from "fs";
import {$console, ContextWithoutFunctions, XmlNode, generateUUID} from "@/utils";

export const IO_CONTEXT_BINDINGS = {getPath, writeXmlFile, writeJson, copyFile, bundleAssets, bundleSounds, bundleTextures } as const;

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

export function writeJson(ctx: ContextWithoutFunctions, path: string, json: any) {
  const normalizedPath = getPath(ctx, path);
  createDirectoryBasedFile(normalizedPath);
  writeFileSync(normalizedPath, JSON.stringify(json, null, ctx.appSettings.pretty ? 2 : 0));
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
  mkdirSync(cleanedPath, {recursive: true});
}

function bundleAssets(type: string, ctx: ContextWithoutFunctions, sources: string | string[]) {
  if (!(type in ctx.assets)) ctx.assets[type] = new Map<string, string>();
  const assets = ctx.assets[type];

  const sourcesKey = Array.isArray(sources) ? sources.join(",") : sources;
  if (assets.has(sourcesKey)) return assets.get(sourcesKey)!;

  const textureId = generateUUID();
  const texurePath = `${ctx.appSettings.id}/${textureId}`;
  assets.set(sourcesKey, texurePath);

  if (!Array.isArray(sources)) {
    const ext = sources.split(".").pop();
    copyFile(ctx, sources, `${type}/${texurePath}.${ext}`);
    return texurePath;
  }

  for (const idx in sources) {
    const source = sources[idx];
    const ext = source.split(".").pop();
    copyFile(ctx, source, `${type}/${texurePath}/${idx}.${ext}`);
  }

  return texurePath;
}

function bundleTextures(ctx: ContextWithoutFunctions, sources: string | string[]) {return bundleAssets("Textures", ctx, sources)}
function bundleSounds(ctx: ContextWithoutFunctions, sources: string | string[]) {return bundleAssets("Sounds", ctx, sources)}
