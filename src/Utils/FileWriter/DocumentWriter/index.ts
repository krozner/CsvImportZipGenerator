import { createWriteStream, WriteStream } from "fs";
import { Document, IDocumentWriteModel } from "../Document";
import { get as _get } from "lodash";

export abstract class DocumentWriter {
    private writeStream: WriteStream;
    readonly encoding: string;

    abstract createHeader(): IDocumentWriteModel;
    abstract createFooter(): IDocumentWriteModel;
    protected abstract createWriteModel(): IDocumentWriteModel;

    public constructor(protected document: Document<any>) {
        this.encoding = "utf-8";
    }

    private write(model: IDocumentWriteModel): void {
        const { document, encoding } = this;

        if (!this.writeStream) {
            this.writeStream = createWriteStream(document.filePath, encoding);
            this.write(this.createHeader());
        }

        if (model !== null) {
            this.writeStream.write(String(model));
        }
    }

    put(data): void {
        const model = this.createWriteModel();

        this.document.columns.forEach(column => {
            let value: string | number;
            if (typeof column.getter === "function") {
                value = column.getter(data);
            } else {
                value = _get(data, column.key);
            }

            model.set(column, value);
        });

        this.write(model);
    }

    save(): Promise<void> {
        this.write(this.createFooter());
        
        return new Promise(resolve => {
            this.writeStream.end(() => {
                resolve();
            });
        });
    }
}

export * from "./CsvWriter";
export * from "./XmlWriter";
export * from "./RssWriter";
