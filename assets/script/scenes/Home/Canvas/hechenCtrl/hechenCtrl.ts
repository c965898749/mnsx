import { _decorator, Button, Component, Node, Prefab, Sprite } from 'cc';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
import { util } from 'db://assets/script/util/util';
const { ccclass, property } = _decorator;

@ccclass('hechenCtrl')
export class hechenCtrl extends Component {
    @property({ type: Node, tooltip: "任务列表" }) ContentNode: Node = null;
    tuPuhenchenList: any;

    initialized: boolean = false
    async start() {
        this.baoshiList()
    }
    onEnable() {
        if (!this.initialized) {
            // 初始化代码
            this.initialized = true;
        } else {
            this.baoshiList()
        }

    }

    async baoshiList() {
        const nodePool = util.resource.getNodePool(
            await util.bundle.load("prefab/baoshi", Prefab)
        )
        const childrens = [...this.ContentNode.children]
        for (let i = 0; i < childrens.length; i++) {
            const node = childrens[i];
            // node.off("click")
            // node.getComponent(Button).transition = 0
            nodePool.put(node)
        }
        for (let i = 0; i < 15; i++) {
            // for (let i = 0; i < this.tuPuhenchenList.length; i++) {
            // let character = this.tuPuhenchenList[i]
            const node = nodePool.get()
            // node.getChildByName("Avatar").getComponent(Sprite).spriteFrame = await util.bundle.load(`game/texture/frames/hero/Header/${character.id}/spriteFrame`, SpriteFrame)
            // node.getComponent(Button).transition = 3
            // node.getComponent(Button).zoomScale = 0.9
            this.ContentNode.addChild(node)
            // 绑定事件
            // node.on("click", () => this.tupuhenchen(character.id))
            continue
        }
    }

    update(deltaTime: number) {

    }
    goback() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.active = false
    }
}


