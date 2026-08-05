import { _decorator, AudioClip, AudioSource, Component, director, EventTouch, find, instantiate, Label, log, math, Node, Prefab, screen, Sprite, SpriteFrame, tween, UITransform, v3, Vec3 } from 'cc';
import { util } from '../../../util/util';
import { getConfig, getToken } from '../../../common/config/config';
import { AudioMgr } from "../../../util/resource/AudioMgr";
import { CharacterState, CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { LCoin } from '../../../common/common/Language';
// import { HolPreLoad } from '../../../prefab/HolPreLoad';
import { HomeCanvas } from '../HomeCanvas';
import { Rewards } from '../rewards/Rewards';
import { PosInfo } from './base';
import { CardInfo } from './CardInfo';
const { ccclass, property } = _decorator;

@ccclass('HomeBuildings')
export class HomeBuildings extends Component {
    /**mask的uitransform */
    @property(UITransform)
    maskUITransform: UITransform = null!

    @property(Node)
    expBar: Node
    /**跑马灯label */
    @property(Node)
    pmdNode: Node = null!

    /**跑马灯的UITransform */
    @property(UITransform)
    pmdUITransform: UITransform = null!

    @property(Label)
    noticeLabel

    //跑马灯移动速度
    @property()
    speed = 1
    @property(Node)
    Item: Node
    power: number = 0;
    notices = []
    initialized = false;
    /**跑马灯文本初始坐标 */
    private pmdOriginPos: Vec3 = null!
    @property(Node)
    btnDiaocan: Node = null;
    @property(Node)
    Tili: Node
    @property(Node)
    Huoli: Node
    @property(Node)
    energyLabel: Node//体力显示
    @property(Node)
    energyHuoliLabel: Node//活力力显示
    @property({ type: cc.Integer, tooltip: "固定尺寸" })
    MaxEnergy: 720//最大体力值
    // EnergyReturnTime: 600//体力回复时间
    timer = 0
    @property({ type: cc.Integer, tooltip: "固定尺寸" })
    energy = 0
    huoliEnergy = 0
    @property(Node)
    cardNodes: Node


    private _posInfos: PosInfo[] = [];

    onLoad() {
        this.initPosInfos();
        this.initNodes();
        this.cardNodes.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }


    private initPosInfos(): void {
        this._posInfos = [
            { scale: 1, alpha: 255, siblingIndex: 1, pos: new Vec3(0, 0, 0) },
            { scale: 1, alpha: 200, siblingIndex: 1, pos: new Vec3(200, 0, 0) },
            { scale: 0.6, alpha: 50, siblingIndex: 0, pos: new Vec3(150, 0, 0) },
            { scale: 0.6, alpha: 50, siblingIndex: 0, pos: new Vec3(-150, 0, 0) },
            { scale: 1, alpha: 200, siblingIndex: 1, pos: new Vec3(-200, 0, 0) },
        ];
    }

    private initNodes(): void {
        for (let i = 0; i < this.cardNodes.children.length; i++) {
            const child = this.cardNodes.getChildByName("card" + (i + 1))
            const cardInfo = child.addComponent(CardInfo);
            this._posInfos[i].pos = v3(child.position.x, child.position.y, child.position.z);
            cardInfo.initPosInfo(this._posInfos[i], i);
        }
        //  console.info("节点初始化完成",this.cardNodes.children);
    }

    private onTouchMove(event: EventTouch): void {
        if (this.isAnimPlaying()) return;
        const deltaX = event.getDeltaX();
        if (deltaX > 5) {
            this.rotateRight();
        } else if (deltaX < -5) {
            this.rotateLeft();
        }
    }

    private isAnimPlaying(): boolean {
        for (const child of this.cardNodes.children) {
            const info = child.getComponent(CardInfo);
            if (info && info.isAnimating()) return true;
        }
        return false;
    }

    private rotateLeft(): void {
        this.cardNodes.children.forEach((child, index) => {
            const itemInfo = child.getComponent(CardInfo);
            if (itemInfo.index > 0) {
                itemInfo.index--;
            } else {
                itemInfo.index = this.cardNodes.children.length - 1;
            }
            itemInfo.rotateAction(this._posInfos[itemInfo.index]);
        });
    }

    private rotateRight(): void {
        this.cardNodes.children.forEach((child, index) => {
            const itemInfo = child.getComponent(CardInfo);
            if (itemInfo.index < this.cardNodes.children.length - 1) {
                itemInfo.index++;
            } else {
                itemInfo.index = 0;
            }
            itemInfo.rotateAction(this._posInfos[itemInfo.index]);
        });
    }

    protected async start() {
        const config = getConfig()
        // 音乐们
        const musics = await util.bundle.loadDir<AudioClip>("sound/home", AudioClip)
        const music = musics[Math.floor(musics.length * Math.random())]
        let Canvas = find("Canvas")
        let audioSource = Canvas.getComponent(HomeCanvas).audioSource
        audioSource.clip = music
        audioSource.volume = config.volume * config.volumeDetail.home
        audioSource.play()
        this.node.getChildByName("top").getChildByName("Name").getChildByName("kuan").getChildByName("name").getComponent(Label).string = config.userData.nickname
        this.node.getChildByName("top").getChildByName("headimg").getChildByName("img").getComponent(Sprite).spriteFrame =
                await util.bundle.load(config.userData.gameImg, SpriteFrame)

    }

    otherBtn() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.getChildByName("other_kuan").active = !this.node.getChildByName("other_kuan").active
    }

    openBagBtn() {
        AudioMgr.inst.playOneShot("sound/other/click");
        director.loadScene("BagCrtl")
    }

    openShijianBtn() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("shijian").active = true
    }

    openChoukaBtn() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("shouquan").active = true
    }

    openRecruitBtn() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("RecruitCtrl").active = true
    }
    openChatBtn() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("ChatCrtl").active = true
    }
    protected async start111() {
        // HolPreLoad 预加载进度条
        console.log(777)
        // const holPreLoad = this.node.parent.getChildByName("HolPreLoad").getComponent(HolPreLoad)
        // holPreLoad.setTips([
        //     "提示\n不同阵营之间相互克制，巧用阵营可以出奇制胜",
        // ])
        // holPreLoad.setProcess(10)
        const config = getConfig()
        // 音乐们
        const musics = await util.bundle.loadDir<AudioClip>("sound/home", AudioClip)
        const music = musics[Math.floor(musics.length * Math.random())]
        let Canvas = find("Canvas")
        let audioSource = Canvas.getComponent(HomeCanvas).audioSource
        audioSource.clip = music
        audioSource.volume = config.volume * config.volumeDetail.home
        audioSource.play()
        // holPreLoad.setProcess(30)
        if (this.isAroundChristmas()) {
            this.node.getChildByName("zhanhuan").getChildByName("zhanhuan2").active = true
            this.node.getChildByName("Conquer").getComponent(Sprite).spriteFrame =
                await util.bundle.load(`image/building/conquer2/spriteFrame`, SpriteFrame)
            this.node.getChildByName("Campaign").getComponent(Sprite).spriteFrame =
                await util.bundle.load(`image/building/zhangyi2/spriteFrame`, SpriteFrame)
            this.node.getChildByName("Shop").getComponent(Sprite).spriteFrame =
                await util.bundle.load(`image/building/shop2/spriteFrame`, SpriteFrame)
            this.node.getChildByName("Courage").getComponent(Sprite).spriteFrame =
                await util.bundle.load(`image/building/courage2/spriteFrame`, SpriteFrame)
        }
        // holPreLoad.setProcess(50)
        // 当前进度
        let process = 50
        this.node.getChildByName("Top").getChildByName("Gold").getComponent(Label).string = LCoin(config.userData.gold)
        this.node.getChildByName("Top").getChildByName("Lv").getComponent(Label).string = "Lv " +
            util.sundry.formateNumber(config.userData.lv)
        // this.node.getChildByName("Top").getChildByName("Diamond").getChildByName("Label").getComponent(Label).string = config.userData.diamond + ""
        this.node.getChildByName("Top").getChildByName("Nickname").getComponent(Label).string = config.userData.nickname
        this.expBar.setScale(
            config.userData.exp / 1000,
            1,
            1
        )
        const create = config.userData.characters.filter(x => x.goIntoNum != 0)
        if (config.userData.gameImg) {
            this.node.getChildByName("Top").getChildByName("head_img").getChildByName("header_qitiandashen").getComponent(Sprite).spriteFrame =
                await util.bundle.load(config.userData.gameImg, SpriteFrame)
        }
        this.node.getChildByName("mid").getChildByName("user_win_count").getComponent(Label).string = config.userData.winCount + ""
        //初始化战力
        this.power = 0
        // 渲染队伍gameImg
        this.Item.children.forEach(n => n.children[0].getComponent(Sprite).spriteFrame = null)
        this.node.getChildByName("mid").getChildByName("user_card_count").getComponent(Label).string = config.userData.characters.length + "/" + config.userData.useCardCount
        for (let i = 0; i < create.length; i++) {
            var goIntoNum = create[i].goIntoNum
            this.Item.children[goIntoNum - 1].children[0].getComponent(Sprite).spriteFrame =
                await util.bundle.load(`game/texture/frames/hero/Header/${create[i].id}/spriteFrame`, SpriteFrame)
            this.power = this.power + parseInt(this.getZhanli(create[i]).toString())
        }
        //初始化跑马灯文本的位置
        //因为mask和label节点x锚点都是0，所以x坐标的初始位置是mask的长度
        let pos = this.pmdNode.getPosition()
        this.pmdOriginPos = v3(this.maskUITransform.width, pos.y, pos.z)
        this.pmdNode.setPosition(this.pmdOriginPos)
        // 监听进度条完成函数
        // 设置 100%
        //战力计算
        this.node.getChildByName("mid").getChildByName("user_fight_count").getComponent(Label).string = this.power + ""
        // holPreLoad.setProcess(100)
    }

    isAroundChristmas(): boolean {
        // 获取当前本地时间的日期对象
        const today = new Date();

        // 提取月份（注意：getMonth() 返回 0-11，所以12月对应 11）
        const month = today.getMonth();
        // 提取日期（1-31）
        const day = today.getDate();

        // 圣诞节是12月25日，前后3天即 25-3=22 到 25+3=28
        // 所以判断条件：12月 且 日期在 22-28 之间
        return month === 11 && day >= 22 && day <= 28;
    }

    public getZhanli(create: CharacterStateCreate) {
        // let zhanli = propts[PART_PROPTS.GongJi] * 25 + propts[PART_PROPTS.FangYu] * 25 + propts[PART_PROPTS.XueLiang] + propts[PART_PROPTS.BaoJi] * 2 + 500 * propts[PART_PROPTS.ShanBi] + 300 * (propts[PART_PROPTS.HuoGong] + propts[PART_PROPTS.HuoKang] + propts[PART_PROPTS.BingGong] + propts[PART_PROPTS.BingKang])
        let zhanli = create.attack * 25 + create.defence ? create.defence * 25 : 0 + create.maxHp + 300 * create.speed
        return zhanli;
    }


    onEnable() {
        // updateTiliAndHuoLi()
        // if (!this.initialized) {
        //     // 初始化代码
        //     this.initialized = true;
        // } else {

        //     this.refresh()
        // }

    }


    protected onDiaocanBtnClick() {
        AudioMgr.inst.playOneShot("sound/other/hongb");
        this.btnDiaocan.active = false
        const config = getConfig()
        const token = getToken()
        const postData = {
            token: token,
            userId: config.userData.userId,
        };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        };
        fetch(config.ServerUrl.url + "hongb", options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // 解析 JSON 响应
            })
            .then(async data => {
                if (data.success == '1') {

                    var map = data.data;
                    var user = map['user'];
                    const reward = map["rewards"];
                    config.userData.bronze1 = user.bronze1
                    config.userData.gold = user.gold
                    config.userData.diamond = user.diamond
                    config.userData.bronze = user.bronze
                    config.userData.darkSteel = user.darkSteel
                    config.userData.purpleGold = user.purpleGold
                    config.userData.crystal = user.crystal
                    config.userData.characters = user.characterList
                    localStorage.setItem("UserConfigData", JSON.stringify(config))
                    const rewardsFab = await util.bundle.load("prefab/rewards", Prefab)
                    const rewards = instantiate(rewardsFab)
                    this.node.parent.addChild(rewards)
                    await rewards
                        .getComponent(Rewards)
                        .read(reward)
                    // this.node.active = false
                    // find('Canvas').getComponent(HomeCanvas).audioSource.pause()
                    // this.node.parent.getChildByName("FightSuccess").active = true
                } else {
                    const close = util.message.confirm({ message: data.errorMsg || "服务器异常" })
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            }
            );
    }

    async refresh() {
        this.btnDiaocan.active = false
        // 你的刷新逻辑
        console.log('节点被激活，正在刷新状态');
        // 例如，重新加载数据，更新UI等
        const config = getConfig()
        const create = config.userData.characters.filter(x => x.goIntoNum != 0)
        this.Item.children.forEach(n => n.children[0].getComponent(Sprite).spriteFrame = null)
        this.node.getChildByName("Top").getChildByName("Lv").getComponent(Label).string = "Lv " +
            util.sundry.formateNumber(config.userData.lv)
        this.node.getChildByName("Top").getChildByName("Gold").getComponent(Label).string =
            LCoin(config.userData.gold)
        //初始化战力
        this.power = 0
        // console.log(config.userData.gameImg, 444)
        if (config.userData.gameImg) {
            this.node.getChildByName("Top").getChildByName("head_img").getChildByName("header_qitiandashen").getComponent(Sprite).spriteFrame =
                await util.bundle.load(config.userData.gameImg, SpriteFrame)
        }
        for (let i = 0; i < create.length; i++) {
            var goIntoNum = create[i].goIntoNum
            this.Item.children[goIntoNum - 1].children[0].getComponent(Sprite).spriteFrame =
                await util.bundle.load(`game/texture/frames/hero/Header/${create[i].id}/spriteFrame`, SpriteFrame)
            this.power = this.power + parseInt(this.getZhanli(create[i]).toString())
        }
        this.node.getChildByName("mid").getChildByName("user_card_count").getComponent(Label).string = config.userData.characters.length + "/" + config.userData.useCardCount
        // this.node.getChildByName("Top").getChildByName("head_img").getChildByName("header_qitiandashen").getComponent(Sprite).spriteFrame =
        //     await util.bundle.load(config.userData.gameImg, SpriteFrame)
        this.node.getChildByName("mid").getChildByName("user_fight_count").getComponent(Label).string = this.power + ""
        this.node.getChildByName("mid").getChildByName("user_win_count").getComponent(Label).string = config.userData.winCount + ""
        this.expBar.setScale(
            config.userData.exp / 1000,
            1,
            1
        )

        const token = getToken()
        const postData = {
            token: token,
            userId: config.userData.userId,
        };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        };
        fetch(config.ServerUrl.url + "isNewYear", options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // 解析 JSON 响应
            })
            .then(async data => {
                if (data.success == '1') {
                    if (data.data) {
                        this.btnDiaocan.active = true
                        tween(this.btnDiaocan).to(3, { x: 300, y: 220 }).to(3, { x: -300, y: 120 }).to(3, { x: 300, y: 20 }).to(3, { x: -300, y: -90 }).to(3, { x: 300, y: -80 }).to(3, { x: -300, y: -80 }).to(3, { x: 300, y: 20 }).to(3, { x: -300, y: 120 }).to(3, { x: 300, y: 220 }).to(3, { x: -300, y: 350 }).union().repeatForever().start()
                    }
                } else {
                    const close = util.message.confirm({ message: data.errorMsg || "服务器异常" })
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            }
            );
    }
    update(deltaTime: number) {

    }
    async update1111(deltaTime: number) {
        if (this.timer >= 50) {
            // console.log("GetLeaveEnergyTime:", this.GetLeaveEnergyTime());
            this.timer = 0;
        }
        else {
            this.timer++;
        }
        const config = getConfig()
        await new Promise(res => setTimeout(res, 5000))
        if (this.pmdNode) {
            if (this.pmdNode.getPosition().x < -this.pmdUITransform.width) {
                //回到初始点
                //console.log(this.notices)
                if (this.notices.length > 0) {
                    this.noticeLabel.string = this.notices[0]
                    this.notices = this.notices.slice(1);
                } else {
                    const options = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    };
                    fetch(config.ServerUrl.url + "notice", options)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json(); // 解析 JSON 响应
                        })
                        .then(async data => {
                            //console.log(data); // 处理响应数据
                            if (data.success == '1') {
                                this.notices = data.data
                            } else {
                                const close = util.message.confirm({ message: data.errorMsg || "服务器异常" })
                            }
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        }
                        );

                }
                this.pmdNode.setPosition(this.pmdOriginPos)
            } else {
                let originPos = this.pmdNode.getPosition()
                this.pmdNode.setPosition(v3(originPos.x - this.speed, originPos.y, originPos.z))
            }
        }
    }






}

