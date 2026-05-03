import { _decorator, Component, Node, tween, Vec3, Sprite, Color, TweenSystem } from 'cc';
import { PosInfo } from './base';
const { ccclass } = _decorator;

@ccclass('CardInfo')
export class CardInfo extends Component {
    public curInfo: PosInfo | null = null;
    public index: number = 0;
    private _sprite: Sprite | null = null;
    public falg=false;
    onLoad() {
        this._sprite = this.getComponent(Sprite);
    }

    public initPosInfo(posInfo: PosInfo, index: number): void {
        this.curInfo = posInfo;
        this.index = index;

        this.node.setPosition(posInfo.pos);
        this.node.setScale(new Vec3(posInfo.scale, posInfo.scale, 1));

        if (this._sprite) {
            this._sprite.color = new Color(255, 255, 255, posInfo.alpha);
        }

        this.node.setSiblingIndex(posInfo.siblingIndex);
    }

    public rotateAction(posInfo: PosInfo): void {
        if (!posInfo) return;

        // if (this.curInfo === posInfo) {
        //     return;
        // }
        this.falg=true;
        tween(this.node).to(0.2, {
            position: posInfo.pos,
            // scale: new Vec3(posInfo.scale, posInfo.scale, 1)
        }).start();

        if (this._sprite) {
            tween(this._sprite).to(0.2, {
                color: new Color(255, 255, 255, posInfo.alpha)
            }).call(() => {
            // ✅ 这里代表：已经移动到目标位置
            // console.log("节点已到达目标位置！");
            
            // 你可以在这里写后续逻辑
            this.falg=false
            }).start();
        }

        this.scheduleOnce(() => {
            this.node.setSiblingIndex(posInfo.siblingIndex);
        }, 0.2);
    }


    /** 是否正在动画中 */
    isAnimating(): boolean {

        return this.falg;
    }


}