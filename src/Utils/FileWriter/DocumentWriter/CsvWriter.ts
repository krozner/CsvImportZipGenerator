import { Column, IDocumentWriteModel } from "../index";
import { DocumentWriter } from "./index";

export class Row extends Array<string> implements IDocumentWriteModel {
    static readonly Separator = ",";

    set(column: Column, value) {
        if (!value) {
            this.push(null);
        } else {
            // prettier-ignore
            value = `${value}`
                .replace(/\r?\n|\r/g, " ")
                .replace(new RegExp("\"", "g"), "'")
                .replace(new RegExp(Row.Separator, "g"), "");

            this.push(value);
        }
    }

    toString() {
        return `${this.join(Row.Separator)}\n`;
    }
}

export class CsvWriter extends DocumentWriter {
    protected createWriteModel(): IDocumentWriteModel {
        return new Row();
    }

    createHeader(): IDocumentWriteModel {
        const { columns } = this.document;
        return new Row(...columns.map(({ label }) => label));
    }

    createFooter(): IDocumentWriteModel {
        return null;
    }
}
