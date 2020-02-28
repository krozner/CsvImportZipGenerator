import * as uuidV4 from "uuid/v4";
import { mkdir, createWriteStream, existsSync, copyFile, chmod } from "fs";
import * as chmodr from "chmodr";
import * as archiver from "archiver";
import { Images } from "./Images";

export class Zip extends Array<Images> {
    private readonly dirName: string;
    private readonly filePath: string;

    readonly dirPath: string;
    readonly imgDirPath: string;

    constructor() {
        super();

        this.dirName = uuidV4();
        this.dirPath = `/tmp/${this.dirName}`;
        this.imgDirPath = `${this.dirPath}/Images`;
        this.filePath = `${this.dirPath}.zip`
    }

    private async mkdir(dir: string): Promise<void> {
        await new Promise(resolve => {
            mkdir(dir, {recursive: true}, (err) => {
                if (err) {
                    console.log(err);
                }
                chmodr(dir, 0o777, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    resolve();
                });
            });
        });
    }

    async add(images: Images): Promise<void> {
        for (const img of images) {
            const imgDir = `${this.imgDirPath}/${images.sku}/${images.color}`;
            await this.mkdir(imgDir);

            const copyDir = `/var/www/app/var/Images/${images.sku}/${images.color}`;

            if (existsSync(`${copyDir}/${img.originName}`)) {
                img.setFilePath(copyDir);
                await img.copyTo(copyDir, imgDir);
            } else {
                await img.download();

                await img.moveTo(imgDir);
                await this.mkdir(copyDir);
                await img.copyTo(imgDir, copyDir);
            }
        }
    }

    async save(): Promise<void> {
        await new Promise((resolve, reject) => {
            const output = createWriteStream(this.filePath);
            output.on("close", () => {
                resolve();
            });

            const zipArchive = archiver("zip");

            zipArchive.pipe(output);
            zipArchive.directory(this.dirPath, false);
            zipArchive.finalize(err => {
                if (err) {
                    reject(err);
                }
            });
        });
    }

    async moveTo(dirPath: string, name: string): Promise<void> {
        await this.mkdir(dirPath);

        await new Promise(resolve => {
            const dest = `${dirPath}/${name}.zip`;

            copyFile(this.filePath, dest, err => {
                if (err) {
                    console.log(err);
                }
                chmod(dest, 0o777, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    resolve();
                });
            });
        });
    }
}
