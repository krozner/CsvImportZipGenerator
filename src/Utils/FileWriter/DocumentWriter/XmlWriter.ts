import { IDocumentWriteModel } from "../Document";
import { DocumentWriter } from "./index";
import { Node } from "./Xml";

export class XmlWriter extends DocumentWriter {
    private setup: {
        root: Node;
    };

    setRoot(node: Node): this {
        this.setup.root = node;
        return this;
    }

    get root() {
        if (!this.setup.root) {
            this.setup.root = new Node("root");
        }
        return this.setup.root;
    }

    protected createWriteModel(): IDocumentWriteModel {
        throw new Error("Not implemented yet");
    }

    createHeader(): any {
        const { name, attributes } = this.root;

        return `<?xml version="1.0" encoding="${this.encoding}"?> <${name} ${attributes.toString()}>`;
    }

    createFooter(): IDocumentWriteModel {
        return `</${this.root.name}>` as any;
    }
}
