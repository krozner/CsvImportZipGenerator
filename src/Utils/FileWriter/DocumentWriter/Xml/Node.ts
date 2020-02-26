import { IDocumentWriteModel } from "../../Document";
import { Column } from "../../Column";
import { NodeAttributes } from "./NodeAttributes";

export class Node extends Array<string> implements IDocumentWriteModel {
    constructor(public readonly name: string) {
        super();
    }

    set({ label, setup }: Column, value) {
        value = String(value).replace(/\r?\n|\r/g, " ");
        value = setup.xmlCdata ? `<![CDATA[${value}]]>` : value;

        label = setup.xmlTagPrefix ? `${setup.xmlTagPrefix}:${label}` : label;

        this.push(`<${label}>${value}</${label}>`);
    }

    private setup: {
        children: Node[];
        attributes: NodeAttributes;
    } = {
        children: [],
        attributes: new NodeAttributes(),
    };

    get children(): Node[] {
        return this.setup.children;
    }

    get hasChildren(): boolean {
        return this.children.length > 0;
    }

    get attributes(): NodeAttributes {
        return this.setup.attributes;
    }

    addChildren(node: Node): this {
        this.children.push(node);
        return this;
    }

    addAttribute(name: string, value: string): this {
        this.attributes.push({ name, value });
        return this;
    }

    toString() {
        const node = `${this.name} ${this.attributes}`.trim();

        return `<${node}>${this.join("")}</${this.name}>`;
    }
}
