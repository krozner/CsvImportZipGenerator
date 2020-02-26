import "reflect-metadata";

import { GenerateZip } from "./src/ZipGenerator/GenerateZip";

(async () => {
    await GenerateZip(process.argv[2]);
})();
