import { _decorator, Component, director, Node } from 'cc';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
import { util } from 'db://assets/script/util/util';
const { ccclass, property } = _decorator;

@ccclass('BagFloorCtrl')
export class BagFloorCtrl extends Component {
    @property(Node)
    thingBtn: Node = null;
    @property(Node)
    zhuanbeiBtn: Node = null
    @property(Node)
    fashuBtn: Node = null
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

    openThing() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.thingBtn.active = true;
        this.zhuanbeiBtn.active = false;
        this.fashuBtn.active = false;
    }

    openZhuanbei() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.thingBtn.active = false;
        this.zhuanbeiBtn.active = true;
        this.fashuBtn.active = false;
    }

    openFashu() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.thingBtn.active = false;
        this.zhuanbeiBtn.active = false;
        this.fashuBtn.active = true;
    }
}


