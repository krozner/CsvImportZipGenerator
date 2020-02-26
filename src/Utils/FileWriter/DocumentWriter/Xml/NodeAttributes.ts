export class NodeAttributes extends Array<{ name: string; value: string }> {
    toString(): string {
        const attributes = this.map(({ name, value }) => `${name}="${value}"`);
        return attributes.join(" ");
    }
}
