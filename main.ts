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

    export enum z_dir {
        //% block="Raise"
        raise = 0x1,
        //% block="Lower"
        lower = 0x2
    }

    export enum x_dir {
        //% block="Forward"
        forward = 0x1,
        //% block="Backward"
        backward = 0x2
    }

    export enum run_dir {
        //% block="Go"
        go = 0x1,
        //% block="Bcak"
        back = 0x2
    }

    export enum default_atcion_name {
        //% block="left_foot_kick"
        left_foot_kick = 0x1,
        //% block="right_foot_kick"
        right_foot_kick,
        //% block="stand_four_legs"
        stand_four_legs,
        //% block="sit_dowm"
        sit_dowm,
        //% block="go_prone"
        go_prone,
        //% block="stand_two_legs"
        stand_two_legs,
        //% block="handshake"
        handshake,
        //% block="scrape_a_bow"
        scrape_a_bow,
        //% block="nodding_motion"
        nodding_motion,
        //% block="boxing"
        boxing,
        //% block="stretch_oneself"
        stretch_oneself,
        //% block="pee"
        pee,
        //% block="press_up"
        press_up,
        //% block="rotation_pitch"
        rotation_pitch,
        //% block="rotation_roll"
        rotation_roll
    }



    const MECHDOG_IIC_ADDR = 0x32
    let voltage: number = 0;

    


    /**
     * MechDog initialization, please execute at boot time
    */
    //% weight=100 blockId=mechdog_init block="Initialize MechDog"
    //% subcategory=Init
    export function mechdog_init() {
        basic.clearScreen()
        //动作暂停
        stop_action()
        basic.pause(200)
        //运动暂停
        run(run_dir.go , 0 , 0)
        basic.pause(1000)
        set_default_pose()
        basic.pause(1000)
    }


    /**
     * Set MechDog as the default standing posture
    */
    //% weight=70 blockId=set_default_pose block="Set to the initial standing position"
    //% subcategory=Kinematics
    export function set_default_pose() {
        //1、恢复到初始化姿态，时间(500ms)
        let buf = pins.createBuffer(2)
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x01)
        buf.setNumber(NumberFormat.UInt8LE, 1, 0x01)
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }

    // Set MechDog | %direction | | %distance |mm and run time | %time |ms

    /**
     * Raise or lower the body
    */
    //% weight=69 blockId=change_height block="Set MechDog | %direction | | %distance |mm and run time | %time |ms"
    //% subcategory=Kinematics
    export function change_height(direction: z_dir, distance: number, time: number) {
        //2、抬高/降低身体(mm)，时间(500ms)
        let buf = pins.createBuffer(5) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x02)
        if (direction == z_dir.lower)
            distance = -distance
        buf.setNumber(NumberFormat.Int16LE, 1, distance) //这里的下标是按开始字节下标算的
        buf.setNumber(NumberFormat.UInt16LE, 3, time) //所以这里是3，第3个字节开始的
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }


    /**
     * Forward and backward the body
    */
    //% weight=68 blockId=change_forward_back block="Set MechDog | %x_direction | | %x_distance |mm and run time | %x_time |ms"
    //% subcategory=Kinematics
    export function change_forward_back(x_direction: x_dir, x_distance: number, x_time: number) {
        //3、前/后 平移身体(度) ，时间(500ms)
        let buf = pins.createBuffer(5) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x04)
        if (x_direction == x_dir.backward)
            x_distance = -x_distance
        buf.setNumber(NumberFormat.Int16LE, 1, x_distance) //这里的下标是按开始字节下标算的
        buf.setNumber(NumberFormat.UInt16LE, 3, x_time) //所以这里是3，第3个字节开始的
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }

    //4、设置步态参数，抬腿时间(150ms) ，脚尖接地时间(500ms) ，抬腿高度(40mm)

    /**
     * Make the MechDog move
    */
    //% weight=67 blockId=run block="Set MechDog %direction stride to %stride mm and the direction Angle of movement to %angle degrees"
    //% subcategory=Kinematics
    export function run(direction: run_dir, stride: number, angle: number) {
        // 5、设置前进步幅(80mm)和运动的方向角度(0度)
        let buf = pins.createBuffer(3) //这里的num是按字节算的
        if (direction == run_dir.back)
        {
            stride = -stride
        }
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x06)
        buf.setNumber(NumberFormat.Int16LE, 1, stride) //这里的下标是按开始字节下标算的
        buf.setNumber(NumberFormat.Int16LE, 2, angle) //所以这里是3，第3个字节开始的
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }


    /**
     * Run the default action group
    */
    //% weight=66 blockId=run_default_action block="Run the %default_action action group"
    //% subcategory=Kinematics
    export function run_default_action(default_action: default_atcion_name) {
        // 6、运行默认动作组
        let buf = pins.createBuffer(3) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x07)
        buf.setNumber(NumberFormat.Int16LE, 1, default_action)
        buf.setNumber(NumberFormat.Int16LE, 2, 0x00)
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }



    /**
     * Run the user action group
    */
    //% weight=65 blockId=run_action block="Run the %action_number action group"
    //% subcategory=Kinematics
    export function run_action(action_number: number) {
        // 7、运行动作组名(1)的动作组
        let buf = pins.createBuffer(3) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x07)
        buf.setNumber(NumberFormat.Int16LE, 1, 0x00)
        buf.setNumber(NumberFormat.Int16LE, 2, action_number)
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }
    
    /**
     * Stop group
    */
    //% weight=64 blockId=stop_action block="Stop group"
    //% subcategory=Kinematics
    export function stop_action() {
        // 8、停止动作组运行
        let buf = pins.createBuffer(2) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x08)
        buf.setNumber(NumberFormat.Int16LE, 1, 0x01)
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }

    function iicreadtobuf(reg: number, length: number): Buffer {
        let buf = pins.createBuffer(1)
        buf.setNumber(NumberFormat.UInt8LE, 0, reg & 0xFF)
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
        return pins.i2cReadBuffer(MECHDOG_IIC_ADDR, length)
    }
    function iicreadnum(reg: number, btye_num: number, tupe: NumberFormat): number {
        let buf = iicreadtobuf(reg, btye_num)
        return buf.getNumber(tupe, 0)
    }

    /**
     * Gets the power value of MechDog
    */
    //% weight=78 blockId=get_voltage block="Get the electricity value (V)"
    //% subcategory=Sensor
    export function get_voltage(): number {
        // 9、电量返回值
        voltage = iicreadnum(0x09 , 2 , NumberFormat.UInt16LE)
        return voltage;
    }


    /**
     * Gets the sonar distance
    */
    //% weight=77 blockId=get_sonar_distance block="Get the sonar distance (mm)"
    //% subcategory=Sensor
    export function get_sonar_distance(): number {
        // 10、发光超声波距离
        voltage = iicreadnum(0x0A, 2, NumberFormat.UInt16LE)
        return voltage;
    }

}

