import { Dimension, system, world } from "@minecraft/server";
import { Workspace, WorkspaceHandler } from "./workspace";


const NAMESPACE = "tmlp"

let controller:WorkspaceHandler

system.afterEvents.scriptEventReceive.subscribe((evt)=> {
    if (evt.id!==`${NAMESPACE}:test`) {
        return;
    }
    world.sendMessage("Recording");
    let space =  new Workspace(
        "test",
        {x: 0, y: 60, z:0},
        {x: 10, y: 100, z:10},
        world.getDimension("overworld")
    );
    controller = new WorkspaceHandler(space);
    controller.startRecording();
}, {
    namespaces: ["tmlp"]
})
system.afterEvents.scriptEventReceive.subscribe((evt)=> {
    if (evt.id!==`${NAMESPACE}:reset`) {
        return;
    }
    world.sendMessage("Stopping");
    controller.stopRecording();
    world.sendMessage("Reseting");
    controller.reset().then(
        ()=>world.sendMessage("DONE")
    );    
}, {
    namespaces: ["tmlp"]
})
system.afterEvents.scriptEventReceive.subscribe((evt)=> {
    if (evt.id!==`${NAMESPACE}:play`) {
        return;
    }
    world.sendMessage("Playing");
    controller.play().then(
        ()=>world.sendMessage("DONE")
    );    
}, {
    namespaces: ["tmlp"]
})


system.afterEvents.scriptEventReceive.subscribe((evt)=> {
    if (evt.id!==`${NAMESPACE}:stats`) {
        return;
    }
    world.sendMessage(`${world.getDynamicPropertyTotalByteCount()}B`);
    world.sendMessage(`${Math.round(world.getDynamicPropertyTotalByteCount()/1024)}KB`);
    world.sendMessage(`${Math.round(world.getDynamicPropertyTotalByteCount()/1024/1024)}MB`);
}, {
    namespaces: ["tmlp"]
})
