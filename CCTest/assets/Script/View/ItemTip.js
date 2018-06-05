
cc.Class({
    extends: cc.Component,

    properties: {
        itemName:cc.Label,
        effect:cc.Label,
        desc:cc.Label,
        itemType:cc.Label,
        weight:cc.Label,

        action1:cc.Button,
        action1Text:cc.Label,
        action2:cc.Button,
        action2Text:cc.Label,
    },

    updateShow:function (item,isUsing) {
        var count = window.Player.backpack[item.id];
        if(count>0)
            this.itemName.string = item.name + "×" + count;
        else
            this.itemName.string = item.name;
        this.effect.string = this.itemEffectsString(item.effects);
        this.desc.string = item.desc;
        this.itemType.string = this.itemTypeString(item.type);
        this.weight.string = item.weight * count + "kg";

        this.updateActions(item.type,isUsing)
    },

    updateActions:function (isShowAction1,str1,isShowAction2,str2) {
        this.action1.node.active = isShowAction1;
        if (isShowAction1) {
            this.action1Text.string = str1;
        }
        this.action2.node.active = isShowAction2;
        if (isShowAction2) {
            this.action2Text.string = str2;
        }
    },

    //两个作用：更新按钮，返回类型描述
    itemTypeString:function (t,isUsing) {
        switch(t){
            case 0:
                if(isUsing)
                    this.updateActions(true,"取下",false,"");
                else
                    this.updateActions(true,"使用",false,"");
                return "武器";
            case 1:
                if(isUsing)
                    this.updateActions(true,"脱下",false,"");
                else
                    this.updateActions(true,"穿上",false,"");
                return "衣服";
            case 2:
                if(isUsing)
                    this.updateActions(true,"脱下",false,"");
                else
                    this.updateActions(true,"穿上",false,"");
                return "鞋子";
            case 3:
                this.updateActions(true,"使用",true,"治狗");
                return "药品";
            case 4:
                this.updateActions(true,"使用",true,"喂狗");
                return "食材";
            case 5:
                this.updateActions(true,"使用",false,"");
                return "消耗品";//酒、烟等狗不可用的物品
            case 6:
                if(isUsing)
                    this.updateActions(true,"取下",false,"");
                else
                    this.updateActions(true,"使用",false,"");
                return "弓";
            case 7:
                if(isUsing)
                    this.updateActions(true,"取下",false,"");
                else
                    this.updateActions(true,"使用",false,"");
                return "枪械";
            case 8:
                this.updateActions(false,"",false,"");
                return "杂物";
            default:
                this.updateActions(false,"",false,"");
                return "杂物";
        }
    },

    //更新属性,格式 类型1|值1;类型2|值2
    itemEffectsString:function (str) {
        var s = str.split(";");
        var pros = "";
        for (let i = 0; i < s.length; i++) {
            var ss = s.split("|");
            pros += window.ReadJson.getPropName(parseInt(ss[0]));
            pros += " +"+ss[1];
            if (i === (s.length - 1))
                pros += "\n";
        }
        return pros;
    },


});
