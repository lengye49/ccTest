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

    initLogs:function(){
        this.battleLogs.forEach(function(i,index){
            i.string = "";
        })
    },

    addLog:function (str,c) {
        var length = this.battleLogs.length;
        for (var i = 0;i < length - 1;i++)
        {
            this.battleLogs[i].string = this.battleLogs[i + 1].string;
            this.battleLogs[i].node.color = this.battleLogs[i+1].node.color;
        }
        this.battleLogs[length - 1].string = str;
        this.battleLogs[length-1].node.color = c;
    }
});
