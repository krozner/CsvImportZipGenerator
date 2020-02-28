import * as request from "request";
import * as uuidV4 from "uuid/v4";
import { createWriteStream, rename, copyFile, existsSync, copyFileSync } from "fs";

export class Image {
    private fileName: string;
    private filePath: string;

    get name() {
        let { index, extension } = this;
        if (!Number.isInteger(index)) {
            throw new Error(`Image index not set`);
        }
        extension = extension ? `.${extension}` : ".jpg";
        return `${Number(index) + 1}${extension}`;
    }

    get originName() {
        let { index, extension } = this;
        if (!Number.isInteger(index)) {
            throw new Error(`Image index not set`);
        }
        extension = extension ? `.${extension}` : "";
        return `${Number(index) + 1}${extension}`;
    }


    private index: number;

    setIndex(index: number) {
        this.index = index;
    }

    constructor(private url: string, private extension?: string) {
        this.fileName = uuidV4();
        this.filePath = `/tmp/${this.fileName}`;
    }

    setFilePath(dir: string, name?: string) {
        name = name ? name : this.name;

        this.fileName = name;
        this.filePath = `${dir}/${name}`;
    }

    async download(): Promise<void> {
        const { url, filePath } = this;

        const fileName = String(url).split("/").reduceRight(element => element);
        const srcPath = `/var/www/app/var/img/${fileName}`;
        if (existsSync(srcPath)) {
            copyFileSync(srcPath, filePath);
            return;
        }

        await new Promise(resolve => {
            request.head(url, function(err, res, body) {
                if (err) {
                    console.log(err);
                }

                request(url)
                    .pipe(createWriteStream(filePath))
                    .on("close", () => {
                        resolve();
                    });
            });
        });
    }

    private doMoveOrCopy(dirPath: string, fileName: string, fn: Function) {
        return new Promise(resolve => {
            fn(this.filePath, `${dirPath}/${fileName}`, err => {
                if (err) {
                    console.log(err);
                }
                this.fileName = fileName;
                this.filePath = `${dirPath}/${fileName}`;
                resolve();
            });
        });
    }

    async copyTo(srcDir: string, destDir: string): Promise<void> {
        await new Promise(resolve => {
            this.setFilePath(destDir);

            copyFile(`${srcDir}/${this.originName}`, this.filePath, err => {
                if (err) {
                    console.log(err);
                }
                resolve();
            });
        });
    }

    async moveTo(destDir: string): Promise<void> {
        await new Promise(resolve => {
            rename(this.filePath, `${destDir}/${this.name}`, err => {
                this.setFilePath(destDir);

                if (err) {
                    console.log(err);
                }
                resolve();
            });
        });
    }
}
