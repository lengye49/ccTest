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
        battleLogs:[cc.Label],
    },



    start:function () {
        this.battleLogs.forEach(function(i,index){
            i.string = "forEach循环，循环数组中每一个元素并采取操作，可以不用知道数组长度";
        })
        this.addLog("去你大爷的！");
    },

    addLog:function (str) {
        var length = this.battleLogs.length;
        for (var i = 0;i < length - 1;i++)
        {
            this.battleLogs[i].string = this.battleLogs[i + 1].string;
        }
        this.battleLogs[length - 1].string = str;
    }
});
