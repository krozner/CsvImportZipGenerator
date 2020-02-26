interface IColumnSetup {
    xmlTagPrefix?: string;
    xmlCdata?: boolean;
}

interface IColumnSetupOptions {
    override?: boolean; // if TRUE IColumnSetup is overridden each time `set` is called
}

// todo rename as Row item & Node element
export class Column {
    getter?(data: any): string | number;

    /**
     * @param label Name of column or node
     * @param key Data property name
     */
    constructor(public readonly label: string, public readonly key?: string) {}

    public setup: IColumnSetup = {};

    set(setup: IColumnSetup, { override }: IColumnSetupOptions = { override: false }): this {
        if (override) {
            this.setup = Object.assign(this.setup, setup);
        } else {
            Object.entries(setup).forEach(([key, value]) => {
                if (this.setup[key] === undefined) {
                    this.setup[key] = value;
                }
            });
        }
        return this;
    }
}
