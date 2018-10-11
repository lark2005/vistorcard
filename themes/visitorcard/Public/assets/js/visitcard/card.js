/**
 * Created by lark2005 on 2018/10/11.
 */
$(document).ready(function () {

});
//检查必填字段
function checkform(){
    var inputs = document.getElementsByTagName("input");//获取所有的input标签对象
    for(var i=0;i<inputs.length;i++){
        var elem = inputs[i];
        // alert(elem.type + "=="+ elem.name);
        if(elem.type == "checkbox" || elem.type == "radio"  || elem.type == "text"){
            var checkR = checkRequired(elem);
            if(!checkR){
                alert(document.getElementById("dictCards"+elem.alt).title + "[必须选择]");
                elem.focus();
                return false;
            }
        }
    }
}
//(校验必填项不能为空(包括input框，单选框，复选框,文本域))
function checkRequired(elem){
    if(elem.type == "checkbox" || elem.type == "radio"){
        var results=[];
        results.numChecked = 0;
        var input = document.getElementsByTagName("input");
        for(var i=0;i<input.length;i++){
            if(input[i].name == elem.name){
                results.push(input[i]);
                if(input[i].checked){
                    results.numChecked++;
                }
            }
        }
        return results.numChecked;

    }else{
        return elem.value.length > 0 && elem.value != elem.defaultValue;
    }
}