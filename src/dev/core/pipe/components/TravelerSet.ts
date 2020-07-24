/// <reference path="TravelingItem.ts" />
class TravelerSet {
    public iterating: boolean;
    public items: TravelingItem[] = [];
    public toAdd: TravelingItem[] = [];

    constructor(private transport){}

    public add(item: TravelingItem): boolean {
        if (this.iterating) {
            this.toAdd.push(item);
        }

        item.setContainer(this.transport.container);
        this.items.push(item);
        return true;
    }
}