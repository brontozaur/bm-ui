export class Distributor {
    public id: number;
    public uid: number;
    public name: string;
    public distributorUrl: string;
    public notifyUrl: string;
    public country: string;
    public description: string;
    public maxLoanCount: number;
    public sharedSecret: string;
    public linkExpiration: string;

    constructor(id: number,
                uid: number,
                name: string,
                distributorUrl: string,
                notifyUrl: string,
                country: string,
                description: string,
                maxLoanCount: number,
                sharedSecret: string,
                linkExpiration: string) {
        this.id = id;
        this.uid = uid;
        this.name = name;
        this.distributorUrl = distributorUrl;
        this.notifyUrl = notifyUrl;
        this.country = country;
        this.description = description;
        this.maxLoanCount = maxLoanCount;
        this.sharedSecret = sharedSecret;
        this.linkExpiration = linkExpiration;
    }
}
