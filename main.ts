/*
 MechDog package
*/
//% weight=10 icon="\uf013" color=#ff7f00
namespace MechDog {

    export enum action_name {
        //% block="Left foot kick"
        left_foot_kick = 0x1,
        //% block="Right foot kick"
        right_foot_kick = 0x2,
        //% block="Stand on all fours"
        stand_four_legs = 0x3,
        //% block="Sit dowm"
        sit_dowm = 0x4,
        //% block="go prone"
        go_prone = 0x5,
        //% block="Stand on two legs"
        stand_two_legs = 0x6,
        
        //% block="Handshake"
        handshake = 0x7,
        //% block="Scrape a bow"
        scrape_a_bow = 0x8,
        //% block="Nod"
        nodding_motion = 0x9,
        //% block="Boxing"
        boxing = 0x10,
        //% block="Stretch oneself"
        stretch_oneself = 0x11,
        //% block="Pee"
        pee = 0x12,
        //% block="press-up"
        press_up = 0x13,
        //% block="Turning pitch"
        rotation_pitch = 0x14,
        //% block="Turning roll"
        rotation_roll = 0x15,
        //% block="Normal attitude"
        normal_attitude = 0x16
    }

    const INVALID_PORT = 0xff;
    let voltage: number = 0;
    /*
    1、恢复到初始化姿态，时间(500ms)
    2、抬高/降低身体(mm)，时间(500ms)
    3、左/右倾身体(度)，时间(500ms)
    4、设置步态参数，抬腿时间(150ms)，脚尖接地时间(500ms)，抬腿高度(40mm)
    
    5、设置前进步幅(80mm)和运动的方向角度(0度)
    
    6、运行默认动作组
    7、运行动作组名(1)的动作组
    8、停止动作组运行

    9、电量返回值
    10、发光超声波距离
    */

    function send_data(data: number){

    }

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

    //% weight=70 blockId=default_action_run block="Run the %action action group"
    //% subcategory=Kinematics
    export function default_action_run(action : action_name){
        send_data(action);
    }

}

