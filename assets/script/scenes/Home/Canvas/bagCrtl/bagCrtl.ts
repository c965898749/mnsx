import { _decorator, Component, director, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { getConfig, getToken } from 'db://assets/script/common/config/config';
import { HolPreLoad } from 'db://assets/script/prefab/HolPreLoad';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
import { util } from 'db://assets/script/util/util';
const { ccclass, property } = _decorator;

@ccclass('bagCrtl')
export class bagCrtl extends Component {
    @property({ type: Node, tooltip: "任务列表" }) ContentNode: Node = null;
    initialized: boolean = false
    async start() {
        this.refresh()
    }
    onEnable() {
        if (!this.initialized) {
            // 初始化代码
            this.initialized = true;
        } else {
            this.refresh()
        }

    }

    async refresh() {
        this.node.active = true
        const nodePool = util.resource.getNodePool(
            await util.bundle.load("prefab/items", Prefab)
        )
        const childrens = [...this.ContentNode.children]
        for (let i = 0; i < childrens.length; i++) {
            const node = childrens[i];
            node.getChildByName("yxjm_df_txk").getChildByName("Sprite").off("click")
            // node.getChildByName("use").off("click")
            // node.getChildByName("diu").off("click")
            nodePool.put(node)
        }

        for (let i = 0; i < 20; i++) {
            let item = nodePool.get()
            item.getChildByName("yxjm_df_txk").getChildByName("Sprite").on("click", () => { this.showdetail() })
            this.ContentNode.addChild(item)
        }

    }

    async showdetail() {
    
        await util.message.introduce({ message: "这是一个物品的介绍", name: "同修石", desc: "已拥有:9999999", icon: "/game/texture/frames/emp/17000109/spriteFrame" })
    }

    update(deltaTime: number) {

    }

    openLianhua() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("hechen").active = true
    }
}


