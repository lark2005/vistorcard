/**
 * Created by lark2005 on 2018/10/11.
 */
$(document).ready(function () {

});

function checkform() {

    var company = document.getElementById("company").value.trim();
    if (company == '') {
        alert('{$cardSetting.filed_company_desc}');
        document.getElementById("company").focus();
        return false;
    }

}