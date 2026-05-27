import { _decorator, Component, Node, Prefab } from 'cc';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
import { util } from 'db://assets/script/util/util';
const { ccclass, property } = _decorator;

@ccclass('shijianCtrl')
export class shijianCtrl extends Component {
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
            await util.bundle.load("prefab/shijianTiem", Prefab)
        )
        const childrens = [...this.ContentNode.children]
        for (let i = 0; i < childrens.length; i++) {
            const node = childrens[i];
            // node.getChildByName("use").off("click")
            // node.getChildByName("diu").off("click")
            nodePool.put(node)
        }

        for (let i = 0; i < 20; i++) {
            let item = nodePool.get()
            this.ContentNode.addChild(item)
        }

    }

    update(deltaTime: number) {

    }

    goback() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.active = false
    }
}


