import { _decorator, Component, director, Node } from 'cc';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('FloorCtrl')
export class FloorCtrl extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    goback() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("MapCrtl").active = false
        this.node.parent.getChildByName("HeroCtrl").active = false
        this.node.parent.getChildByName("Buildings").active = true
    }
    openMap() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("Buildings").active = false
        this.node.parent.getChildByName("HeroCtrl").active = false
        this.node.parent.getChildByName("MapCrtl").active = true
    }
    activBtn() {
        AudioMgr.inst.playOneShot("sound/other/click");
        director.loadScene("Active")
    }
    openHero() {
        AudioMgr.inst.playOneShot("sound/other/click");
        this.node.parent.getChildByName("MapCrtl").active = false
        this.node.parent.getChildByName("HeroCtrl").active = true
    }
}


