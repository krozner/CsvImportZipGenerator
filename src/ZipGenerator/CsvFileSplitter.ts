import { split } from "csv-split-stream";
import { createReadStream, createWriteStream } from "fs";
import * as uuidV4 from "uuid/v4";

interface ICsvFileSplitterElement {
    name: string;
    path: string;
    index: number;
}

export class CsvFileSplitter extends Array<ICsvFileSplitterElement> {
    constructor(private filePath: string, private options: { lineLimit: number }) {
        super();
    }

    async split(): Promise<void> {
        console.log(`Splitting file...`);

        return new Promise((resolve, reject) => {
            split(createReadStream(this.filePath), this.options, index => {
                const name = `${uuidV4()}-${index}.csv`;
                const path = `/tmp/${name}`;

                this.push({ index, name, path });

                return createWriteStream(path);
            })
                .then(({ totalChunks }) => {
                    console.log(`File split into: ${totalChunks} chunks`);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
