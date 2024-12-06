export declare class HashService {
    private readonly log;
    constructor();
    hashSync(input: string): string;
    compareSync(input: string, hash: string): boolean;
    hash(input: string): Promise<string>;
    compare(input: string, hash: string): Promise<boolean>;
}
