import * as csv2json from "csvtojson";

export class CsvReader {
    private handler;

    constructor(filePath: string) {
        this.handler = csv2json({ delimiter: "," }).fromFile(filePath);
    }

    subscribe(cb) {
        return this.handler.subscribe(
            async json => {
                await cb(json);
            },
            err => {
                throw err;
            },
        );
    }
}
