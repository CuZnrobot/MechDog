/*
 MechDog package
*/
//% weight=10 icon="\uf013" color=#ff7f00
namespace MechDog {

    export enum default_atcion_name {
        //% block="Left kick"
        left_foot_kick = 0x1,
        //% block="Right kick"
        right_foot_kick = 0x2,
        //% block="Four-legged standing"
        stand_four_legs = 0x3,
        //% block="Sit down"
        sit_dowm = 0x4,
        //% block="Get down"
        go_prone = 0x5,
        //% block="Two-legged standing"
        stand_two_legs = 0x6,
        //% block="Handshake"
        handshake = 0x7,
        //% block="Bow"
        scrape_a_bow = 0x8,
        //% block="Nod"
        nodding_motion = 0x9,
        //% block="Boxing"
        boxing,
        //% block="Stretch"
        stretch_oneself,
        //% block="Pee"
        pee,
        //% block="Push up"
        press_up,
        //% block="Rotate PITCH"
        rotation_pitch,
        //% block="Rotate ROLL"
        rotation_roll,
        //% block="Attention"
        normal_attitude
    }

    export enum roll_dir {
        //% block="Left"
        left = 0x1,
        //% block="Right"
        right = 0x2
    }

    export enum pitch_dir {
        //% block="Forerake"
        forerake = 0x1,
        //% block="Hypsokinesis"
        hypsokinesis = 0x2
    }

    export enum run_dir {
        //% block="Go forward"
        go = 0x1,
        //% block="Go backward"
        back = 0x2
    }


    const MECHDOG_IIC_ADDR = 0x32
    let voltage: number = 0;
    let sonar_distance: number = 0

    /**
     * Please perform the initialization upon booting up the robot
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
    //% weight=70 blockId=set_default_pose block="Set MechDog initialization posture"
    //% subcategory=Kinematics
    export function set_default_pose() {
        //1、恢复到初始化姿态，时间(500ms)
        let buf = pins.createBuffer(2)
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x01)
        buf.setNumber(NumberFormat.UInt8LE, 1, 0x01)
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }

    /**
     * Set MechDog body change roll
    */
    //% weight=69 blockId=change_roll block="Set MechDog | %direction | to turn | %distance | degrees ,duration | %time |ms"
    //% subcategory=Kinematics
    //% distance.min=0 distance.max=40
    /**
     * TODO: describe your function here
     * @param distance describe parameter here, eg: 10
     * @param time describe parameter here, eg: 100
     */
    export function change_roll(direction: roll_dir, distance: number, time: number) {
        //2、转动roll(度)，时间(500ms)
        let buf = pins.createBuffer(5) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x02)
        if (direction == roll_dir.right)
            distance = -distance
        buf.setNumber(NumberFormat.Int16LE, 1, distance) //这里的下标是按开始字节下标算的
        buf.setNumber(NumberFormat.UInt16LE, 3, time) //所以这里是3，第3个字节开始的
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }


    /**
     * Set the MechDog body change pitch
    */
    //% weight=68 blockId=change_pitch block="Set MechDog | %x_direction | to turn | %x_distance | degrees ,duration | %x_time |ms"
    //% subcategory=Kinematics
    //% x_distance.min=0 x_distance.max=40
    /**
     * TODO: describe your function here
     * @param x_distance describe parameter here, eg: 10
     * @param x_time describe parameter here, eg: 100
     */
    export function change_pitch(x_direction: pitch_dir, x_distance: number, x_time: number) {
        //3、转动pitch(度) ，时间(500ms)
        let buf = pins.createBuffer(5) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x04)
        if (x_direction == pitch_dir.hypsokinesis)
            x_distance = -x_distance
        buf.setNumber(NumberFormat.Int16LE, 1, x_distance) //这里的下标是按开始字节下标算的
        buf.setNumber(NumberFormat.UInt16LE, 3, x_time) //所以这里是3，第3个字节开始的
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }

    //4、设置步态参数，抬腿时间(150ms) ，脚尖接地时间(500ms) ，抬腿高度(40mm)

    /**
     * Make the MechDog move
    */
    //% weight=67 blockId=run block="Set MechDog's | %direction | | %stride | mm, movement direction angle to | %angle | degrees"
    //% subcategory=Kinematics
    //% stride.min=0 stride.max=150
    //% angle.min=-50 angle.max=50
    /**
     * TODO: describe your function here
     * @param stride describe parameter here, eg: 40
     * @param angle describe parameter here, eg: 0
     */
    export function run(direction: run_dir, stride: number, angle: number) {
        // 5、设置前进步幅(80mm)和运动的方向角度(0度)
        let buf = pins.createBuffer(3) //这里的num是按字节算的
        if (direction == run_dir.back)
        {
            stride = -stride
        }
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x06)
        buf.setNumber(NumberFormat.Int8LE, 1, stride) //这里的下标是按开始字节下标算的
        buf.setNumber(NumberFormat.Int8LE, 2, angle) //所以这里是3，第3个字节开始的
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }


    /**
     * Run the default action group
    */
    //% weight=66 blockId=run_default_action block="MechDog run action group named %default_action"
    //% subcategory=Kinematics
    export function run_default_action(default_action: default_atcion_name) {
        // 6、运行默认动作组
        let buf = pins.createBuffer(3) //这里的num是按字节算的
        buf.setNumber(NumberFormat.UInt8LE, 0, 0x07)
        buf.setNumber(NumberFormat.UInt8LE, 1, default_action)
        buf.setNumber(NumberFormat.UInt8LE, 2, 0x00)
        pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
    }



    /**
     * Run the user action group
    */
    //% weight=65 blockId=run_action block="MechDog run action group named %action_number"
    //% subcategory=Kinematics
    //% action_number.min=1 action_number.max=255
    /**
     * TODO: describe your function here
     * @param action_number describe parameter here, eg: 1
     */
    export function run_action(action_number: number) {
        if(action_number > 0 && action_number < 255)
        {
            // 7、运行动作组名(1)的动作组
            let buf = pins.createBuffer(3) //这里的num是按字节算的
            buf.setNumber(NumberFormat.UInt8LE, 0, 0x07)
            buf.setNumber(NumberFormat.Int16LE, 1, 0x00)
            buf.setNumber(NumberFormat.Int16LE, 2, action_number)
            pins.i2cWriteBuffer(MECHDOG_IIC_ADDR, buf)
        }
    }

    /**
     * Stop running action group
    */
    //% weight=64 blockId=stop_action block="Stop running action group"
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
     * Get the electricity value (V)
    */
    //% weight=78 blockId=get_voltage block="Get the electricity value (V)"
    //% subcategory=Sensor
    export function get_voltage(): number {
        // 9、电量返回值
        voltage = iicreadnum(0x09 , 2 , NumberFormat.UInt16LE)
        return voltage;
    }


    /**
     * Get the distance value(mm) detected by ultrasonic
    */
    //% weight=77 blockId=get_sonar_distance block="Get the distance value(mm) detected by ultrasonic"
    //% subcategory=Sensor
    export function get_sonar_distance(): number {
        // 10、发光超声波距离
        let dis = iicreadnum(0x0A, 2, NumberFormat.UInt16LE)
        if(dis > 500)
        {
            sonar_distance = 500
        }else{
            sonar_distance = dis
        }
        return sonar_distance;
    }

}

