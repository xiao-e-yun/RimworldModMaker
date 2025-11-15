import { DEFS_CONTEXT_BINDINGS } from '@/defs';
import { IO_CONTEXT_BINDINGS } from '@/io';
import { XmlNode } from '@/utils';
import { CustomInstance } from 'better-logging';
import { DecoratedInstance } from 'better-logging/dist/lib/interfaces/decoratedInstance';
import { randomUUID } from 'crypto';

export * from "@/io"
export * from "@/xml"

export const $console = ((o) => {
    CustomInstance(globalThis.console)(o);
    return o as DecoratedInstance
})({})

// Define context and bindings here
export const CONTEXT_BINDINGS = { ...IO_CONTEXT_BINDINGS, ...DEFS_CONTEXT_BINDINGS } as const

export interface ContextWithoutFunctions {
    appSettings: {
        id: string;
        pretty: boolean;
        outputPath: string;
    }
    defsTree: Record<string, XmlNode[]>;
    textureAssets: Map<string, string>;
}
export type Context = ReturnType<typeof bindContext<ContextWithoutFunctions, typeof CONTEXT_BINDINGS>>

export function bindContext<T extends ContextWithoutFunctions, Fns extends Record<string, Function>>(
    ctx: T,
    fns: Fns
): T & {
    [K in keyof Fns]: Fns[K] extends (ctx: T, ...args: infer P) => infer R
    ? (...args: P) => R
    : never
} {
    const bound: any = ctx; // avoid TS error
    for (const [key, fn] of Object.entries(fns))
        bound[key] = fn.bind(null, ctx);
    return bound
}

// Utility functions
export const random = randomUUID

export const toVec = (arr: number[]) => `(${arr.join(", ")})`;