import { ReadStream, createReadStream, readFileSync, unlinkSync } from "fs";
import * as uuidV4 from "uuid/v4";
import { RuntimeException } from "Exceptions";
import { Column, DocumentColumns, DocumentWriter, CsvWriter, XmlWriter, RssWriter } from "./index";

export enum DocumentType {
    Csv = "Csv",
    Xml = "Xml",
    Rss = "Rss",
}

export interface IDocumentWriteModel {
    set(column: Column, value: string | number): void;
    toString(): string;
}

export abstract class Document<RowData extends { [key: string]: any }> {
    filePath: string;
    fileName: string;
    type: DocumentType;

    protected writer: DocumentWriter;

    constructor(public readonly columns: DocumentColumns) {
        this.type = DocumentType.Csv;
    }

    private createWriter(type: DocumentType) {
        switch (type) {
            case DocumentType.Xml:
                return new XmlWriter(this);
            case DocumentType.Rss:
                return new RssWriter(this);
            case DocumentType.Csv:
                return new CsvWriter(this);
        }

        throw new RuntimeException(`Unsupported document type: ${type}`);
    }

    private init() {
        this.fileName = uuidV4();
        this.filePath = `/tmp/${this.fileName}`;
        this.writer = this.createWriter(this.type);
    }
    
    setType(type: DocumentType): this {
        this.type = type;
        this.init();
        
        return this;
    }

    put(data): void {
        if (!this.writer) {
            this.init();
        }
        this.writer.put(data);
    }

    async save(): Promise<void> {
        if (this.writer) {
            await this.writer.save();
        }
    }

    toBuffer(): Buffer {
        return readFileSync(this.filePath);
    }

    toStream(): ReadStream {
        return createReadStream(this.filePath);
    }

    remove() {
        try {
            unlinkSync(this.filePath);
        } catch (err) {
            console.error(err);
        }
    }
}
