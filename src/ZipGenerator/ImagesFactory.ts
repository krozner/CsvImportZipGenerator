import { Image } from "./Image";
import { Images } from "./Images";

/**
 * custom factory for McLabels provider
 */
export class ImagesFactory {
    static create(json): Images {
        const images = new Images(json["supplierSKU"], json["colors"][0]);

        for (const [key, imageUrl] of Object.entries(json)) {
            if (key.match(/image/) && imageUrl) {
                let extension = String(imageUrl)
                    .split(".")
                    .reduceRight(element => element)
                    .toLowerCase();

                extension = (() => {
                    switch (extension) {
                        case "jpg":
                        case "jpeg":
                        case "png":
                        case "gif":
                        case "tiff":
                            return extension;
                    }
                    return null;
                })();

                images.addImage(new Image(String(imageUrl), extension));
            }
        }

        return images;
    }
}
