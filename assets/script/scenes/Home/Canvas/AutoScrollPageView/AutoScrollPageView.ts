import { _decorator, Component, find, Node, PageView } from 'cc';
import { RecruitCardCtrl } from '../RecruitCard/RecruitCardCtrl';
import { AudioMgr } from 'db://assets/script/util/resource/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('AutoScrollPageView')
export class AutoScrollPageView extends Component {
    @property(PageView)
    pageView: PageView = null!;

    @property
    autoScrollInterval: number = 3; // 自动滚动间隔（秒）

    private currentPageIndex: number = 0;
    private timer: number = 0;

    start() {
        // 假设 pageView 是你的 PageView 组件的引用

        // 获取所有的页面节点
        // let pages = this.pageView.content.children;
        // console.log(this.node.parent)
        // // 为每个页面添加点击事件
        // for (let i = 0; i < pages.length; i++) {
        //     let page = pages[i];
        //     page.on(cc.Node.EventType.TOUCH_END, function (event) {
        //         AudioMgr.inst.playOneShot("sound/other/click");
        //         // 这里可以获取当前点击的页面索引
        //         // let index = this.pageView.getItems().indexOf(page);
        //         let node = find("Canvas")
        //         let RecruitCtrl = node.getChildByName("RecruitCtrl")
        //         RecruitCtrl.getComponent(RecruitCardCtrl).init(event.target.name)
        //         // activeCtrl.active = true
        //         // console.log(event)
        //         // console.log(_this)
        //         // _this.active = true
        //         // 处理点击事件
        //     }, page);
        // }

    }

    callback(pageView: PageView) {
        console.log(111111)
        // 回调的参数是 pageView 组件
        // 另外，注意这种方式注册的事件，也无法传递 customEventData
    }

    // 手动切换到指定页面
    public scrollToPage(index: number, time: number = 0.5) {
        if (this.pageView && index >= 0 && index < this.pageView.getPages().length) {
            this.pageView.scrollToPage(index, time);
            this.currentPageIndex = index;
        }
    }



}


