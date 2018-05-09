
cc.Class({
    extends: cc.Component,

    properties: {
        //战斗属性：
        hp : {
            default:100,
            type: cc.Integer,
        },
        hpMax : {
            default:100,
            type: cc.Integer,
        },
        basicAttack : {
            default:10,
            type: cc.Integer,
        },
        attack:{
            default:0,
            type:cc.Integer,
        },
        basicDefence:{
            default:0,
            type:cc.Integer,
        },
        defence:{
            default:0,
            type:cc.Integer,
        },
        basicSpeed:{
            default:10,
            type:cc.Integer,
        },
        speed:{
            default:5,
            type:cc.Integer,
        },
        //熟练度
        escapeProficiency:{
            default:0,
            type:cc.Integer,
        },
        meleeProficiency:{
            default:0,
            type:cc.Integer,
        },
        rangedProficiency:{
            default:0,
            type:cc.Integer,
        },
        //速度：
        speed:{
            default:0,
            type:cc.Integer,
        },
        //精力：影响探索
        spirit : {
            default:100,
            type:cc.Integer,
        },
        food:{
            default:100,
            type:cc.Integer,
        },
        water:{
          default:100,
          type:cc.Integer,
        },
        //体质：影响生命上限、精力上限
        constitution:{
            default:30,
            type:cc.Integer,
        },
        //负重，会影响速度
        weight:{
            default:0,
            type:cc.Integer,
        },
        //金钱
        money:{
            default:0,
            type:cc.Integer,
        },
        //时间
        seasonNow:{
            default:0,
            type:cc.Integer,
        },
        dayNow:{
            default: 1,
            type: cc.Integer,
        },
        hourNow:{
            default:0,
            type:cc.Integer,
        },
        minuteNow:{
            default:0,
            type:cc.Integer,
        },
        minutesPassed:{
            default:0,
            type:cc.Integer,
        },

        //背包
        backpack:cc.String,
    },

    onLoad:function(){
        this.HeadView = this.getComponent('HeadView');
    },

    //根据数据重新配置
    SetPlayerData :function(str) {
        var strs = str.split(";");
        this.day=parseInt(strs[0]);
        this.hp = parseInt(strs[1]);
        this.hpMax=parseInt(strs[2]);
        this.basicAttack=parseInt(strs[3]);
        this.spirit=parseInt(strs[4]);
        this.money=parseInt(strs[5]);
        this.backpack= strs[6].toString();
    },

    AddMinutes:function (min) {
        this.minutesPassed += min;
        UpdateTime();
    },

    UpdateTime:function () {
        var min = this.minutesPassed;
        var monthNow = parseInt(min / 43200);
        this.seasonNow = (monthNow % 12) / 3;
        this.dayNow = min / 1440;
        min -= this.dayNow * 1440;
        this.hourNow = min / 60;
        this.minuteNow = min % 60;
        this.HeadView.UpdateView(this);
    },



});
