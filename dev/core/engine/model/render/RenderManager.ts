class RenderManager {
    private static availableRenders = {
        // groupName : [ render0, render1]
    }

    static getRender(groupName: string){
        if(this.availableRenders[groupName]){
            return this.availableRenders[groupName].pop();
        }
        return null;
    }

    static addToGroup(groupName: string, render: number){
        if(!this.availableRenders[groupName]){
            this.availableRenders[groupName] = [];
        }
        this.availableRenders[groupName].push(render);
    }
}