/*
 MechDog package
*/
//% weight=10 icon="\uf013" color=#ff7f00
namespace MechDog {

    const INVALID_PORT = 0xff;
    let voltage: number = 0;
    /**
     * MechDog initialization, please execute at boot time
    */
    //% weight=100 blockId=mechdog_init block="Initialize MechDog"
    //% subcategory=Init
    export function mechdog_init() {
        voltage = 7.0;
    }

    //% weight=78 blockId=get_voltage block="Get the electricity value (V)"
    //% subcategory=Base
    export function get_voltage(): number{
        return voltage;
    }

}
