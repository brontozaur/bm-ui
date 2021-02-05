export class Distributor {
    public id: number;
    public name: string;
    public distributorUrl: string;
    public description: string;

    constructor(id: number,
                name: string,
                distributorUrl: string,
                description: string) {
        this.id = id;
        this.name = name;
        this.distributorUrl = distributorUrl;
        this.description = description;
    }
}
