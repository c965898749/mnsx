import { _decorator, Component, find, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { getConfig, getToken } from 'db://assets/script/common/config/config';
import { util } from 'db://assets/script/util/util';
import { FightMap } from '../../../Fight/Canvas/FightMap';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
import { HomeCanvas } from '../../HomeCanvas';
import { RankingCrtl } from '../RankingCrtl/RankingCrtl';
const { ccclass, property } = _decorator;

@ccclass('AscensionPillJinjiCtrl')
export class AscensionPillJinjiCtrl extends Component {
    @property(Node)
    WinCount: Node
    @property(Node)
    GameRanking: Node
    @property({ type: Node, tooltip: "任务列表" }) ContentNode: Node = null;
    @property(Node)
    energyHuoliLabel: Node//活力力显示
    @property(Node)
    Huoli: Node
    gameRanking = 0
    customEventData
    initialized = false;
    huoliEnergy = 0
    MaxEnergy: 720//最大体力值
    // EnergyReturnTime: 600//体力回复时间
    itemId = 0
    timer = 0
    @property({ type: cc.Integer, tooltip: "固定尺寸" })
    energy = 0
    @property(Node)
    remarkNode: Node
    start() {
        // this.refushData()
    }

    



    async render(customEventData) {
        this.customEventData = customEventData;
        this.refushData()
    }

    public refushData() {
        const config = getConfig()
        const token = getToken()
        const postData = {
            token: token,
            userId: config.userData.userId,
            id: this.customEventData
        };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        };
        fetch(config.ServerUrl.url + "duoquJingji", options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // 解析 JSON 响应
            })
            .then(async data => {
                //console.log(data); // 处理响应数据
                if (data.success == '1') {
                    var map = data.data;
                    let userlist = map['user'];
                    this.remarkNode.getComponent(Label).string = "今日还可抢夺 " + map['duoCount'] + " 次"
                    const nodePool = util.resource.getNodePool(
                        await util.bundle.load("prefab/ff6", Prefab)
                    )
                    const childrens = [...this.ContentNode.children]
                    for (let i = 0; i < childrens.length; i++) {
                        const node = childrens[i];
                        node.getChildByName("tiaozhan").off("click")
                        nodePool.put(node)
                    }
                    for (let i = 0; i < userlist.length; i++) {
                        let item = nodePool.get()
                        item.getChildByName("textbox_bg").children[0].getComponent(Label).string = "lv " + userlist[i].lv
                        // 绑定事件
                        item.getChildByName("name").getComponent(Label).string = userlist[i].nickname
                        item.getChildByName("Count").getComponent(Label).string = "胜 " + userlist[i].winCount
                        item.getChildByName("itemCount").getComponent(Label).string = "可抢夺飞升丹：" + userlist[i].itemCount + " 颗"
                        item.getChildByName("yxjm_df_txk").getChildByName("header").getComponent(Sprite).spriteFrame =
                            await util.bundle.load(userlist[i].gameImg, SpriteFrame)
                        item.getChildByName("tiaozhan").on("click", () => { this.clickTiaozhanFun(userlist[i].userId) })
                        this.ContentNode.addChild(item)
                        continue
                    }
                    this.node.active = true
                } else {
                    const close = util.message.confirm({ message: data.errorMsg || "服务器异常" })
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            }
            );
    }

    SetLeaveHuoliEnergy(i) {
        var key = 'Leave_EnergyHuoliNumber2';
        var value = i + "";
        localStorage.setItem(key, value);
    }
    public async clickTiaozhanFun(userId) {
        AudioMgr.inst.playOneShot("sound/other/click");
        // director.addPersistRootNode(this.node);
        const config = getConfig()
        const token = getToken()
        const postData = {
            token: token,
            userId: userId,
            id: config.userData.userId,
            str: this.customEventData
        };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        };
        fetch(config.ServerUrl.url + "battle6", options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // 解析 JSON 响应
            })
            .then(async data => {
                //console.log(data); // 处理响应数据
                if (data.success == '1') {
                    var map = data.data;
                    const rewards = map["rewards"];
                    const battle = map["battle"];
                    this.remarkNode.getComponent(Label).string = "今日还可抢夺 " + map['duoCount'] + " 次"
                    const holAnimationPrefab = await util.bundle.load("prefab/FightMap", Prefab)
                    const holAnimationNode = instantiate(holAnimationPrefab)
                    this.node.parent.addChild(holAnimationNode)
                    await holAnimationNode
                        .getComponent(FightMap)
                        .render(battle.id, rewards, null)
                    find('Canvas').getComponent(HomeCanvas).audioSource.pause()
                    this.node.parent.getChildByName("FightMap").active = true
                } else {
                    const close = util.message.confirm({ message: data.errorMsg || "服务器异常" })
                }

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            }
            );

    }


    goBack() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.active = false
        this.node.parent.getChildByName("JinjiCtrl").active = true
    }

}


