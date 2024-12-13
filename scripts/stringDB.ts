import { world } from "@minecraft/server";


const CHUNK = 4095;
/**
 * String
 * @param name name of the string in the DB 
 * @returns 
 */
export function loadString(name:string):string | undefined {
    let response = "";
    let idx =0;
    let current: any;
    while (current = world.getDynamicProperty(`${name}#${idx}`)) {
        if ((typeof current) !== "string") {
            break;
        }
        response += current;
        idx++;
    }
    if (idx === 0) {
        return undefined;
    }
    return response;
}

/**
 * 
 * @param name string entry
 * @param value value
 * @returns 
 */
export function saveString(name:string, value: string) {
    deleteString(name);
    let idx =0;
    let pos =0;
    while (pos < value.length) {
        world.setDynamicProperty(`${name}#${idx}`, value.substring(pos, pos+CHUNK))
        pos+=CHUNK
        idx+=CHUNK
    }
}

export function deleteString (name: string) {
    let current;
    let idx =0;
    while (current = world.getDynamicProperty(`${name}#${idx}`)) {
        if ((typeof current) !== "string") {
            break;
        }
        world.setDynamicProperty(`${name}#${idx}`, undefined);
        idx++;
    }
}