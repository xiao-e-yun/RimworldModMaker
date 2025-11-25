import { castArray, cloneDeep, isEmpty, isString, map } from "lodash";
import { $console } from "./utils";

export type XmlAttrs = Record<string, string | number | boolean>;
export type XmlChild = XmlNode | string | boolean | number;
export class XmlNode {
    tag: string;
    attrs: XmlAttrs;
    contents: XmlChild[] | null;

    constructor(tag: string, attrs?: XmlAttrs, contents?: null | XmlChild | XmlChild[]) {
        this.tag = tag;
        this.attrs = attrs ?? {};
        if (contents === undefined) this.contents = [];
        else if (contents === null) this.contents = null;
        else this.contents = castArray(contents).filter(node => !isString(node) || !isEmpty(node)) as XmlChild[];
    }

    get(tag: string): XmlNode | null {
        if (!this.contents) return null;
        for (const content of this.contents)
            if (content instanceof XmlNode && content.tag === tag)
                return content;
        return null;
    }

    getOrCreate(tag: string): XmlNode {
        let node = this.get(tag);
        if (!node) {
            if (!this.contents) this.contents = [];
            node = new XmlNode(tag);
            this.contents.push(node);
        }
        return node;
    }

    merge(rhs: XmlNode) {
        this.attrs = { ...this.attrs, ...rhs.attrs };
        this.mergeChildren(...rhs.contents ?? []);
    }

    mergeChildren(...others: XmlChild[]) {
        if (!this.contents) this.contents = [];
        if (others.length === 0) return;

        // if is leaf node, just replace
        if (
            others.length === 1 &&
            this.contents.length <= 1 &&
            !XmlNode.isXmlNode(this.contents[0]) &&
            !XmlNode.isXmlNode(others[0])
        ) return this.contents = others;

        // if merging li nodes, just append
        if (XmlNode.isList(this.contents) && XmlNode.isList(others))
            return this.contents.push(...others);

        // assuming all values ​​are xmlNode
        for (const lhs of others as XmlNode[]) {
            let matched = false;
            for (const rhs of this.contents as XmlNode[]) {
                if (lhs.tag !== rhs.tag) continue;
                rhs.merge(lhs);
                matched = true;
                break;
            }
            if (!matched) this.contents!.push(lhs);
        }
    }


    push(...children: XmlChild[]) {
        if (this.contents === null) {
            $console.warn(`Cannot push children to XmlNode with null contents (tag: ${this.tag})`);
            this.contents = [];
        }
        this.contents.push(...children);
    }

    remove(...tags: string[]) {
        if (!this.contents) return;
        this.contents = this.contents.filter(content => !(XmlNode.isXmlNode(content) && tags.includes(content.tag)));
    }

    clone(): XmlNode {
        return new XmlNode(
            this.tag,
            cloneDeep(this.attrs),
            this.contents?.map(content => XmlNode.isXmlNode(content) ? content.clone() : content)
        );
    }

    stringify(pretty = false, indentLevel = 0): string {
        const attrs = map(this.attrs, (value, key) => ` ${key}="${value}"`).join("");

        // Handle null cases
        const f: (s: string | number | boolean, space?: boolean) => string = pretty ? (s, m = false) => '  '.repeat(indentLevel + (m ? 1 : 0)) + s + '\n' : (s) => String(s);

        if (this.contents === null) return f(`<${this.tag}${attrs} IsNull="True" />`);

        if (!this.contents.length && !attrs) return ""; // Empty node with no attributes

        const results = [f(`<${this.tag}${attrs}>`)];
        if (pretty && this.contents.length == 1 && !XmlNode.isXmlNode(this.contents[0])) {
            if (this.contents[0] !== undefined) return f(`<${this.tag}${attrs}>${this.contents[0]}</${this.tag}>`);
            if (attrs) return f(`<${this.tag}${attrs} />`);
            return ""; // Empty node with no attributes
        } else for (const content of this.contents) {
            const result = XmlNode.isXmlNode(content) ? content.stringify(pretty, indentLevel + 1) : f(content, true);
            if (result) results.push(result);
        }
        if (results.length === 1 && !attrs) return ""; // Empty node with no attributes
        results.push(f(`</${this.tag}>`));
        return results.join("");
    }

    static isXmlNode(obj: any): obj is XmlNode {
        return obj instanceof XmlNode;
    }

    /**
     * @warning This function does not consider edge cases.
     */
    static isList(contents: XmlChild[]): boolean {
        return contents.some(c => c instanceof XmlNode && c.tag === "li");
    }
}

/** 
 * Create an XmlNode.
 * @example 
 * x("tag", "content", { attr1: "value1" }) === <tag attr1="value1">content</tag>
 */
export const x = (tag: string, contents?: null | XmlChild | XmlChild[], attrs?: XmlAttrs) => new XmlNode(tag, attrs, contents)

/**
 * Convert an array of XmlChild or [XmlChild, XmlAttrs] to an array of XmlNode with tag "li".
 * @example
 * xls([ "item1", ["item2", { attr1: "value1" }]]) === <li>item1</li><li attr1="value1">item2</li>
 */
export const xls = (tags?: (XmlChild | XmlChild[] | null | undefined)[]) => tags?.map(t => x("li", t))
/** 
 * Convert an object to XmlNode array.
 * Each key-value pair in the object is converted to an XmlNode with the key as the tag and the value as the content.
 * @example 
 * xobj({foo: "bar", baz: "qux"}) === <foo>bar</foo><baz>qux</baz>
 */
export const xobj = <T extends Record<string, XmlChild | XmlChild[] | null | undefined>>(obj?: T) => map(obj, (v, k) => x(k, v));

/**
 * Create statBases XmlNode from a record of stats.
 */
export const xstats = <T extends Record<string, number | null | undefined>>(stats: T) => x("statBases", xobj(stats))