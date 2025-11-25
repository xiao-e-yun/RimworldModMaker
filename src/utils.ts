import { DefNode, DEFS_CONTEXT_BINDINGS } from '@/defs';
import { IO_CONTEXT_BINDINGS } from '@/io';
import { CustomInstance } from 'better-logging';
import { DecoratedInstance } from 'better-logging/dist/lib/interfaces/decoratedInstance';
import { randomUUID } from 'crypto';
import { ModDependency } from './common/mod';

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
    defsTree: Record<string, DefNode[]>;
    dependencies: Map<string, ModDependency>;
    assets: Record<string, Map<string, string>>;
    requiredRuntime: boolean
    packageId: string;
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
export const generateUUID = randomUUID;

export const toVec = (arr: number[]) => `(${arr.join(", ")})`;


export function withDefaults<T extends Record<string, any>, U extends Partial<T>>(
    props: T,
    defaults: U
): T & U {
    return {
        ...defaults,
        ...props,
    };
}