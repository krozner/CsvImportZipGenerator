import { Zip } from "./Zip";
import { CsvWriter } from "./CsvWriter";
import { CsvReader } from "./CsvReader";
import { ImagesFactory } from "./ImagesFactory";
import { CsvFileSplitter } from "./CsvFileSplitter";

export const GenerateZip = async (filePath: string) => {
    let doc: CsvWriter;
    let zip: Zip;

    try {
        const splitter = new CsvFileSplitter(filePath, { lineLimit: 500 });
        await splitter.split();

        for (const file of splitter) {
            const reader = new CsvReader(file.path);

            doc = new CsvWriter();
            zip = new Zip();

            await reader.subscribe(async data => {
                await zip.add(ImagesFactory.create(data));
                doc.put(data);

                process.stdout.write(".");
            });

            console.log(`\nSaving zip file...`);

            await doc.save(zip); // moves document to zip folder
            await zip.save(String(file.index)); // archive folder

            console.log(`Zip file created, index: ${file.index}`);
        }

        process.exit(1);
    } catch (e) {
        console.log(e, zip);
        process.exit(0);
    }
};