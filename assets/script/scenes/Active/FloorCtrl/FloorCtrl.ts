import { _decorator, Component, director, Node } from 'cc';
import { AudioMgr } from '../../../util/resource/AudioMgr';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('FloorCtrl')
export class FloorCtrl extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    // 回到主页
    async GoBack() {
        AudioMgr.inst.playOneShot("sound/other/click");
        const close = await util.message.load()
        director.preloadScene("Home", () => close())
        director.loadScene("Home")
    }
}


