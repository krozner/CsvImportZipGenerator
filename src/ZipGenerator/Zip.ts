import * as uuidV4 from "uuid/v4";
import { mkdir, rmdirSync, createWriteStream, existsSync } from "fs";
import * as archiver from "archiver";
import { Images } from "./Images";

export class Zip extends Array<Images> {
    private readonly name: string;

    readonly path: string;
    readonly imgDirPath: string;

    constructor() {
        super();

        this.name = uuidV4();
        this.path = `/tmp/${this.name}`;
        this.imgDirPath = `${this.path}/Images`;
    }

    private mkdir(dir: string): Promise<void> {
        return new Promise(resolve => {
            mkdir(dir, { recursive: true }, () => {
                resolve();
            });
        });
    }

    async add(images: Images): Promise<void> {
        for (const img of images) {
            const imgDir = `${this.imgDirPath}/${images.sku}/${images.color}`;
            await this.mkdir(imgDir);

            const copyDir = `/var/www/app/var/Images/${images.sku}/${images.color}`;

            if (existsSync(`${copyDir}/${img.name}`)) {
                img.setFilePath(copyDir);
                await img.copyTo(copyDir, imgDir, img.name);
            } else {
                await img.download();

                await img.moveTo(imgDir, img.name);
                await this.mkdir(copyDir);
                await img.copyTo(imgDir, copyDir, img.name);
            }
        }
    }

    async save(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = createWriteStream(`/tmp/${name}.zip`);
            output.on("close", () => {
                resolve();
            });

            const zipArchive = archiver("zip");

            zipArchive.pipe(output);
            zipArchive.directory(this.path, false);
            zipArchive.finalize(err => {
                if (err) {
                    reject(err);
                }
                rmdirSync(this.path);
            });
        });
    }
}
