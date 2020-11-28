/**
 * I use "private type" instead generic because we cant
 * correctly translate generic to ES5
 */
class ClientFactory {
    constructor(private type) {}
    public instantiate(...args) {
        return new this.type(...args);
    }
}
