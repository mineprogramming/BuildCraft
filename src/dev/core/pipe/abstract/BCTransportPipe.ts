/// <reference path="BCPipe.ts" />
class BCTransportPipe extends BCPipe {
    public get transportType(): string {
        return "item"
    }
}