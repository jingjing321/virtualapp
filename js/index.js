
var baseurl="http://xnapi.sanlogic.cn/";
function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

/*
*thiz 获取验证码的btn
*verifyType 验证码类型：注册：reg；找回密码：forget
*/
function getverify(verifyType,thiz){
    if($(thiz).hasClass("disabled")){
        return;
    }
    
    if((/^1[34578]\d{9}$/.test($(thiz).siblings('input').val()))){
        $.ajax({
            type: "get",
            dataType: "json",
            url: baseurl+"user/phone_verify_"+verifyType,
            data:{ac:$(thiz).siblings('input').val()} ,
            success: function(data, textStatus){
                if(data.code==0){
                    showToast("验证码已发送！请查收");
                    $(thiz).parents(".page").find("input[name=verify]").val(data.data.PhoneVerify);
                    time(thiz)
                }
                else{
                    showToast(data.msg);
                }
            },
            error:function(error){
                showToast("验证码获取失败！请重试");
            }
        })
    }
    else{
        showToast("手机号不符合格式！");
    }
    
}

var wait = 60;
function time(btnObj) {
    if (wait == 0) {
        $(btnObj).removeClass("disabled")
        btnObj.textContent = "获取验证码";
        wait = 60;
    } else {
        $(btnObj).addClass("disabled");
        btnObj.textContent = "获取验证码(" + wait + "s)";
        wait--;
        setTimeout(function() {
            time(btnObj)
        },1000)
    }
}
 
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
 
function checkCookie(name)
{
  var value=getCookie(name);
  if (value!="")
  {
    return false;
  }
  else 
  {
    return value;
  }
}

function btn_status(page){
    var input=$("#"+page).find("input");
    var check=false;
    for(var i=0;i<input.length;i++){
        if(input.eq(i).val()==""){
            check=false;
            break;
        }
        check=true;
    }
    if(check){
        $("#"+page).find(".aui-btn").last().removeClass("disabled");
    }
    else{
        $("#"+page).find(".aui-btn").last().addClass("disabled");
    }
}
function login(thiz){
    if($(thiz).hasClass("disabled")){
        return;
    }
    if((/^1[34578]\d{9}$/.test($("#login input[name=userPhone]").val()))){
        $.ajax({
            type: "post",
            dataType: "json",
            url: baseurl+"user/login",
            data:{ac:$("#login input[name=userPhone]").val(),pw:$("#login input[name=userPassword]").val()} ,
            success: function(data, textStatus){
                if(data.code==0){
                    setCookie("Account",data.data[0].Account,30);
                    sessionStorage.setItem("Account",data.data[0].Account);
                    setCookie("Birthday",data.data[0].Birthday,30);
                    sessionStorage.setItem("Birthday",data.data[0].Birthday);
                    setCookie("Email",data.data[0].Email,30);
                    sessionStorage.setItem("Email",data.data[0].Email);
                    setCookie("Gender",data.data[0].Gender,30);
                    sessionStorage.setItem("Gender",data.data[0].Gender);
                    setCookie("HeadIcon",data.data[0].HeadIcon,30);
                    sessionStorage.setItem("HeadIcon",data.data[0].HeadIcon);
                    setCookie("NickName",data.data[0].NickName,30);
                    sessionStorage.setItem("NickName",data.data[0].NickName);
                    setCookie("position",data.data[0].position,30);
                    sessionStorage.setItem("position",data.data[0].position);
                    setCookie("RealName",data.data[0].RealName,30);
                    sessionStorage.setItem("RealName",data.data[0].RealName);
                    setCookie("UserId",data.data[0].UserId,30);
                    sessionStorage.setItem("UserId",data.data[0].UserId);
                    setCookie("UserType",data.data[0].UserType,30);
                    sessionStorage.setItem("UserType",data.data[0].UserType);
                    if(data.data[0].UserType==0){
                        turnPage("#select-identity","login");
                    }
                    else{
                        console.log(data.data);
                        sessionStorage.setItem("CompanyId",data.data[0].CompanyId);
                        $.ajax({
                            type: "get",
                            dataType: "json",
                            url: baseurl+"company/info?comp_id="+data.data[0].CompanyId,
                            success: function(data, textStatus){
                                sessionStorage.setItem("CompanyAddres",data.data.CompanyAddres);
                                sessionStorage.setItem("CompanyIcon",data.data.CompanyIcon);
                                sessionStorage.setItem("CompanyName",data.data.CompanyName);
                                turnPage("#index","login");
                                initIndex();
                            },
                            error:function(error){

                            }
                        })
                    }
                }
                else{
                    showToast(data.msg)
                }
            }
        });
    }
    else{
        showToast("手机号输入错误！");
    }
}

function register(thiz){
    if($(thiz).hasClass("disabled")){
        return;
    }
    if((/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test($("#register input[name=userPassword").val()))){
        $.ajax({
            type: "post",
            dataType: "json",
            url: baseurl+"user/register",
            data:{ac:$("#register input[name=userPhone]").val(),pw:$("#register input[name=userPassword]").val(),pv:$("#register input[name=verify]").val()},
            success: function(data, textStatus){
                if(data.code==0){
                    turnPage("#select-identity",'register');
                    setCookie("UserId",data.data.UserId,30);
                    sessionStorage.setItem("UserId",data.data.UserId)
                    setCookie("UserType",data.data.UserType,30);
                    sessionStorage.setItem("UserType",data.data.UserType);
                }
                else{
                    showToast(data.msg);
                }
            },
            error:function(error){
                showToast("注册失败！请重试");
            }
        })
    }
    else{
        showToast("密码为8-20位，必须包含字母、数字")
    }
}

function idSite(num){
    turnPage("#select-company","select-identity");
    if(num==1){
        getCheckList();
        $("#select-company .content").css("display","none");
        $("#select-company .admin").css("display","");
    }
    else{
        $("#select-company .content").css("display","none");
        $("#select-company .user").css("display","");
    }
}

/*
获取审核列表
*/
function getCheckList(){
    $.ajax({
        type: "get",
        dataType: "json",
        url: baseurl+"company/check_list",
        data:{user_id:sessionStorage.getItem("UserId")} ,
        success: function(data, textStatus){
            var ele=$("#select-company .admin ul");
            ele.html("");
            if(data.code==0){
                if(data.data.length<1){
                    ele.html("无审核信息")
                }
                else{
                    for(var i=0;i<data.data.length;i++){
                        ele.append('<li class="aui-list-item"><div class="aui-list-item-inner"><div class="aui-list-item-title" data-companyId="'+data.data[i].CompanyId+'">'+data.data[i].CompanyName+'</div><div class="aui-list-item-right"><div class="">'+(data.data[i].CheckMark?"已审核":"未审核")+'</div></div></div></li>');
                    }
                }
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("审核信息获取失败");
        }
    })
}

/*
查找公司
*/
function searchCompany(){
    $.ajax({
        type: "get",
        dataType: "json",
        url: baseurl+"company/find",
        data:{name:$("#select-company input[name=company-name]").val()} ,
        success: function(data, textStatus){
            var ele=$("#select-company .user ul");
            ele.html("");
            if(data.code==0){
                if(data.data.length<1){
                    ele.html("未查询到公司")
                }
                else{
                    for(var i=0;i<data.data.length;i++){
                        ele.append('<li class="aui-list-item" onclick="joinCompany(\''+data.data[i].CompanyId+'\')"><div class="aui-list-item-inner"><div class="aui-list-item-title" data-companyId="'+data.data[i].CompanyId+'">'+data.data[i].CompanyName+'</div></div></li>');
                    }
                }
            }
            else{
                showToast(data.msg);
            }
        }
    })
}

/*
加入企业
*/
function joinCompany(CompanyId){
    dialog.alert({
        title:"加入企业",
        msg:'确认申请加入该企业?',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex==2){
            dialog.alert({
                title:"选择你的身份",
                buttons:["设备管理员","操作员"]
            },function(ret){
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: baseurl+"company/add",
                    data:{comp_id:CompanyId,user_id:sessionStorage.getItem("UserId"),user_type:(ret.buttonIndex/1+1)} ,
                    success: function(data, textStatus){
                        if(data.code==0){
                            if(data.code==0){
                                showToast(data.msg);
                                turnPage("#login","select-company");
                            }
                            else{
                                showToast(data.msg);
                            }
                        }
                        else{
                            showToast(data.msg);
                        }
                    },
                    error:function(error){
                        showToast("加入企业失败！请重试")
                    }
                })
            })
        }
    })
}

/*
创建企业
*/
function createCompany(thiz){
    if($(thiz).hasClass("disabled")){
        return;
    }
    $.ajax({
        type: "post",
        dataType: "json",
        url: baseurl+"company/create",
        data:{user_id:sessionStorage.getItem("UserId"),comp_name:$("#sit-company input[name=companyName]").val(),comp_add:$("#sit-company input[name=companyAddr]").val()} ,
        success: function(data, textStatus){
            if(data.code==0){
                showToast("企业创建成功！");
                idSite(1);
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("企业创建失败！请重试");
        }
    })
}

/*
找回密码
*/
function find_password(thiz){
    if($(thiz).hasClass("disabled")){
        return ;
    }
    if((/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test($("#find-password input[name=newPassword").val()))){
        $.ajax({
            type: "post",
            dataType: "json",
            url: baseurl+"user/forget",
            data:{ac:$("#find-password input[name=userPhone]").val(),pw:$("#find-password input[name=newPassword]").val(),pv:$("#find-password input[name=verify]").val()},
            success: function(data, textStatus){
                if(data.code==0){
                    showToast("重置密码成功！请重新登录");
                    turnPage("#login","find_password");
                }
                else{
                    showToast(data.msg);
                }
            },
            error:function(error){
                showToast("重置密码失败！请重试")
            }
        })
    }
    else{
        showToast("密码为8-20位，必须包含字母、数字")
    }
}

/*
index页面初始化
*/
function initIndex(){
    $("#index header .aui-title").html(sessionStorage.getItem("CompanyName"));
    $.ajax({
        url:baseurl+"devicetype/getlist?comp_id="+sessionStorage.getItem("CompanyId"),
        type: "get",
        dataType: "json",
        success: function(data, textStatus){
            if(data.code==0){
                // console.log(data);
                $("#index #indexTab1 select").html("");
                for(var i=0;i<data.data.length;i++){
                    $("#index #indexTab1 select").append("<option value='"+data.data[i].DeviceTypeId+"'>"+data.data[i].DeviceTypeName+"</option>");
                }
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("获取设备类型失败！");
        }
    });
    $.ajax({
        url:baseurl+"records/statestoday?comp_id="+sessionStorage.getItem("CompanyId")+"&group_id=68198864-660c-461a-bc15-bfd289744bc8",
        type: "get",
        dataType: "json",
        success: function(data, textStatus){
            console.log(data);
        },
        error:function(error){

        }
    })

}

/*
用户界面初始化
*/
function initUser(){
    var ele=$("#mine .content");
    if(sessionStorage.getItem("HeadIcon")&&sessionStorage.getItem("HeadIcon")!="null"){
        ele.find(".avatar").html("<img src='"+sessionStorage.getItem("HeadIcon")+"' style='border-radius:50%'>");
    }
    else{
        ele.find(".avatar").html('<span class="fa fa-user-plus userIcon"></span>');
    }
    ele.find(".my-title .userName").html(sessionStorage.getItem("NickName"));
    ele.find(".my-title .userPosition").html(sessionStorage.getItem("Postion"));
    ele.find(".companyInfo img")[0].src=sessionStorage.getItem("CompanyIcon")!="null"?sessionStorage.getItem("CompanyIcon"):"images/logoupload.png";
    ele.find(".companyInfo .aui-list-item-title").html(sessionStorage.getItem("CompanyName"));
    ele.find(".companyInfo .aui-list-item-text").html(sessionStorage.getItem("CompanyAddres"));
}

/*
我的资料初始化
*/
function initMyInfo(){
    var ele=$("#my-info .content");
    ele.find("img")[0].src=sessionStorage.getItem('HeadIcon');
}

function switchType(thiz){
    if($(thiz).siblings("input")[0].type=="text"){
        $(thiz).siblings("input")[0].type="password"
    }
    else{
        $(thiz).siblings("input")[0].type="text"
    }
    $(thiz).toggleClass("fa-eye").toggleClass("fa-eye-slash");
}

/*
获取设备分组列表
*/
function getdevicegroup(){
    if(sessionStorage.getItem("CompanyId")){
        $.ajax({
            url:baseurl+"devicegroup/get_list_comp?comp_id="+sessionStorage.getItem("CompanyId"),
            type: "get",
            dataType: "json",
            success: function(data, textStatus){
                if(data.code==0){
                    var ele=$("#task2 #task2-tab1 .aui-content .aui-list");
                    if(data.data.length>0){
                        ele.html("");
                        for(var i=0;i<data.data.length;i++){
                            ele.append('<li class="aui-list-item aui-list-item-middle">'+
                                    '<div class="aui-media-list-item-inner">'+
                                        '<div class="aui-list-item-inner">'+
                                            '<div class="aui-list-item-text">'+
                                                '<div class="aui-list-item-title aui-font-size-14"  onclick="getdeviceByGroup(\''+data.data[i].DeviceGroupId+'\',\''+data.data[i].DeviceGroupName+'\')">'+data.data[i].DeviceGroupName+'</div>'+
                                                '<div class="aui-list-item-right sit-position" onclick="openActionsheet(\''+data.data[i].DeviceGroupId+'\',\''+data.data[i].DeviceGroupName+'\')"><i class="fa fa-ellipsis-h"></i></div>'+
                                            '</div>'+
                                            '<div class="aui-list-item-text">'+
                                                data.data[i].DeviceCount+'台'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>');
                        }
                    }
                    else{
                        ele.html("未添加设备分组");
                    }
                }
                else{
                    showToast(data.msg);
                }
            },
            error:function(error){
                showToast("获取企业设备分组列表失败！")
            }
        })
    }
}

/*
获取设备bygroupId
group_id
group_name
*/
function getdeviceByGroup(group_id,group_name){
    turnPage("#devList","task2");
    if(group_name){
        $("#devList header .aui-title").html(group_name);
    }
    $("#devList header .aui-title").attr("data-groupId",group_id);
    $.ajax({
        url:baseurl+"device/getlistbygroupid?group_id="+group_id,
        type: "get",
        dataType: "json",
        success:function(data){
            if(data.code==0){
                console.log(data.data);
                var ele=$("#devList .content .aui-list");
                ele.html("");
                if(data.data.length>0){
                    for(var i=0;i<data.data.length;i++){
                        ele.append('<li class="aui-list-item aui-list-item-middle">'+
                        '<div class="aui-media-list-item-inner">'+
                            '<div class="aui-list-item-inner">'+
                                '<div class="aui-list-item-text">'+
                                    '<div class="aui-list-item-title aui-font-size-14">'+data.data[i].DeviceName+'</div>'+
                                    '<div class="aui-list-item-right sit-position" onclick="openDeviceAction('+data.data[i].DeviceId+',\''+data.data[i].DeviceName+'\')"><i class="fa fa-ellipsis-h"></i></div>'+
                                '</div>'+
                                '<div class="aui-list-item-text">'+
                                    '设备型号：'+data.data[i].DeviceModel+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</li>');
                    }
                    
                }
                else{
                    ele.html("该分组下没有设备！");
                }
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("设备列表获取失败！")
        }
    })
}

/*
打开设备操作
id 设备id
name 设备名称
*/
function openDeviceAction(id,name){
    actionsheet.init({
            frameBounces:true,//当前页面是否弹动，（主要针对安卓端）
            cancelTitle:'取消',
            destructiveTitle:'删除',
            buttons:['设置负责人',"设置分组","编辑"]
        },function(ret){
            if(ret){
                if(ret.buttonIndex==1){
                    turndeviceSitPrincipal(id);
                }
                else if(ret.buttonIndex==2){
                    turnsitDeviceGroup(id);
                }
                else if(ret.buttonIndex==3){
                    turnEditDevice(id);
                }
                else if(ret.buttonIndex==4){
                    deleteDevice(id);
                }
            }
        })
}
/*
deleteDevice删除设备
id 设备id 
*/
function deleteDevice(id){
    dialog.alert({
        title:"删除设备",
        msg:'确认删除该设备?',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex==2){
            $.ajax({
                url:baseurl+"device/del?device_id="+id,
                type:"DELETE",
                dataType:"json",
                success:function(data){
                    if(data.code==0){
                        showToast("设备删除成功");
                        getdeviceByGroup($("#devList header .aui-title").attr("data-groupId"));
                    }
                    else{
                        showToast(data.msg);
                    }
                },
                error:function(error){
                    showToast("删除设备失败！请重试")
                }
            })
        }
    })
}

/*
设置设备 负责人 跳转
id设备ID
*/
function turndeviceSitPrincipal(id){
    turnPage("#sit-principal","devList");
    $("#sit-principal header .aui-title").html("选择负责人");
    $("#sit-principal header .aui-pull-right").attr("onclick","deviceSitPrincipal("+id+")");
    $.ajax({
        url:baseurl+"usergroup/group_list?comp_id="+sessionStorage.getItem("CompanyId"),
        type:"get",
        dataType:'json',
        success:function(data){
            var ele=$("#sit-principal .content .aui-list");
            ele.html("");
            if(data.code==0){
                console.log(data.data);
                if(data.data.length>0){

                    for(var i=0;i<data.data.length;i++){
                        ele.append('<div class="aui-collapse-item"><li class="aui-list-item aui-collapse-header" tapmode>'+
                            '<div class="aui-list-item-inner">'+
                                '<div class="aui-list-item-text">'+
                                    '<div class="aui-list-item-title aui-font-size-14">'+data.data[i].UserGroupName+'</div> &nbsp;&nbsp;'+
                                    '<div class="aui-list-item-text">'+
                                        data.data[i].UserCount+'人'+
                                    '</div>'+
                                '</div>'+
                                '<div class="aui-list-item-right">'+
                                    '<i class="aui-iconfont aui-icon-down aui-collapse-arrow"></i>'+
                                '</div>'+
                            '</div> '+
                        '</li></div>');
                        $.ajax({
                            url:baseurl+"user/getlistbygroupid?group_id="+data.data[i].UserGroupId,
                            type:'get',
                            async:false,
                            dataType:"json",
                            success:function(data){
                                var user_ele=ele.find('.aui-collapse-item').last();
                                if(data.code==0){
                                    if(data.data.length>0){
                                        user_ele.append('<div class="aui-collapse-content"></div>');
                                        for(var user_i=0;user_i<data.data.length;user_i++){
                                            user_ele.find(".aui-collapse-content").append('<li class="aui-list-item" style="display: block;">'+
                                                '<div class="aui-media-list-item-inner">'+
                                                    '<div class="aui-list-item-media" style="width: 3rem;">'+
                                                        '<img src="images/demo5.png" class="aui-img-round aui-list-img-sm">'+
                                                    '</div>'+
                                                    '<div class="aui-list-item-inner aui-padded-t-10 aui-padded-b-10" style="display: block;">'+
                                                        '<div class="aui-list-item-text">'+
                                                            '<div class="aui-list-item-title">王学东</div>'+
                                                        '</div>'+
                                                        '<div class="aui-list-item-right sit-position"><input class="aui-radio aui-radio-white top" type="radio" name="radio" checked></div>'+
                                                        '<div class="aui-list-item-text">'+
                                                            '<div class="aui-ellipsis-2">电气组组长</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</li>');
                                        }
                                    }
                                }
                            },
                            error:function(error){

                            }
                        })
                    }
                }
                else{
                    ele.html("未添加用户！")
                }
                
            }
            else{
                showToast(data.msg);
                ele.html(data.msg)
            }
        },
        error:function(error){
            showToast("用户列表获取失败！");
            ele.html("用户列表获取失败！")
        }
    })
}

/*
turn 编辑设备详情 
id 设备id
*/
function turnEditDevice(id){
    $("#add-dev header .aui-title").html("编辑设备");
    $("#add-dev header .aui-pull-right").attr("onclick","editDevice("+id+")");
    turnPage("#add-dev","devList");
    $.ajax({
        url:baseurl+"device/getdevicedetail?device_id="+id,
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                console.log(data.data);
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("获取设备详情失败！")
        }
    })
}

/*
editDevice 编辑设备详情
id 设备id
*/
function editDevice(id){
    $.ajax({
        url:baseurl+"device/edit",
        type:"PATCH",
        data:$("#add-dev form").serialize(),
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("设备详情修改成功");
                pageBack();
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("设备详情修改失败")
        }
    })
}

/*
设置设备 负责人 设置
id设备ID
*/
function deviceSitPrincipal(id){
    $("#sit-principal .content input:checked").val();
    $.ajax({
        url:baseurl+"device/setadmin",
        type:"post",
        data:{"device_id":id,"user_id":sessionStorage.getItem("UserId")},
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("设备负责人设置成功！");
                pageBack();
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("设置负责人失败！请重试")
        }
    })
}

/*
turn 设备设置分组
id 设备id
*/
function turnsitDeviceGroup(id){
    turnPage("#sit-group","devList");
    $("#sit-group header .aui-pull-right").attr("onclick","sitDeviceGroup("+id+")");
    $.ajax({
        url:baseurl+"devicegroup/get_list_comp?comp_id="+sessionStorage.getItem("CompanyId"),
        type:"get",
        dataType:"json",
        success:function(data){
            var ele=$("#sit-group .content-block .aui-list");
            ele.html("");
            if(data.code==0){
                for(var i=0;i<data.data.length;i++){
                    ele.append('<li class="aui-list-item">'+
                                    '<div class="aui-list-item-inner">'+
                                        '<div class="aui-list-item-title">'+data.data[i].DeviceGroupName+'</div>'+
                                    '</div>'+
                                    '<div class="aui-list-item-right sit-position"><input class="aui-radio aui-radio-white" type="radio" name="radio" value="'+data.data[i].DeviceGroupId+'" checked></div>'+
                                '</li>');

                }
            }
            else{
                showToast(msg)
            }
        },
        error:function(error){
            showToast("获取企业设备分组列表失败！");
        }
    })

}

/*
设置设备分组
id 设备id
*/
function sitDeviceGroup(id){
    $("#sit-group .aui-content input:checked").val();
    $.ajax({
        url:baseurl+"device/setgroup",
        type:"post",
        data:{"device_ids":[id],"group_id":$("#sit-group .aui-content input:checked").val()},
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("设置分组成功！");
                pageBack();
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("设置分组失败！请重试");
        }
    })
}

/*
turn 添加设备
*/
function turnAddDev(){
    $("#add-dev form")[0].reset()
    turnPage("#add-dev","task2");
}

/*
turn 添加设备
*/
function turnAddDev(){
    $("#add-dev form")[0].reset();
    turnPage("#add-dev","task2");
}

/*
添加设备
*/
function addDev(){
    var formData=$("#add-dev form").series()
    $.ajax({
        url:baseurl+"device/add",
        type:"POST",
        data:formData,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("设备添加成功！");
                pageBack();
            }
            else{
                showToast(data.msg)
            }
        },
        error:function(error){
            showToast("设备添加失败！请重试");
        }
    })
}

/*
turn设备详情中 设置分组
*/
function turnDeviceDetailSitGroup(){
    $("#sit-group header .aui-pull-right").attr("onclick","deviceDetailSitGroup()");
    turnPage("#sit-group","add-dev");
}

/*
设备详情中 设置分组
*/
function deviceDetailSitGroup(){
    $("#add-dev #groupName .aui-list-item-right").html($("#sit-group .aui-content input:checked").val());
    // $("#sit-group .aui-content input:checked").val();
}

/*
添加设备分组
num 0:设备；1：人员；
*/
function addGroup(num){
    dialog.prompt({
        title:"添加分类",
        text:'1-4个字符即可',
        type:'text',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex == 2){
            var data={comp_id:sessionStorage.getItem("CompanyId"),user_id:sessionStorage.getItem("UserId")};
            if(num==0){
                var url="devicegroup/add";
                data['group_name']=ret.text;
            }
            else{
                var url="usergroup/add";
                data['dt_name']=ret.text;
            }
            if(ret.text.length>0&&ret.text.length<5){
                $.ajax({
                    url:baseurl+url,
                    type: "post",
                    data:data,
                    dataType: "json",
                    success: function(data, textStatus){
                        if(data.code==0){
                            showToast("添加分组成功！");
                            if(num==0){
                                getdevicegroup();
                            }
                            else{
                                getUserGroup();
                            }
                            
                        }
                        else{
                            showToast(data.msg)
                        }
                    },
                    error:function(error){
                        showToast("添加失败！请重试")
                    }
                })
            }
            else{
                showToast("组名称为1-4个字符");
            }
        }
    })
}

/*
编辑设备分组
num 设备：0；人员：1
*/
function editGroup(id,name,num){
    console.log(name);
    dialog.prompt({
        title:"编辑分类",
        value:name,
        type:'text',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex == 2){
            var data={comp_id:sessionStorage.getItem("CompanyId"),user_id:sessionStorage.getItem("UserId"),dt_id:id,dt_name:ret.text};
            if(num==0){
                var url="devicegroup/edit";
            }
            else{
                var url="usergroup/edit";
            }
            $.ajax({
                url:baseurl+url,
                type:"PATCH",
                data:data,
                dataType:"json",
                success:function(data){
                    if(data.code==0){
                        showToast("修改成功！");
                        if(num==0){
                            getdevicegroup();
                        }
                        else{
                            getUserGroup();
                        }
                    }
                    else{
                        showToast(data.msg);
                    }
                },
                error:function(error){
                    showToast("修改失败！请重试")
                }
            })
        }
    })
}

/*
删除设备分组
*/
function deleteGroup(id){
    dialog.alert({
        title:"删除分组",
        msg:'确认删除该分组?',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex==2){
            $.ajax({
                url:baseurl+"devicegroup/del?group_id="+id,
                type:"DELETE",
                dataType: "json",
                success: function(data, textStatus){
                    if(data.code==0){
                        showToast("删除分组成功！");
                    }
                    else{
                        showToast(data.msg);
                    }
                },
                error:function(error){
                    showToast("删除设备失败！请重试")
                }
            })
        }
    })
    
}

/*
任务-我的人员 弹出popup
*/
function myUserPopup(location){
    popup.init({
        frameBounces:true,//当前页面是否弹动，（主要针对安卓端）
        location:location,//位置，top(默认：顶部中间),top-left top-right,bottom,bottom-left,bottom-right
        buttons:[{
            icon:'user-plus',
            text:'添加人员',
            value:''//可选
        },{
            icon:'folder-o',
            text:'添加分类',
            value:''//可选
        }],
    },function(ret){
        if(ret){
            if(ret.buttonIndex==1){
                turnAddUser()
            }
            else{
                addGroup();
            }
        }
    })
}


// 饼状图生成；
// var run_pie= echarts.init(document.getElementById('run_pie'));
// option = {
//     title:{
//         text:"总运行率\n  43%",
//         subtext:"较昨日此时有所下降",
//         top:'30%',
//         left:'center',
//         textStyle:{
//             color:"#585858",
//             align:'center',
//             fontWeight:"400",
//             verticalAlign:"center"
//         },
//         subtextStyle:{
//             align:'center'
//         }
//     },
//     tooltip: {
//         trigger: 'item',
//         formatter: "{a} <br/>{b}: {c} ({d}%)"
//     },
//     backgroundColor:"white",
//     legend: {
//         orient: 'horizontal',
//         x: 'center',
//         y:'bottom',
//         itemWidth:10,
//         itemHeight:10,
//         textStyle:{
//             fontSize:8,
//             textAlign:'center'
//         },
//         data:['正常运行','故障运行','正常停机','调试','维修保养','故障停机']
//     },
//     series: [
//         {
//             name:'访问来源',
//             type:'pie',
//             radius: ['50%', '70%'],
//             center:["50%","40%"],
//             avoidLabelOverlap: false,
//             color:["#23ad3a","#036a36","#b7b7b7","#1b82d2","#f4a523","#e10621"],
//             label: {
//                 normal: {
//                     show: false,
//                     position: 'center'
//                 }
//             },
//             labelLine: {
//                 normal: {
//                     show: false
//                 }
//             },
//             data:[
//                 {value:335, name:'正常运行'},
//                 {value:310, name:'故障运行'},
//                 {value:234, name:'正常停机'},
//                 {value:135, name:'调试'},
//                 {value:1548, name:'维修保养'},
//                 {value:1548, name:'故障停机'}
//             ]
//         }
//     ]
// };
// run_pie.setOption(option);
// run_pie.on("click",function(params){
//     pieClick(params.name);
// })
function pieClick(name){
    $("#table").bootstrapTable("destroy");
    $('#table').bootstrapTable({
        striped:true,
        classes:"table table-no-bordered",
        data: [{
            1: "a122",
            2: '冷压机',
            3: '08:55'
        }, {
            1: "a122",
            2: '冷压机',
            3: '08:55'
        }, {
            1: "a122",
            2: '冷压机',
            3: '08:55'
        }],
        columns: [
            {field: '1',title: name,align:"center"}, 
            {field: '2',title: '设备名称',align:"center"}, 
            {field: '3',title: '点检时间',align:"center"}
        ],
        onClickRow:function(row,ele,field){
            console.log(row);
        }
    });
}

//table init
$('#table').bootstrapTable({
    striped:true,
    classes:"table table-no-bordered",
    data: [{
        1: "正常运行",
        2: '30',
        3: '5'
    }, {
        1: "故障停机",
        2: '45',
        3: '6'
    }, {
        1: "故障停机",
        2: '45',
        3: '6'
    }],
    columns: [
        {field: '1',title: '设备状态',align:"center"}, 
        {field: '2',title: '台数',align:"center"}, 
        {field: '3',title: '比前一天',align:"center",formatter:function(value,index,row){
            return value+"<span class='fa fa-long-arrow-down'></span>"
        }}
    ],
    onClickRow:function(row,ele,field){
        console.log(row);
    }
});

var line_1= echarts.init(document.getElementById('line-1'));
var line_1_option = {
    grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        top:'4%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            splitLine: { //网格线
                show: true
            },
            axisLine:{
                show:false
            },
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            splitLine: { //网格线
                show: false
            },
            axisLine:{
                show:false
            },
            axisLabel:{
                show:false
            },
        }
    ],
    series : [
        {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            data:[120, 132, 101, 134, 90, 230, 210]
        }
    ]
};
line_1.setOption(line_1_option);

var line_2= echarts.init(document.getElementById('line-2'));
var line_2_option = {
    grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        top:'4%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            splitLine: { //网格线
                show: true
            },
            axisLine:{
                show:false
            },
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value',
            splitLine: { //网格线
                show: false
            },
            axisLine:{
                show:false
            },
            axisLabel:{
                show:false
            },
        }
    ],
    series : [
        {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            data:[120, 132, 101, 134, 90, 230, 210]
        }
    ]
};
line_2.setOption(line_2_option);


/*
获取企业设备分组列表
*/
// function getCompGroupList(){
//     $.ajax({
//         url:baseurl+"devicegroup/get_list_comp?comp_id="+sessionStorage.getItem("CompanyId"),
//         type: "get",
//         dataType: "json",
//         success: function(data, textStatus){
//             if(data.code==0){
//                 var ele=$("#mine #task2-tab1");
//                 ele.find("ul").html("");
//                 for(var i=0;i<data.data.length;i++){
//                     ele.find("ul").append('<li class="aui-list-item aui-list-item-middle">'+
//                                     '<div class="aui-media-list-item-inner">'+
//                                         '<div class="aui-list-item-inner">'+
//                                             '<div class="aui-list-item-text">'+
//                                                 '<div class="aui-list-item-title aui-font-size-14">'+data.data[i].DeviceGroupName+'</div>'+
//                                                 '<div class="aui-list-item-right sit-position" onclick="openActionsheet(\''+data.data[i].DeviceGroupId+'\',\''+data.data[i].DeviceGroupName+'\')"><i class="fa fa-ellipsis-h"></i></div>'+
//                                             '</div>'+
//                                             '<div class="aui-list-item-text">'+data.data[i].DeviceCount+'台</div>'+
//                                         '</div>'+
//                                     '</div>'+
//                                 '</li>');
//                 }

//             }
//             else{
//                 showToast(data.msg);
//             }
//         },
//         error:function(error){
//             showToast("获取企业设备分组列表失败！")
//         }
//     })
// }

