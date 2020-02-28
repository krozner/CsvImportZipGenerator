import { renameSync } from "fs";
import { Column, Document, DocumentColumns } from "Utils/FileWriter";
import { Zip } from "./Zip";

export class CsvWriter extends Document<any> {
    constructor() {
        super(
            new DocumentColumns(
                new Column("languageCode", "languageCode"),
                new Column("name", "name"),
                new Column("description", "description"),
                new Column("brandName", "brandName"),
                new Column("made", "made"),
                new Column("washing", "washing"),
                new Column("composition", "composition"),
                new Column("colors.0", "colors.0"),
                new Column("sizes.0", "sizes.0"),
                new Column("supplierSKU", "supplierSKU"),
                new Column("hsCode", "hsCode"),
                new Column("modelHeight", "modelHeight"),
                new Column("modelSize", "modelSize"),
                new Column("taxonomy.gender", "taxonomy.gender"),
                new Column("taxonomy.age", "taxonomy.age"),
                new Column("taxonomy.division", "taxonomy.division"),
                new Column("taxonomy.category", "taxonomy.category"),
                new Column("taxonomy.subCategory1", "taxonomy.subCategory1"),
                new Column("taxonomy.subCategory2", "taxonomy.subCategory2"),
                new Column("taxonomy.occasion", "taxonomy.occasion"),
                new Column("taxonomy.length", "taxonomy.length"),
                new Column("taxonomy.sleeveLength", "taxonomy.sleeveLength"),
                new Column("taxonomy.neckline", "taxonomy.neckline"),
                new Column("taxonomy.fit", "taxonomy.fit"),
                new Column("taxonomy.finish", "taxonomy.finish"),
                new Column("taxonomy.waistLine", "taxonomy.waistLine"),
                new Column("taxonomy.fastening", "taxonomy.fastening"),
                new Column("taxonomy.wash", "taxonomy.wash"),
                new Column("taxonomy.heel", "taxonomy.heel"),
                new Column("taxonomy.height", "taxonomy.height"),
                new Column("taxonomy.toeTip", "taxonomy.toeTip"),
                new Column("taxonomy.material", "taxonomy.material"),
                new Column("taxonomy.shape", "taxonomy.shape"),
                new Column("taxonomy.trend", "taxonomy.trend"),
            ),
        );
    }

    save(zip?: Zip);

    async save({ dirPath }: Zip) {
        await super.save();

        renameSync(this.filePath, `${dirPath}/Product.csv`);
    }
}
