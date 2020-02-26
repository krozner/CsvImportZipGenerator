import { IDocumentWriteModel } from "../Document";
import { DocumentWriter } from "./index";
import { Node } from "./Xml";

/**
 * <?xml version="1.0" encoding="utf-8"?>
 *     <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:c="http://base.google.com/cns/1.0">
 *         <channel>
 *             <item>
 *                 <g:id>CLO-29473856-2</g:id>
 *                 ...
 *                 </item>
 *                 </channel>
 *                 </rss>
 */
export class RssWriter extends DocumentWriter {
    readonly root: Node;
    readonly channel: Node;

    constructor(document) {
        super(document);

        this.root = new Node("rss");
        this.channel = new Node("channel");
    }

    protected createWriteModel(): IDocumentWriteModel {
        return new Node("item");
    }

    private get xml() {
        const {
            root: { name: rootName, attributes: rootAttributes },
            channel: { name: channelName, attributes: channelAttributes },
        } = this;

        return { rootName, rootAttributes, channelName, channelAttributes };
    }

    createHeader(): any {
        const root = `${this.xml.rootName} ${this.xml.rootAttributes}`.trim();
        const channel = `${this.xml.channelName} ${this.xml.channelAttributes}`.trim(); // removes spaces from `<rss >`

        return `<?xml version="1.0" encoding="${this.encoding}"?><${root}><${channel}>`;
    }

    createFooter(): any {
        return `</${this.xml.channelName}></${this.xml.rootName}>`;
    }
}
