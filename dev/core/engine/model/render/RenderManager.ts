class RenderManager {
    private static availableRenders = {
        //groupName : [ render0, render1]
    }

    static getRender<T>(groupName: string, c: new () => T, type: string): T{
        if(Object.keys(this.availableRenders).length == 0 || this.availableRenders[groupName].length == 0){
            let render = new c();
            alert("created new render")
            return render;
        }
        alert(`retirned wxisting render`)
        return this.availableRenders[groupName].pop();
    }

    static addToGroup(groupName: string, render){
        alert(`added to group ${groupName} renderID ${render}`);
        this.availableRenders[groupName].push(render)
    }
}