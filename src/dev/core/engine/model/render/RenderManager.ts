class RenderManager {
    private static renders = [];

    static getRender(groupName ?: string){
        return this.renders.pop();
    }

    static store(render: Render): void {
        this.renders.push(render);
    }
}