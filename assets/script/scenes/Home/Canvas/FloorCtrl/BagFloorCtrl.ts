import { _decorator, Component, director, Node } from 'cc';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
import { util } from 'db://assets/script/util/util';
const { ccclass, property } = _decorator;

@ccclass('BagFloorCtrl')
export class BagFloorCtrl extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    async goBack() {
        AudioMgr.inst.playOneShot("sound/other/click");
        const close = await util.message.load()
        director.preloadScene("Home", () => close())
        director.loadScene("Home")
    }

}


