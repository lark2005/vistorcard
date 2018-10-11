/**
 * Created by lark2005 on 2018/10/11.
 */
$(document).ready(function () {
    select1();
    //select1();
    $('#S1').change("change", select2);
    $('#S2').change("change", select3);
    $.ajaxSetup({
        async: false
    });

    // 短信发送
    $("#msg_send_button").click(function(){
        if(sendMsgCode(1)){
            time(this);
        }

    });

    // 短信发送 - 测试
    $("#msg_test_button").click(function(){
        if(sendMsgCode(0)){
            time(this);
        }

    });

    // 重写alert 避免出现网址
    window.alert = function(message){
        Wind.use("artDialog", function() {
            art.dialog({
                id : new Date().getTime(),
                // icon : "error",
                title:"",
                fixed : true,
                lock : true,
                background : "#CCCCCC",
                opacity : 0,
                content : message,
                ok : function() {
                    return true;
                }
            });
        });
    };


});


var selectCityUrl ="__WEB_ROOT__/index.php?g=api&m=cityArea&a=getJson";
var selectCityUrl2 ="__WEB_ROOT__/Api/cityArea/getJson";

function select1() {
    $.ajax(
        {
            type: "post",
            url: selectCityUrl,
            data: { "parent": "0","type": "0"},
            success: function (msg) {
                var areas = eval(msg);
                for (var i = 0; i < areas.length; i++) {
                    $("#S1").append("<option value=" + areas[i].area_id + ">" + areas[i].name + "</option>");
                }

                select2();
            }
        })
};

function select2() {
    $("#S2").html("");
    $("#S2").append("<option value=\"\">-请选择-</option>");
    $.ajax(
        {
            type: "post",
            url: selectCityUrl,
            data: { "type": "1", "parent": $('#S1').val() },
            success: function (msg) {
                var areas = eval(msg);
                for (var i = 0; i < areas.length; i++) {
                    $("#S2").append("<option value=" + areas[i].area_id + ">" + areas[i].name + "</option>");
                }
                select3();
            }
        })
};

function select3() {
    $("#S3").html("");
    $("#S3").append("<option value=\"\">-请选择-</option>");

    // 判断省份有没有
    if($('#S2').val()){
        $.ajax(
            {
                type: "post",
                url: selectCityUrl,
                data: { "type": "2", "parent": $('#S2').val() },
                success: function (msg) {
                    var areas = eval(msg);
                    for (var i = 0; i < areas.length; i++) {
                        $("#S3").append("<option value=" + areas[i].area_id + ">" + areas[i].name + "</option>");
                    }
                }
            })
    }
};


// 倒计时间
var wait=0;
function time(o){
    if (wait==60) {
        o.removeAttribute("disabled");
        o.innerHTML="发送验证码";
        o.style.backgroundColor="#fe9900";
        wait=0;
    }else{
        o.setAttribute("disabled", true);
        o.innerHTML= (59-wait)+"秒后重新获取";
        o.style.backgroundColor="#8f8b8b";
        wait++;
        setTimeout(function(){
            time(o)
        },1000)
    }
}

// 校验手机号
function checkMobile(id_mobile,id_country) {
    id_mobile = id_mobile || "mobile";
    id_mobile = id_mobile || "country";
    var mobileElement = document.getElementById(id_mobile);
    var countryElement = document.getElementById(id_country);

    var userTel = mobileElement.value.trim();
    if (userTel == '') {
        alert('请输入手机号码');
        document.getElementById("mobile").focus();
        return false;
    }
    var userCountry = countryElement.value.trim();
    userTel
    var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    var regMobileOther = /^[0-9]{6,11}$/;

    if (userCountry == "中国") {
        if (reg.test(userTel)) {
            return true;
        } else {
            alert("请输入正确的手机号码");
            mobileElement.focus();
            return false;
        }
    }
    else if (userCountry != "中国") {
        if (regMobileOther.test(userTel)) {
            return true;
        } else {
            alert("请输入正确的手机号码");
            mobileElement.focus();
            return false;
        }
    }

    return false;
}

// 发送验证码
function sendMsgCode(isSend){
    var id_mobile = "mobile";
    var userTel = document.getElementById(id_mobile).value.trim();
    if (!checkMobile()) {
        return false;
    }

    // 判断是否可发送
    if (wait==0) {
        $.ajaxSettings.async = false;
        // 发送验证码  测试
        var sendUrl = "{:leuu('business/visitCard/sendMsgCode')}";
        if (isSend && isSend=="1"){
            // 正式
            sendUrl = "{:leuu('business/visitCard/send2MsgCode')}";
        }
        $.post(sendUrl, {'mobile':userTel},function(json){
            var res = eval("("+json+")");// 将json转换为对象 json 格式
            if (res.code=="0") {
                alert('发送成功'+res.message);
            } else {
                alert('发送失败'+res.message);
            }
        });
        $.ajaxSettings.async = true;
        return true;
    }else{
        return false;
    }
}

// 校验表单
function checkform() {
    var company = document.getElementById("company").value.trim();
    if (company == '') {
        alert('{$cardSetting.filed_company_desc}');
        document.getElementById("company").focus();
        return false;
    }

    var position = document.getElementById("position").value.trim();
    if (position == '') {
        alert('{$cardSetting.filed_position_desc}');
        document.getElementById("position").focus();
        return false;
    }

    var name = document.getElementById("name").value.trim();
    if (name == '') {
        alert('{$cardSetting.filed_name_desc}');
        document.getElementById("name").focus();
        return false;
    }

    var userProvince = document.getElementById("S2").value.trim();
    if (userProvince == '') {
        alert('请选择省份');
        document.getElementById("S2").focus();
        return false;
    }

    var userCity = document.getElementById("S3").value.trim();
    if (userCity == '') {
        alert('请选择城市');
        document.getElementById("S3").focus();
        return false;
    }

    var userTel = document.getElementById("mobile").value.trim();
    if (!checkMobile()) {
        return false;
    }

    $("#country").val($("#S1 option:selected").text());
    $("#province").val($("#S2 option:selected").text());
    $("#city").val($("#S3 option:selected").text());

    var vcode = document.getElementById("vcode").value.trim();
    if (vcode == '') {
        alert('请输入手机验证码');
        document.getElementById("vcode").focus();
        return false;
    }

    $.ajaxSettings.async = false;
    var checkMsgCode;
    $.ajax({
        url : "{:leuu('business/visitCard/checkMsgCode')}",
        async : false, // 注意此处需要同步，因为返回完数据后，下面才能让结果的第一条selected
        type : "POST",
        data:{'mobile':userTel,'vcode':vcode},
        dataType : "json",
        success : function(res) {
            //alert("1=" + res);
            checkMsgCode = res;
        }
    });

    if (checkMsgCode.code == "0") {
        return true;
    }else{
        alert(checkMsgCode.message);
        document.getElementById("vcode").focus();
        return false;
    }

    $.ajaxSettings.async = true;
}