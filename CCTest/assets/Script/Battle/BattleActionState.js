
cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel:cc.Label,
        stateLabel:cc.Label,
        btn:cc.Button,
    },

    initState:function(nameStr){
        this.nameLabel.string = nameStr;
    },

    updateState:function (stateStr,isOn) {
        this.stateLabel.string = stateStr;
        this.stateLabel.node.color = isOn ? color.RED : color.BLACK;
        this.btn.interactable = isOn;
    },

    stop:function () {
        this.btn.interactable = false;
    }
});
