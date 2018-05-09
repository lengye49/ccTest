// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        timePassed : cc.FLOAT,
        isShow : cc.BOOL,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start:function () {
        this.progressBar = this.getComponent(cc.ProgressBar);
        this.StartShow();
    },

    StartShow:function () {
        this.node.active = true;
        this.isShow=true;
        this.timePassed = 0;
    },

    update:function (dt) {
        if(this.isShow){
            this.UpdateShow(dt);
        }
    },

    UpdateShow:function (dt) {
        this.timePassed += dt;
        if(this.timePassed>2)
            this.StopShow();
        this.progressBar.progress = this.timePassed / 2;
        console.log("dt = " + dt + ", progress = " + this.timePassed / 2);
    },

    StopShow:function(){
        // this.node.active = false;
        this.StartShow();
    }
});
