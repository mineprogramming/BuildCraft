/// <reference path="../abstract/BCPipe.ts" />
class PipeIdMap {
    private static map = {};

    public static assignIdAsClass(id: number, cls: BCPipe) {
        this.map[id] = cls;
    }

    public static getClassById(id: number): BCPipe | null {
        return this.map[id] || null;
    }
}