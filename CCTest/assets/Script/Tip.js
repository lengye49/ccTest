

cc.Class({
    extends: cc.Component,

    properties: {
        textLabel:cc.Label,
        timePassed:cc.FLOAT,
        isShow:cc.BOOL,
    },

    onLoad : function () {
        this.node.active = false;
        this.isShow = false;
        this.ShowTip("Hello World!!");
    } ,

    ShowTip:function(str){
        this.timePassed = 0;
        this.isShow = true;
        this.node.active = true;

        this.node.position = cc.p(0,0);
        this.node.scale = cc.p(0.01,0.01);
        this.textLabel.string = str;
    },

    update : function (dt) {
        if(this.isShow){
            this.timePassed += dt;
            this.UpdateShow();
        }
    },

    UpdateShow : function (){
        console.log("timePassed "+ this.timePassed);
        if(this.timePassed <= 0.5)
            this.node.scale = cc.p(this.timePassed * 2,this.timePassed * 2);
        if(this.timePassed > 3)
            this.HideTip();
    },

    HideTip : function (){
        this.node.active = false;
        this.isShow = false;
    }
});
