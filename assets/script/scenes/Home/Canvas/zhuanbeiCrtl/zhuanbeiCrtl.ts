import { _decorator, Component, Node, Prefab } from 'cc';
import { util } from 'db://assets/script/util/util';
const { ccclass, property } = _decorator;

@ccclass('zhuanbeiCrtl')
export class zhuanbeiCrtl extends Component {
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
            await util.bundle.load("prefab/items2", Prefab)
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
}


