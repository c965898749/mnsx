import { _decorator, Component, Event, find, Label, Node, NodeEventType, Sprite, SpriteFrame } from 'cc';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

export type HolIntroduceOption = {
    // 内容
    message: string,
    name: string,
    desc: string,
    icon: string,
    // 按钮一
    buttonOne?: {
        message: string,
        callback: any
    },
    // 按钮二
    buttonTwo?: {
        message: string,
        callback: any
    },
}

@ccclass('HolIntroduceMessage')
export class HolIntroduceMessage extends Component {

    @property(Node)
    ContentNode: Node
    @property(Node)
    NameNode: Node
    @property(Node)
    DescNode: Node
    @property(Node)
    IconNode: Node

    private $closeQueue: Function[] = []

    listen(e: "close", fn: Function) {
        if (e === "close") this.$closeQueue.push(fn)
    }

    // 设置内容async 
    public async setContent(option: HolIntroduceOption) {
        this.ContentNode.getComponent(Label).string = option.message
        this.NameNode.getComponent(Label).string = option.name
        this.DescNode.getComponent(Label).string = option.desc
        this.IconNode.getComponent(Sprite).spriteFrame =
            await util.bundle.load(option.icon, SpriteFrame)
        const introduceNode = this.node.getChildByName("Introduce")
        if (option.buttonOne) {
            const buttonOne = introduceNode.getChildByName("ButtonOne")
            buttonOne.getChildByName("Value").getComponent(Label).string = option.buttonOne.message
            buttonOne.active = true
            buttonOne.on("click", async () => {
                await option.buttonOne.callback()
                this.closeNode()
            })
        }
        if (option.buttonTwo) {
            const buttonTwo = introduceNode.getChildByName("ButtonTwo")
            buttonTwo.getChildByName("Value").getComponent(Label).string = option.buttonTwo.message
            buttonTwo.active = true
            buttonTwo.on("click", async () => {
                await option.buttonTwo.callback()
                this.closeNode()
            })
        }
    }

    // 关闭函数
    public closeNode() {
        const introduceNode = this.node.getChildByName("mian").getChildByName("Introduce")
        introduceNode.getChildByName("ButtonOne").off("click")
        introduceNode.getChildByName("ButtonTwo").off("click")
        for (const close of this.$closeQueue) close()
    }

}

