import { Zip } from "./Zip";
import { CsvReader } from "./CsvReader";
import { ImagesFactory } from "./ImagesFactory";
import { CsvFileSplitter } from "./CsvFileSplitter";

export const GenerateZip = async (filePath: string) => {
    let zip: Zip;

    try {
        const utcString = new Date().toISOString();

        const splitter = new CsvFileSplitter(filePath, { lineLimit: 200 });
        await splitter.split();

        for (const file of splitter) {
            const reader = new CsvReader(file.path);

            zip = new Zip();

            await reader.subscribe(async data => {
                await zip.add(ImagesFactory.create(data));
                zip.put(data);

                process.stdout.write(".");
            });

            console.log(`\nSaving zip file...`);

            await zip.save(); // archive folder
            await zip.moveTo(`/var/www/app/var/zip/${utcString}`, String(file.index)); // archive folder

            console.log(`Zip file created, index: ${file.index}`);
        }

        process.exit(1);
    } catch (e) {
        console.log(e, zip);
        process.exit(0);
    }
};
