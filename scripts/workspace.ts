import { BlockVolume, Dimension, PlayerPlaceBlockAfterEvent, system, Vector3, world } from "@minecraft/server";

export class Workspace {
    private space: BlockVolume
    private id:string
    private dimension:Dimension

    constructor (id:string, pos1:Vector3, pos2:Vector3, dimension:Dimension) {
        let minPos = {
            x: Math.min(pos1.x, pos2.x),
            y: Math.min(pos1.y, pos2.y),
            z: Math.min(pos1.z, pos2.z),
        }
        let maxPos = {
            x: Math.max(pos1.x, pos2.x),
            y: Math.max(pos1.y, pos2.y),
            z: Math.max(pos1.z, pos2.z),
        }
        this.dimension = dimension;
        this.space = new BlockVolume(minPos, maxPos);
        this.id = id;
    }

    GetVolume() {
        return this.space;
    }
    GetId() {
        return this.id;
    }
    GetDimension() {
        return this.dimension;
    }

    * GetStructureAreas () {        
        const span = this.space.getSpan();
        for (let x =0; x < span.x; x+=64) {
            for (let z =0; z < span.z; z+=64) {
                let widthX = Math.min(x+63, span.x-1);
                let widthZ = Math.min(z+63, span.z-1);
                let from:Vector3 = {
                    x: x + this.space.from.x,
                    y: this.space.from.y,
                    z: z + this.space.from.z,
                }
                let to:Vector3 = {
                    x: widthX + this.space.from.x,
                    y: this.space.to.y,
                    z: widthZ + this.space.from.z,
                }
                yield {id:`mytmp:s${this.id}-${x}-${z}`, from:from, to:to }
            }
        }
    }


    
}



export class WorkspaceHandler {
    private workspace:Workspace

    constructor (workspace:Workspace) {
        this.workspace = workspace;
    }

    startRecording() {
        for (let {id, from, to} of this.workspace.GetStructureAreas()) {
            world.structureManager.createFromWorld(
                id,
                this.workspace.GetDimension(),
                from,
                to
            ).saveToWorld();
        }

        world.afterEvents.playerPlaceBlock.subscribe(
            this.placeBlock.bind(this)
        );
    }

    stopRecording() {
        world.afterEvents.playerPlaceBlock.unsubscribe(
            this.placeBlock.bind(this)
        )
    }

    placeBlock(event:PlayerPlaceBlockAfterEvent) {
        const block = event.block;
        if (block.dimension.id !== this.workspace.GetDimension().id) {
            return;
        }
        if (!this.workspace.GetVolume().isInside(block.location)) {
            return;
        }
    }

    async reset() {
        let promise = new Promise<void>((resolve, reject)=> {
            system.runJob(resetter.bind(this)())
            function* resetter (this:WorkspaceHandler) {
                for (let {id, from} of this.workspace.GetStructureAreas()) {
                    try {
                    world.structureManager.place(id, this.workspace.GetDimension(), from);
                    } catch(e) {
                        console.error(e);
                    }        
                    yield    
                }
                resolve();
            }
        });
        return promise;
    }


    

    
}