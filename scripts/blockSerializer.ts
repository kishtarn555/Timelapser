import { BlockPermutation } from "@minecraft/server";

export function serializePermutation(block:BlockPermutation) {
    return JSON.stringify({
        id:block.type.id,
        states:block.getAllStates()
    });
}
export function deserializePermutation(data:string) {
    let obj = JSON.parse(data);
    return BlockPermutation.resolve(obj.id, obj.states);
}