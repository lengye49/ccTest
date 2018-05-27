// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel: cc.Label,
        coverButton: cc.Button,
        isShowCover: false,
        cd: 0.0,
        interval:1,
    },


    start () {

    },

    updateShow:function (s) {
        this.strs = s;
        this.isShowCover = false;

        this.cd = 0.0;
        this.index = 0;
        this.str = this.strs[this.index];

        this.updateState();
    },

    update:function (dt) {
        console.log("isShowCover = " +this.isShowCover);

        if(this.isShowCover)
            return;
        this.cd += dt;
        if(this.cd>this.interval){
            this.cd = 0.0;
            this.index++;
            this.str = this.str + "\n" + this.strs[this.index];
            if(this.index>=this.strs.length)
            {
                this.isShowCover=true;
            }
            this.updateState();
        }
    },

    updateState:function () {
        this.coverButton.interactable = this.isShowCover;
        this.tipLabel.string = this.str;
    }
});
