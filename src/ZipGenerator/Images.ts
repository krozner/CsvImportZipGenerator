import { ProductColors } from "Modules/Product";
import { Image } from "./Image";

export class Images extends Array<Image> {
    private capitalize(string) {
        if (typeof string !== "string") return "";

        const camelCase = s => {
            s = s.toLowerCase();
            return s.charAt(0).toUpperCase() + s.slice(1);
        };

        const multi = string.split("/");
        if (multi.length > 1) {
            return multi.map(s => camelCase(s)).join("/");
        }

        return camelCase(string);
    }

    readonly color: ProductColors | string;

    constructor(readonly sku: string, color: string) {
        super();
        
        this.color = (() => {
            switch (String(color).toLowerCase()) {
                case "lightblue":
                    return "LightBlue";
            }
            return this.capitalize(color);
        })();

        const colorMatch = Object.values(ProductColors)
            .map(productColor => String(productColor))
            .includes(this.color);

        if (!colorMatch) {
            throw new Error(`Color does not match: ${color}`);
        }
    }

    addImage(image: Image) {
        image.setIndex(this.length);
        this.push(image);
    }
}
