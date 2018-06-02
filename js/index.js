
var dialog = new auiDialog();
var baseurl="http://xnapi.sanlogic.cn/";
// var baseurl="http://47.96.129.11/";
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
                    sessionStorage.setItem("phone",$("#login input[name=userPhone]").val());
                    setCookie("Account",data.data[0].Account,30);
                    sessionStorage.setItem("Account",data.data[0].Account);
                    setCookie("Birthday",data.data[0].Birthday,30);
                    sessionStorage.setItem("Birthday",data.data[0].Birthday);
                    setCookie("Email",data.data[0].Email,30);
                    sessionStorage.setItem("Email",data.data[0].Email);
                    setCookie("Gender",data.data[0].Gender,30);
                    sessionStorage.setItem("Gender",data.data[0].Gender);
                    setCookie("HeadIcon",(data.data[0].HeadIcon?baseurl+data.data[0].HeadIcon:data.data[0].HeadIcon),30);
                    sessionStorage.setItem("HeadIcon",(data.data[0].HeadIcon?baseurl+data.data[0].HeadIcon:data.data[0].HeadIcon));
                    // setCookie("NickName",data.data[0].NickName,30);
                    // sessionStorage.setItem("NickName",data.data[0].NickName);
                    setCookie("position",data.data[0].position,30);
                    sessionStorage.setItem("position",data.data[0].position);
                    setCookie("RealName",data.data[0].RealName,30);
                    sessionStorage.setItem("RealName",data.data[0].RealName);
                    setCookie("UserId",data.data[0].UserId,30);
                    sessionStorage.setItem("UserId",data.data[0].UserId);
                    setCookie("UserType",data.data[0].UserType,30);
                    sessionStorage.setItem("UserType",data.data[0].UserType);
                    if(data.data[0].UserType==2){
                        $(".adminFunc").css("display","");
                    }
                    else{
                        $(".adminFunc").css("display","none");
                    }
                    if(data.data[0].UserType==0||!data.data[0].CheckMark){
                        turnPage("#select-identity","login");
                    }
                    else{
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
    var registerPassword=$("#register input[name=userPassword]").val();
    if((/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test($("#register input[name=userPassword]").val()))){
    // if((/[A-Za-z0-9]{8,20}$/.test(registerPassword))){
    // if(registerPassword<16&&registerPassword>7){
        $.ajax({
            type: "post",
            dataType: "json",
            url: baseurl+"user/register",
            data:{ac:$("#register input[name=userPhone]").val(),pw:$("#register input[name=userPassword]").val(),pv:$("#register input[name=verify]").val()},
            success: function(data){
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
        showToast("密码必须为8-15位,有字母和数字组成");
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
        data:{comp_name:$("#select-company input[name=company-name]").val()} ,
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
        data:{user_id:sessionStorage.getItem("UserId"),comp_name:$("#sit-company input[name=companyName]").val(),comp_addr:$("#sit-company input[name=companyAddr]").val()} ,
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
    if((/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test($("#find-password input").eq(2).val()))){
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

//饼状图生成；
var run_pie= echarts.init(document.getElementById('run_pie'));
option = {
    title:{
        text:"总运行率\n  43%",
        subtext:"较昨日此时有所下降",
        top:'30%',
        left:'center',
        textStyle:{
            color:"#585858",
            align:'center',
            fontWeight:"400",
            verticalAlign:"center"
        },
        subtextStyle:{
            align:'center'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    backgroundColor:"white",
    legend: {
        orient: 'horizontal',
        x: 'center',
        y:'bottom',
        itemWidth:10,
        itemHeight:10,
        textStyle:{
            fontSize:8,
            textAlign:'center'
        },
        data:['正常运行','故障运行','正常停机','调试','维修保养','故障停机']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            center:["50%","40%"],
            avoidLabelOverlap: false,
            color:["#23ad3a","#036a36","#b7b7b7","#1b82d2","#f4a523","#e10621"],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'正常运行'},
                {value:310, name:'故障运行'},
                {value:234, name:'正常停机'},
                {value:135, name:'调试'},
                {value:1548, name:'维修保养'},
                {value:1548, name:'故障停机'}
            ]
        }
    ]
};
run_pie.setOption(option);
run_pie.on("click",function(params){
    console.log(params);
    pieClick(params.name,params.dataIndex);
})

$("#index").css("display","none");
function pieClick(name,index){
    $("#table").bootstrapTable("destroy");
    $.ajax({
        url:baseurl+"records/statedetails?comp_id="+sessionStorage.getItem("CompanyId")+"&state="+index+"&group_id="+$("#index #indexTab1 select").val(),
        type:"get",
        dataType:"json",
        success:function(data){
            if(index==0||index==1||index==2){
                var columns=[{field: 'Encode',title: name,align:"center"}, 
                             {field: 'DeviceName',title: '设备名称',align:"center"}]
            }
            else{
                var columns=[{field: 'Encode',title: name,align:"center"}, 
                             {field: 'DeviceName',title: '设备名称',align:"center"},
                             {field:"CheckTime",title:"点检时间",align:"center",formatter:function(value,row,index){
                                return value.split("T")[1];
                             }}]
            }
            $('#table').bootstrapTable({
                striped:true,
                classes:"table table-no-bordered",
                data: data.data,
                columns: columns,
                onClickRow:function(row,ele,field){
                    turnDeviceDetail(row.DeviceId);
                }
            });
            
        },
        error:function(error){

        }
    })
}

//table init
$('#table').bootstrapTable({
    striped:true,
    classes:"table table-no-bordered",
    data: [],
    columns: [
        {field: 'State',title: '设备状态',align:"center",formatter:function(value,row,index){
            var name=["正常运行","故障运行","正常停机","故障停机","维修保养","调试"];
            return name[value];
        }}, 
        {field: 'CurCount',title: '台数',align:"center"}, 
        {field: 'YesCount',title: '比前一天',align:"center",formatter:function(value,row,index){
            if(row.CurCount>row.YesCount){
                return (row.CurCount/1-row.YesCount/1)+"<span class='fa fa-long-arrow-up'></span>"
            }
            else if(row.CurCount<row.YesCount){
                return (row.YesCount/1-row.CurCount/1)+"<span class='fa fa-long-arrow-up'></span>"
            }
            else{
                return 0;
            }
        }}
    ],
    onClickRow:function(row,ele,field){
        console.log(row);
    }
});

    var line_0=echarts.init(document.getElementById('line-0')),
    line_1=echarts.init(document.getElementById('line-1')),
    line_2=echarts.init(document.getElementById('line-2')),
    line_3=echarts.init(document.getElementById('line-3')),
    line_4=echarts.init(document.getElementById('line-4')),
    line_5=echarts.init(document.getElementById('line-5'));

var line_option = {
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
line_0.setOption(line_option);
line_1.setOption(line_option);
line_2.setOption(line_option);
line_3.setOption(line_option);
line_4.setOption(line_option);
line_5.setOption(line_option);


$("#index-detail").css("display","none");

/*
turn 设备详情-设备状态
id deviceid 设备ID
*/
function turnDeviceDetail(id){
    turnPage("#index-detail","index");
    $("#index-detail header .aui-title").attr("data-deviceId",id);
    for(var i=0;i<6;i++){
        deviceDetailLine(i,7);
    }
}

/*
设备详情-设备状态 折线图 时间select
num 设备状态
thiz select
*/
function LineTimeSelect(num,thiz){
    deviceDetailLine(num,$(thiz).val());
}

/*
设备详情-设备状态 折线图
state 设备状态:正常运行:0 故障运行:1 正常停机:2 故障停机:3 维修保养:4 调试:5
num 查看日期 7=按周 30=按月 other=按年
*/
function deviceDetailLine(state,num){
    if(num==7){
        var day=new Date();
        var dayEnd=new Date(day.getTime()-1000*3600*24*7);
        day=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
        dayEnd=dayEnd.getFullYear()+"-"+(dayEnd.getMonth()+1)+"-"+dayEnd.getDate();
        $("#line-"+state).siblings(".right").find("span").eq(1).html("周运行率");

    }
    else if(num==30){
        var day=new Date();
        var dayEnd=new Date();
        dayEnd.setMonth(day.getMonth()-1);
        day=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
        dayEnd=dayEnd.getFullYear()+"-"+(dayEnd.getMonth()+1)+"-"+dayEnd.getDate();
        $("#line-"+state).siblings(".right").find("span").eq(1).html("月运行率");
    }
    else{
        var day=new Date();
        var dayEnd=new Date();
        dayEnd.setFullYear(day.getFullYear()-1);
        day=day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
        dayEnd=dayEnd.getFullYear()+"-"+(dayEnd.getMonth()+1)+"-"+dayEnd.getDate();
        $("#line-"+state).siblings(".right").find("span").eq(1).html("年运行率");
    }
    $.ajax({
        url:baseurl+"records/datecountsperwmy?comp_id="+sessionStorage.getItem("CompanyId")+"&state="+state+"&startdate="+day+"&enddate="+dayEnd,
        type:"get",
        dataType:"json",
        success:function(data){
            console.log(data);
            $("#line-"+state).siblings(".right").find("span").eq(0).html(data.data.Rate);
            line_option.xAxis[0].data=[];
            line_option.series[0].data=[];
            for(var i=0;i<data.data.DateCounts.length;i++){
                line_option.xAxis[0].data.push(data.data.DateCounts[i].CheckDate);
                line_option.series[0].data.push(data.data.DateCounts[i].CheckCount);
            }
            if(state==0){
                line_0.setOption(line_option);
            }
            else if(state==1){
                line_1.setOption(line_option);
            }
            else if(state==2){
                line_2.setOption(line_option);
            }
            else if(state==3){
                line_3.setOption(line_option);
            }
            else if(state==4){
                line_4.setOption(line_option);
            }
            else{
                line_5.setOption(line_option);
            }
        },
        error:function(error){

        }
    })
}

/*
获取设备详情-管理记录
id 设备id
*/
function getDeviceDetail(id){
    $.ajax({
        url:baseurl+"device/getdevicedetail?device_id="+id,
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                $("#index-detail #tab2 li").eq(0).find(".aui-list-item-right").value(data.data.userName);          
            }
            else{
                showToast(data.msg)
            }
        },
        error:function(error){

        }
    })
    $("#index-detail #tab2 li").eq(0).attr("onclick","turnSitPrincipal('"+id+"')");
    $("#index-detail #tab2 li").eq(1).attr("onclick","turnRunRecord('"+id+"')");
    $("#index-detail #tab2 li").eq(2).attr("onclick","turnRecord(2,'"+id+"')");
    $("#index-detail #tab2 li").eq(3).attr("onclick","turnRecord(3,'"+id+"')");
}

/*
turnRunRecord turn运行记录
id deviceid
 */
function turnRunRecord(id){
    var ele=$("#run-record .aui-content");
    ele.html("");
    $.ajax({
        url:baseurl+"records/checkrecords?user_id="+sessionStorage.getItem("UserId")+"&device_id="+id,
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data.length>0){
                    for(var i=0;i<data.data.pgList.length;i++){
                        var result=['正常运行','故障运行','正常停机','调试','维修保养','故障停机'];
                        ele.append('<div class="aui-card-list">'+
                                        '<div class="aui-card-list-title"></div>'+
                                        '<div class="aui-card-list-content">'+
                                            '<span class="aui-col-xs-6">负责人：'+data.data.pgList[i].UserName+'</span>  <span class="aui-col-xs-6">点检结果：'+result[data.data.pgList[i].State]+'</span> <br>'+
                                            '<span class="aui-col-xs-6">开机时间：'+data.data.pgList[i].startTime+'</span> <span class="aui-col-xs-6">关机时间：'+data.data.pgList[i].endTime+'</span>'+
                                        '</div>'+
                                        '<div class="aui-card-list-footer">'+
                                            
                                        '</div>'+
                                    '</div>');
                    }
                    turnPage("#run-record","index-detail");
                }
                else{
                    ele.html("无记录");
                    turnPage("#run-record","index-detail");
                }
            }
            else{
                ele.html("无记录");
                showToast(data.msg)
                turnPage("#run-record","index-detail");
            }
        },
        error:function(error){
            showToast("获取记录失败！请重试");
            ele.html("无记录");
            turnPage("#run-record","index-detail");
        }
    })
}

/*
turn 运行-设备详情-维修/保养记录
num 点检:1 维修：2 保养：3 默认：0
id 设备id
*/
function turnRecord(num,id){
    if(num==2){
        $("#index-record header .aui-title").html("维修记录");
    }
    else{
        $("#index-record header .aui-title").html("保养记录");
    }
    var ele=$("#index-record .aui-content");
    ele.html("");
    $.ajax({
        url:baseurl+"task/gettaskbyuserid?user_id="+sessionStorage.getItem("UserId")+"&type="+num,
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data.pgList.length>0){
                    for(var i=0;i<data.data.pgList.length;i++){
                        ele.append('<div class="aui-card-list">'+
                                        '<div class="aui-card-list-footer">'+
                                            data.data.pgList[i].FinishTime+
                                        '</div>'+
                                        '<div class="aui-card-list-content">'+
                                            '<span>负责人：'+data.data.pgList[i].ChargerName+'</span> &nbsp;&nbsp;&nbsp; <span>维修人：'+data.data.pgList[i].UserName+'</span> <br>'+
                                            '<div id="wrap" class="wrap">'+
                                                '<div>'+
                                                    '<p>'+data.data.pgList.Solution+'</p>'+
                                                '</div>'+
                                                '<div id="gradient" class="gradient"></div>'+
                                            '</div>'+
                                            '<div id="read-more" class="read-more"></div>'+
                                            '<span></span>'+
                                            // '<div class="aui-row aui-row-padded">'+
                                            //     '<div class="aui-col-xs-3">'+
                                            //         '<img src="images/demo1.png"/>'+
                                            //     '</div>'+
                                            //     '<div class="aui-col-xs-3">'+
                                            //         '<img src="images/demo2.png" />'+
                                            //     '</div>'+
                                            //     '<div class="aui-col-xs-3">'+
                                            //         '<img src="images/demo3.png" />'+
                                            //     '</div>'+
                                            //     '<div class="aui-col-xs-3">'+
                                            //         '<img src="images/demo3.png" />'+
                                            //     '</div>'+
                                            // '</div>'+
                                            '<div class="aui-card-list-footer">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>');
                    }
                    turnPage("#index-record","index-detail");
                }
                else{
                    ele.html("无记录");
                    turnPage("#index-record","index-detail");
                }
            }
            else{
                ele.html("无记录");
                turnPage("#index-record","index-detail");
                showToast(data.msg);
            }
        },
        error:function(error){
            ele.html("无记录");
            turnPage("#index-record","index-detail");
            showToast("获取失败！请重试");
        }
    })
}

/*
turn 设备详情-设备详情
id 设备id
*/
function deviceDetail(id){
    $.ajax({
        url:baseurl+"device/getdevicedetail?device_id="+id,
        type:"get",
        dataType:"json",
        success:function(data){
            var ele=$("#index-detail .tab").eq(2);
            ele.find("span").eq(0).html(data.data.F_Name);
            ele.find("span").eq(1).html("功能描述："+verifyData(data.data.F_Description));
            ele.find("span").eq(3).html("设备型号："+verifyData(data.data.F_Model));
            ele.find("span").eq(4).html("生产厂家："+verifyData(data.data.F_Factory));
            ele.find("span").eq(5).html("出厂时间："+verifyData(data.data.F_CreatorTime));
            ele.find("span").eq(6).html("购买单价："+verifyData(data.data.F_Price));
            ele.find("span").eq(7).html("入库时间："+verifyData(data.data.F_StorageTime));
            ele.find("span").eq(8).html("设备编号："+verifyData(data.data.F_EnCode));
            ele.find("span").eq(9).html("所在分组："+verifyData(data.data.F_GroupName));
            ele.find(".aui-row").html();
            if(data.data.F_HeadIcon){
                var url=data.data.F_HeadIcon.split(";");
                for(var i=0;i<url.length;i++){
                    ele.find(".aui-row").append('<div class="aui-col-xs-3">'+
                                                    '<img src="'+url[i]+'"/>'+
                                                '</div>');
                }
            }
        },
        error:function(error){
            showToast("详情获取失败");
            var ele=$("#index-detail .tab").eq(2);
            ele.find("span").eq(0).html("详情获取失败");
            ele.find("span").eq(1).html("功能描述："+"");
            ele.find("span").eq(3).html("设备型号："+"");
            ele.find("span").eq(4).html("生产厂家："+"");
            ele.find("span").eq(5).html("出厂时间："+"");
            ele.find("span").eq(6).html("购买单价："+"");
            ele.find("span").eq(7).html("入库时间："+"");
            ele.find("span").eq(8).html("设备编号："+"");
            ele.find("span").eq(9).html("所在分组："+"");
            ele.find(".aui-row").html("");
            if(data.data.F_HeadIcon){
                var url=data.data.F_HeadIcon.split(";");
                for(var i=0;i<url.length;i++){
                    ele.find(".aui-row").append('<div class="aui-col-xs-3">'+
                                                    '<img src="'+url[i]+'"/>'+
                                                '</div>');
                }
            }
        }
    })
}

/*
空数据验证
*/
function verifyData(data){
    return data?data:"空";
}

/*
index页面初始化
*/
function initIndex(){
    $("#index header .aui-title").html(sessionStorage.getItem("CompanyName"));
    $("#index #indexTab1 select").html("");
    $("footer div.aui-bar-tab-item").removeClass("aui-active").eq(0).addClass("aui-active");
    $("footer img").eq(2)[0].src="images/me.png";
    $("footer img").eq(0)[0].src="images/yunxin_on.png";
    $.ajax({
        url:baseurl+"devicegroup/get_list_comp?comp_id="+sessionStorage.getItem("CompanyId"),
        type: "get",
        dataType: "json",
        success: function(data, textStatus){
            if(data.code==0){
                $("#index #indexTab1 select").html('<option value="" checked>全部分组</option>');
                for(var i=0;i<data.data.length;i++){
                    $("#index #indexTab1 select").append("<option value='"+data.data[i].DeviceGroupId+"'>"+data.data[i].DeviceGroupName+"</option>");
                }
                getPieData();
            }
            else{
                showToast(data.msg);
                getPieData();
            }
        },
        error:function(error){
            showToast("获取设备类型失败！");
            getPieData();
        }
    });
    

}

/*
获取首页饼图数据并生成饼图
同时生成表格
*/
function getPieData(){
    $.ajax({
        url:baseurl+"records/getstatecountslist?comp_id="+sessionStorage.getItem("CompanyId")+"&group_id="+$("#index #indexTab1 select").val(),
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                var todayRun=0,yesRun=0,todayDev=0,yesDev=0;
                option.series[0].data=[{value:0, name:'正常运行'},
                                        {value:0, name:'故障运行'},
                                        {value:0, name:'正常停机'},
                                        {value:0, name:'调试'},
                                        {value:0, name:'维修保养'},
                                        {value:0, name:'故障停机'}
                                    ];
                for(var i=0;i<data.data.length;i++){
                    option.series[0].data[i].value=data.data[i].CurCount;
                    if(data.data[i].State==0||data.data[i].State==1){
                        todayRun+=(data.data[i].CurCount/1);
                        yesRun+=(data.data[i].YesCount/1);
                    }
                    todayDev+=(data.data[i].CurCount/1);
                    yesDev+=(data.data[i].YesCount/1);
                }
                if(todayDev!=0){
                    var todayRate=todayRun/todayDev;
                }
                else{
                    var todayRate=0;
                }
                option.title.text="总运行率\n "+todayRate*100+"%";
                if(yesDev!=0){
                    var yesRate=yesRun/yesDev;
                }
                else{
                    var yesRate=0;
                }
                if(todayRate<yesRate){
                    option.title.subtext="较昨日此时有所下降";
                }
                else if(todayRate>yesRate){
                    option.title.subtext="较昨日此时有所上升";
                }
                else{
                    option.title.subtext="与昨日此时相等";
                }
                run_pie.setOption(option);
                run_pie.on("click",function(params){
                    pieClick(params.name);
                });
                $("#table").bootstrapTable("destroy");
                $('#table').bootstrapTable({
                    striped:true,
                    classes:"table table-no-bordered",
                    data: data.data,
                    columns: [
                        {field: 'State',title: '设备状态',align:"center",formatter:function(value,row,index){
                            var name=["正常运行","故障运行","正常停机","故障停机","维修保养","调试"];
                            return name[value];
                        }}, 
                        {field: 'CurCount',title: '台数',align:"center"}, 
                        {field: 'YesCount',title: '比前一天',align:"center",formatter:function(value,row,index){
                            if(row.CurCount>row.YesCount){
                                return (row.CurCount/1-row.YesCount/1)+"<span class='fa fa-long-arrow-up'></span>"
                            }
                            else if(row.CurCount<row.YesCount){
                                return (row.YesCount/1-row.CurCount/1)+"<span class='fa fa-long-arrow-up'></span>"
                            }
                            else{
                                return 0;
                            }
                        }}
                    ],
                    onClickRow:function(row,ele,field){
                        console.log(row);
                    }
                });
            }
        },
        error:function(error){

        }
    })
}

/*
生成色卡图
*/
function generateBar(){
    var color=["#23ad3a","#036a36","#b7b7b7","#1b82d2","#f4a523","#e10621"];
    var ele=$("#index .tabs #indexTab2 .content-block");
    ele.html("");
    $.ajax({
        url:baseurl+"records/getstatestoday?comp_id="+sessionStorage.getItem("CompanyId")+"&group_id="+$("#index #indexTab1 select").val(),
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data.length>0){
                    for(var i=0;i<data.data.length;i++){
                        ele.append('<div class="progress-block">'+
                                        '<span>'+data.data[i].DeviceName+'</span>'+
                                        '<div class="progress">'+
                                        '</div>'+
                                    '</div>');
                        for(var i2=0;i2<data.data[i].StateTimes.length;i2++){
                            var width=0;
                            if(i2==0){
                                width=(data.data[i].StateTimes[i2].Time.split("T")[1].split(":")[0]/1)/24;
                            }
                            else{
                                width=(data.data[i].StateTimes[i2].Time.split("T")[1].split(":")[0]/1-data.data[i].StateTimes[i2-1].Time.split("T")[1].split(":")[0]/1)/24;
                            }
                            ele.find(".progress").last().append('<div class="progress-bar progress-bar-gray" role="progressbar" aria-valuenow="3" aria-valuemin="0" aria-valuemax="100" style="min-width: 0em;width:'+width*100+'%'+' background-color:'+color[(data.data[i].StateTimes[i2].State/1-1)]+'"></div>');
                        }
                    }
                }
                else{
                    ele.html("未获取到设备");
                }
            }
            else{
                showToast(data.msg);
                ele.html("未获取到设备");
            }
        },
        error:function(error){
            showToast("获取失败！请重试");
            ele.html("未获取到设备");
        }
    })
}

/*
首页设备详情中 设置负责人 跳转
id设备ID
*/
function turnSitPrincipal(id){
    turnPage("#sit-principal","index-detail");
    $("#sit-principal header .aui-title").html("选择负责人");
    $("#sit-principal header .aui-pull-right").attr("onclick","deviceSitPrincipal("+id+")");
    var ele=$("#sit-principal .content .aui-list");
    initPrincipal(ele);
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
    ele.find(".my-title .userName").html(sessionStorage.getItem("RealName"));
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
turn 设备管理
*/
function turnDevManage(){
    getgroup(0,$("#dev-manage .content .aui-list"));
    turnPage("#dev-manage","mine");

}

/*
turn 人员管理
*/
function turnUserManage(){
    getgroup(1,$("#user-manage .content .aui-list"));
    turnPage("#user-manage","mine");
}

/*
获取设备/人员分组列表；
num 0：设备；1：人员；
ele 父元素；
*/
function getgroup(num,ele){
    if(num){
        var url="usergroup/group_list?comp_id=";
    }
    else{
        var url="devicegroup/get_list_comp?comp_id=";
    }
    ele.html("");
    if(sessionStorage.getItem("CompanyId")){
        $.ajax({
            url:baseurl+url+sessionStorage.getItem("CompanyId"),
            type: "get",
            dataType: "json",
            success: function(data, textStatus){
                if(data.code==0){
                    // var ele=$("#task2 #task2-tab1 .aui-content .aui-list");
                    if(data.data.length>0){
                        for(var i=0;i<data.data.length;i++){
                            ele.append('<li class="aui-list-item aui-list-item-middle">'+
                                    '<div class="aui-media-list-item-inner">'+
                                        '<div class="aui-list-item-inner">'+
                                            '<div class="aui-list-item-text">'+
                                                '<div class="aui-list-item-title aui-font-size-14"  onclick="'+(num?'userList':'getdeviceByGroup')+'(\''+(num?data.data[i].UserGroupId:data.data[i].DeviceGroupId)+'\',\''+(num?data.data[i].UserGroupName:data.data[i].DeviceGroupName)+'\')">'+(num?data.data[i].UserGroupName:data.data[i].DeviceGroupName)+'</div>'+
                                                '<div class="aui-list-item-right sit-position" onclick="openActionsheet('+num+',\''+(num?data.data[i].UserGroupId:data.data[i].DeviceGroupId)+'\',\''+(num?data.data[i].UserGroupName:data.data[i].DeviceGroupName)+'\')"><i class="fa fa-ellipsis-h"></i></div>'+
                                            '</div>'+
                                            '<div class="aui-list-item-text">'+
                                                (num?"":(data.data[i].DeviceCount+'台'))+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>');
                        }
                    }
                    else{
                        ele.html("未添加分组");
                    }
                }
                else{
                    showToast(data.msg);
                }
            },
            error:function(error){
                showToast("获取分组列表失败！")
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
    // turnPage("#devList","task2");
    turnPage("#devList","dev-manage");
    if(group_name){
        $("#devList header .aui-title").html(group_name);
    }
    $("#devList header .aui-title").attr("data-groupId",group_id);
    $.ajax({
        url:baseurl+"device/getlistbygroupid?comp_id="+sessionStorage.getItem("CompanyId")+"&group_id="+group_id,
        type: "get",
        dataType: "json",
        success:function(data){
            if(data.code==0){
                var ele=$("#devList .content .aui-list");
                ele.html("");
                if(data.data.length>0){
                    for(var i=0;i<data.data.length;i++){
                        ele.append('<li class="aui-list-item aui-list-item-middle">'+
                                        '<div class="aui-media-list-item-inner">'+
                                            '<div class="aui-list-item-inner">'+
                                                '<div class="aui-list-item-text">'+
                                                    '<div class="aui-list-item-title aui-font-size-14" onclick="turnDevDetail(\''+data.data[i].DeviceId+'\')">'+data.data[i].DeviceName+'</div>'+
                                                    '<div class="aui-list-item-right sit-position" onclick="openDeviceAction(\''+data.data[i].DeviceId+'\',\''+data.data[i].DeviceName+'\')"><i class="fa fa-ellipsis-h"></i></div>'+
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
                    ele.html("<div class='noContent'>该分组下没有设备！</div>");
                }
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            var ele=$("#devList .content .aui-list");
            ele.html("");
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
                url:baseurl+"device/delete?device_id="+id,
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
负责人列表生成
*/
function initPrincipal(ele){
    $.ajax({
        url:baseurl+"usergroup/group_list?comp_id="+sessionStorage.getItem("CompanyId"),
        type:"get",
        dataType:'json',
        success:function(data){
            ele.html("");
            if(data.code==0){
                console.log(data.data);
                if(data.data.length>0){
                    for(var i=0;i<data.data.length;i++){
                        ele.append('<div class="aui-collapse-item">'+
                                        '<li class="aui-list-item aui-collapse-header" tapmode>'+
                                            '<div class="aui-list-item-inner">'+
                                                '<div class="aui-list-item-text">'+
                                                    '<div class="aui-list-item-title aui-font-size-14">'+data.data[i].UserGroupName+'</div> &nbsp;&nbsp;'+
                                                    // '<div class="aui-list-item-text">'+data.data[i].UserCount+'人'+'</div>'+
                                                '</div>'+
                                                '<div class="aui-list-item-right">'+
                                                    '<i class="aui-iconfont aui-icon-down aui-collapse-arrow"></i>'+
                                                '</div>'+
                                            '</div>'+
                                        '</li></div>');
                        $.ajax({
                            url:baseurl+"user/getlistbygroupid?comp_id="+sessionStorage.getItem("CompanyId")+'&group_id='+data.data[i].UserGroupId,
                            type:'get',
                            async:false,
                            dataType:"json",
                            success:function(data){
                                var user_ele=ele.find('.aui-collapse-item').last();
                                if(data.code==0){
                                    if(data.data.length>0){
                                        user_ele.append('<div class="aui-collapse-content"></div>');
                                        for(var user_i=0;user_i<data.data.length;user_i++){
                                            if(data.data[user_i].UserType==3){
                                                user_ele.find(".aui-collapse-content").append('<li class="aui-list-item">'+
                                                                                                '<div class="aui-list-item-inner">'+
                                                                                                    '<div class="aui-list-item-title">'+(data.data[user_i].RealName?data.data[user_i].RealName:data.data[user_i].MobilePhone)+'</div>'+
                                                                                                    '<div class="aui-list-item-right">'+
                                                                                                        '<input class="aui-radio aui-radio-white" type="radio" name="demo1" checked="" value="'+data.data[user_i].UserId+'" data-value="'+(data.data[user_i].RealName?data.data[user_i].RealName:data.data[user_i].MobilePhone)+'">'+
                                                                                                    '</div>'+
                                                                                                '</div>'+
                                                                                            '</li>');
                                            }
                                        }

                                    }
                                    var collapse = new auiCollapse({
                                        autoHide:false //是否自动隐藏已经展开的容器
                                    });
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
设置设备 负责人 跳转
id设备ID
*/
function turndeviceSitPrincipal(id){
    turnPage("#sit-principal","devList");
    $("#sit-principal header .aui-title").html("选择负责人");
    $("#sit-principal header .aui-pull-right").attr("onclick","deviceSitPrincipal("+id+")");
    var ele=$("#sit-principal .content .aui-list");
    initPrincipal(ele);
}

/*
turn 编辑设备详情 
id 设备id
*/
function turnEditDevice(id){
    $("#add-dev header .aui-title").html("编辑设备");
    $("#add-dev header .aui-pull-right").attr("onclick","editDevice('"+id+"')");
    
    $.ajax({
        url:baseurl+"device/getdevicedetail?device_id="+id,
        type:"get",
        dataType:"json",
        success:function(data){
            var ele=$("#add-dev .aui-content");
            ele.find("input[name=device_name]").val(data.F_Name);
            ele.find("input[name=device_model]").val(data.F_Model);
            ele.find("input[name=factory]").val(data.F_Factory);
            ele.find("input[name=description]").val(data.F_Description);
            ele.find("input[name=made_time]").val(data.F_CreatorTime.split("T")[0].replace(/-/g,"/"));
            ele.find("input[name=time_storage]").val(data.F_StorageTime?data.F_StorageTime.split("T")[0].replace(/-/g,"/"):"");
            ele.find("input[name=price]").val(data.F_Price);
            ele.find("input[name=encoding]").val(data.encoding);
            ele.find("#groupName").attr("onclick","turnDeviceDetailSitGroup('"+data.F_GroupId+"')");
            ele.find("#groupName .aui-list-item-right").attr("data-id",data.F_GroupId);
            ele.find("#groupName .aui-list-item-right").html(data.F_GroupName);
            
            turnPage("#add-dev","devList"); 
        },
        error:function(error){
            showToast("获取设备详情失败！")
        }
    })
}

/*
*查看设备详情
*/
function turnDevDetail(id){
    $("#dev-detail header a.aui-btn").attr("onclick","turnEditDevice('"+id+"')");

    var ele=$("#dev-detail .content")
    ele.find(".aui-list-item-right").html("");
    $.ajax({
        url:baseurl+"device/getdevicedetail?device_id="+id,
        type:"get",
        dataType:"json",
        success:function(data){
            var ele_right=ele.find(".aui-list-item-right")
            ele_right.eq(0).html(data.F_Name);
            ele_right.eq(1).html(data.F_Model);
            ele_right.eq(2).html(data.F_Factory);
            ele_right.eq(3).html(data.F_Description);
            ele_right.eq(4).html(data.F_CreatorTime.split("T")[0].replace(/-/g,"/"));
            ele_right.eq(5).html(data.F_StorageTime?data.F_StorageTime.split("T")[0].replace(/-/g,"/"):"");
            ele_right.eq(6).html(data.F_Price);
            ele_right.eq(7).html(data.encoding);
            ele_right.eq(8).html(data.F_GroupName);

            turnPage("#dev-detail","devList");
        },
        error:function(data){
            showToast("获取设备详情失败！");
        }
    })
}

/*
editDevice 编辑设备详情
id 设备id
*/
function editDevice(id){
    var formData=$("#add-dev form").parseForm();
    formData.company_id=sessionStorage.getItem("CompanyId");
    formData.user_id=sessionStorage.getItem("UserId");
    formData.group_id=$("#add-dev #groupName div.aui-list-item-right").attr("data-id");
    formData.annex=$("devFile").attr("data-url");
    formData.device_id=id;
    formData.storage_time=formData.storage_time.replace(/\//g,"-")+"T00:00:00"
    $.ajax({
        url:baseurl+"device/edit",
        type:"PATCH",
        data:formData,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("设备详情修改成功");
                getdeviceByGroup($("#devList header .aui-title").attr("data-groupId"));
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
        url:baseurl+"device/setdirector",
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
    $("#sit-group header .aui-pull-right").attr("onclick","sitGroup(0,'"+id+"')");
    var ele=$("#sit-group .content-block .aui-list");
    getGroupRadio(0,ele);
}

/*
获取设备分组 带radio
num 0:设备；1：人员；
ele 父元素
*/
function getGroupRadio(num,ele,val){
    var url=(num?"usergroup/getlist?comp_id=":"devicegroup/get_list_comp?comp_id=")
    $.ajax({
        url:baseurl+url+sessionStorage.getItem("CompanyId"),
        type:"get",
        dataType:"json",
        success:function(data){
            ele.html("");
            if(data.code==0){
                for(var i=0;i<data.data.length;i++){
                    ele.append('<li class="aui-list-item">'+
                                    '<div class="aui-list-item-inner">'+
                                        '<div class="aui-list-item-title">'+(num?data.data[i].UserGroupName:data.data[i].DeviceGroupName)+'</div>'+
                                    '</div>'+
                                    '<div class="aui-list-item-right sit-position"><input class="aui-radio aui-radio-white" type="radio" name="radio" value="'+(num?data.data[i].UserGroupId:data.data[i].DeviceGroupId)+'" checked data-name="'+(num?data.data[i].UserGroupName:data.data[i].DeviceGroupName)+'"></div>'+
                                '</li>');

                }
                if(val){
                    $("radio[name=radio][value="+val+"]").prop("checked","checked");
                }
            }
            else{
                showToast(msg);
            }
        },
        error:function(error){
            showToast("获取分组列表失败！");
        }
    })
}

/*
设置设备分组
id 设备id
*/
function sitGroup(num,id){
    if(!$("#sit-group .aui-content input:checked").val()){
        showToast("请选择分组！");
        return;
    }
    var url=(num?"user/setgroup":"device/setgroup");
    var data={"group_id":$("#sit-group .aui-content input:checked").val()};
    if(num){
        data["user_ids"]=[id];
    }
    else{
        data["device_ids"]=[id];
    }
    $.ajax({
        url:baseurl+url,
        type:"post",
        data:data,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("设置分组成功！");
                if(num){
                    var ele=$("#user-manage .aui-list")
                    turnPage("#user-manage",'sit-group');
                }
                else{
                    var ele=$("#dev-manage .aui-list");
                    turnPage("#dev-manage",'sit-group');
                }
                // var ele=$("#task2 .tab").eq(num).find(".aui-content ul");
                getgroup(num,ele);
                // turnPage("#task2",'sit-group');
                // turnPage("#dev-manage",'sit-group');
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
    $("#add-dev header .aui-pull-right").attr("onclick","addDev()");
    turnPage("#add-dev","dev-manage");
}

/*
添加设备
*/
function addDev(){
    var formData=$("#add-dev form").parseForm();
    formData.company_id=sessionStorage.getItem("CompanyId");
    formData.user_id=sessionStorage.getItem("UserId");
    formData.group_id=$("#add-dev #groupName div.aui-list-item-right").attr("data-id");
    formData.annex=$("devFile").attr("data-url");
    $.ajax({
        url:baseurl+"device/add",
        type:"POST",
        data:formData,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("设备添加成功！");
                var ele=$("#task2 .tab").eq(1).find(".aui-content ul");
                getgroup(0,ele);
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
function turnDeviceDetailSitGroup(val){
    $("#sit-group header .aui-pull-right").attr("onclick","deviceDetailSitGroup()");
    turnPage("#sit-group","add-dev");
    var ele=$("#sit-group .aui-content .aui-list");
    getGroupRadio(0,ele,val);
}

/*
设备详情中 设置分组
*/
function deviceDetailSitGroup(){
    $("#add-dev #groupName .aui-list-item-right").html($("#sit-group .aui-content input:checked").attr("data-name")).attr("data-id",$("#sit-group .aui-content input:checked").val());
    pageBack();
    // $("#sit-group .aui-content input:checked").val();
}

/*
添加设备分组
num 0:设备；1：人员；
*/
function addGroup(num){
    var dialog = new auiDialog();
    dialog.prompt({
        title:"添加分类",
        text:'1-4个字符即可',
        type:'number',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex == 2){
            var data={comp_id:sessionStorage.getItem("CompanyId"),user_id:sessionStorage.getItem("UserId")};
            if(num==0){
                var url="devicegroup/add";
                data['group_name']=ret.text;
                var ele=$("#dev-manage .content .aui-list");
            }
            else{
                var url="usergroup/add";
                data['dt_name']=ret.text;
                var ele=$("#user-manage .content .aui-list");
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
                            // var ele=$("#task2 .tab").eq(num/1+1).find(".aui-content ul");
                            getgroup(num,ele);
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
    var dialog = new auiDialog();
    dialog.prompt({
        title:"编辑分类",
        value:name,
        type:'number',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex == 2){
            var data={comp_id:sessionStorage.getItem("CompanyId"),user_id:sessionStorage.getItem("UserId"),dt_id:id,dt_name:ret.text};
            if(num==0){
                var url="devicegroup/edit";
                var ele=$("#dev-manage .aui-list");
            }
            else{
                var url="usergroup/edit";
                var ele=$("#user-manage .aui-list");
            }
            $.ajax({
                url:baseurl+url,
                type:"PATCH",
                data:data,
                dataType:"json",
                success:function(data){
                    if(data.code==0){
                        showToast("修改成功！");
                        getgroup(num,ele);
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
删除分组
设备：0；人员：1
*/
function deleteGroup(num,id){
    dialog.alert({
        title:"删除分组",
        msg:'确认删除该分组?',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex==2){
            if(num){
                var url="usergroup/delete?dt_id=";
                var ele=$("#user-manage .content .aui-list");
            }
            else{
                var url="devicegroup/delete?group_id=";
                var ele=$("#dev-manage .content .aui-list");
            }
            $.ajax({
                url:baseurl+url+id,
                type:"get",
                // data:{"group_id":id},
                dataType: "json",
                success: function(data, textStatus){
                    if(data.code==0){
                        showToast("删除分组成功！");
                        getgroup(num,ele);
                    }
                    else{
                        showToast(data.msg);
                    }
                },
                error:function(error){
                    showToast("删除分组失败！请重试")
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

/*
turn 添加用户界面
*/
function turnAddUser(){
    $("#add-user header .aui-title").html("添加人员");
    $("#add-user header .aui-pull-right").attr("onclick","addUser()");
    $("#add-user form")[0].reset();
    turnPage("#add-user","task2");
}

/*
添加用户
*/
function addUser(){
    var formData=$("#add-user form").parseForm();
    turnPage("#add-user","task2");
}

/*
turn 人员列表
*/
function userList(usergroupid,usergroupname){
    // turnPage("#user_list","task2");
    turnPage("#user_list","user-manage");
    var ele=$("#user_list .aui-content ul");
    $("#user_list header .aui-title").html(usergroupname).attr("data-id",usergroupid);
    getUserList(usergroupid,ele);
}

/*
*获取用户列表，根据groupId;
*groupid 组id
*ele 父元素
*/
function getUserList(groupId,ele){
    ele.html("");
    $.ajax({
        url:baseurl+"user/getlistbygroupid?comp_id="+sessionStorage.getItem("CompanyId")+"&group_id="+groupId,
        type:"get",
        dataType:"JSON",
        success:function(data){
            if(data.code==0){
                console.log(data.data);
                if(data.data.length>0){
                    var num=0;
                    for(var i=0;i<data.data.length;i++){
                        if(data.data[i].UserType==3){
                            ele.append('<li class="aui-list-item aui-list-item-middle">'+
                                            '<div class="aui-media-list-item-inner">'+
                                                '<div class="aui-list-item-inner ">'+
                                                    '<div class="aui-list-item-text">'+
                                                        '<div class="aui-list-item-title aui-font-size-14">'+(data.data[i].RealName?data.data[i].RealName:'未命名')+' &nbsp; &nbsp; &nbsp; <span style="color:#757575">'+ data.data[i].MobilePhone+'</span></div>'+
                                                        '<div class="aui-list-item-right" onclick="openUserActionSheet(\''+data.data[i].UserId+'\',\''+data.data[i].RealName+'\',\''+data.data[i].MobilePhone+'\',\''+(data.data[i].Position?data.data[i].Position:null)+'\')"><i class="fa fa-ellipsis-h"></i></div>'+
                                                    '</div>'+
                                                    // '<div class="aui-list-item-text">'+
                                                    //     data.data[i].MobilePhone+
                                                    // '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</li>');
                            num++;
                        }
                    }
                    if(num==0){
                        ele.html("<div class='noContent'>该分组下没有用户！</div>");
                    }
                }
                else{
                    ele.html("<div class='noContent'>该分组下没有用户！</div>");
                }
                
            }
            else{
                showToast(data.msg);
                ele.html(data.msg);
            }
        },
        error:function (error){
            showToast("获取用户列表失败！请重试");
        }
    })
}

/*
turn 设置用户分组；
id:用户id
*/
function turnsitUserGroup(id){
    turnPage("#sit-group","user_list");
    $("#sit-group header .aui-pull-right").attr("onclick","sitGroup(1,'"+id+"')");
    var ele=$("#sit-group .content-block .aui-list");
    getGroupRadio(1,ele);
}


/*
turn 用户编辑
id:用户id
*/
function turneditUser(id,name,phone,position){
    console.log(name+","+phone);
    $("#add-user header .aui-title").html("用户编辑");
    $("#add-user header .aui-pull-right").attr("onclick","editUser('"+id+"')");
    $("#add-user input[name=F_Account]").val((name!="null"?name:""));
    $("#add-user input[name=F_MobilePhone]").val((phone!="null"?phone:""));
    $("#add-user input[name=F_Position]").val((position!="null"?position:""));
    turnPage("#add-user","user_list");
}

/*
editUser 编辑用户信息；
id 用户id；
*/
function editUser(id){
    var userData={"F_Id":id,"F_RealName":$("#add-user input[name=F_Account]").val(),"F_MobilePhone":$("#add-user input[name=F_MobilePhone]").val(),"F_Position":$("#add-user input[name=F_Position]").val()};
    $.ajax({
        url:baseurl+'user/edit',
        type:"post",
        dataType:"JSON",
        data:userData,
        success:function(data){
            if(data.data==1){
                showToast("用户修改成功");
                var ele=$("#user_list .content .aui-list");
                getUserList($("#user_list header .aui-title").attr("data-id"),ele);
                pageBack();
            }
        }
    })

}

/*
deleteUser 删除用户
id 用户id
*/
function deleteUser(id){
    dialog.alert({
        title:"删除用户",
        msg:'确认删除该用户?',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex==2){
            $.ajax({
                url:baseurl+"user/delete?user_id="+id,
                type:"get",
                dataType:"json",
                success:function(data){
                    if(data.code==0){
                        showToast("用户删除成功！");
                        userList($("#user_list header .aui-title").attr("data-id"),$("#user_list header .aui-title").html());
                    }
                    else{
                        showToast(data.msg);
                    }
                },
                error:function(error){
                    showToast("用户删除失败！请重试");
                }
            })
        }
    })
    
}

/*
获取用户任务列表
num 任务类型 1：点检；2：维修；3：保养；0：默认；
ele 父元素；
*/
function getUserTask(num,ele){
    ele.html("");
    $.ajax({
        url:baseurl+"task/gettaskbyuser?user_id="+sessionStorage.getItem("UserId")+"&type="+num,
        type:"get",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.code==0){
                if(data.data.pgList.length>0){
                    if(num==1){
                        for(var i=0;i<data.data.pgList.length;i++){
                            ele.append('<div class="check">'+
                                            '<span class="title" data-id="'+data.data.pgList[i].DeviceId+'">'+
                                                data.data.pgList[i].DeviceName+
                                            '</span> <br> <br>'+
                                        '</div>');
                            ele.find(".check").last().append(makeRadio(data.data.pgList[i].TaskId,data.data.pgList[i].DeviceId));
                        }
                    }
                    else{
                        var taskNum=0;
                        for(var i=0;i<data.data.pgList.length;i++){
                            if(data.data.pgList[i].TaskState==0){
                                taskNum++;
                                ele.append('<li class="aui-list-item aui-list-item-middle" onclick="turnTaskDetail(\''+data.data.pgList[i].TaskId+'\','+num+',\''+data.data.pgList[i].DeviceName+'\',\''+data.data.pgList[i].UserName+'\')">'+
                                            '<div class="aui-media-list-item-inner">'+
                                                '<div class="aui-list-item-inner aui-list-item-arrow">'+
                                                    '<div class="aui-list-item-text">'+
                                                        '<div class="aui-list-item-title aui-font-size-14">'+data.data.pgList[i].DeviceName+'</div>'+
                                                        '<div class="aui-list-item-right sit-position">查看详情</div>'+
                                                    '</div>'+
                                                    '<div class="aui-list-item-text">'+
                                                        '负责人：'+((data.data.pgList[i].UserName==null)?sessionStorage.getItem("phone"):data.data.pgList[i].UserName)+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</li>');
                            }
                        }
                        if(taskNum==0){
                            ele.html("<div class='noContent'>没有任务</div>");
                        }
                    }
                    // else{
                    //     for(var i=0;i<data.data.pgList.length;i++){
                    //         ele.append('<li class="aui-list-item aui-list-item-middle">'+
                    //                         '<div class="aui-media-list-item-inner">'+
                    //                             '<div class="aui-list-item-inner aui-list-item-arrow">'+
                    //                                 '<div class="aui-list-item-text">'+
                    //                                     '<div class="aui-list-item-title aui-font-size-14">A01:YQBD-25液压起拔道机</div>'+
                    //                                     '<div class="aui-list-item-right sit-position">查看详情</div>'+
                    //                                 '</div>'+
                    //                                 '<div class="aui-list-item-text">'+
                    //                                     '负责人：王学东'+
                    //                                 '</div>'+
                    //                             '</div>'+
                    //                         '</div>'+
                    //                     '</li>');
                    //     }
                    // }
                    
                }
                else{
                    ele.html("<div class='noContent'>没有任务</div>");
                }
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("获取任务列表失败！");
        }
    })
}

/*
获取管理员任务列表
num 任务类型 点检:1 维修：2 保养：3 默认：0
ele 父元素
*/
function getTastListAdmin(num,ele){
    ele.html("");
    $.ajax({
        url:baseurl+"task/gettaskbycompany?comp_id="+sessionStorage.getItem("CompanyId")+"&type="+num+"&idx=1&size=500",
        type:"get",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.code==0){
                if(data.data.pgList.length>0){
                    if(num==1){

                    }
                    else{
                        var taskNum=0;
                        for(var i=0;i<data.data.pgList.length;i++){
                            // if(data.data.pgList[i].TaskType!=0){
                                // taskNum++;
                                // ele.append('<li class="aui-list-item aui-list-item-middle" onclick="">'+
                                //             '<div class="aui-media-list-item-inner">'+
                                //                 '<div class="aui-list-item-inner aui-list-item-arrow">'+
                                //                     '<div class="aui-list-item-text">'+
                                //                         '<div class="aui-list-item-title aui-font-size-14">'+data.data.pgList[i].DeviceName+(data.data.pgList[i].TaskState?'<span style="color: #03a9f4;">（已完成）</span>':'')+'</div>'+
                                //                         '<div class="aui-list-item-right sit-position">查看详情</div>'+
                                //                     '</div>'+
                                //                     '<div class="aui-list-item-text">'+
                                //                         '负责人：'+((data.data.pgList[i].UserName==null)?sessionStorage.getItem("phone"):data.data.pgList[i].UserName)+
                                //                     '</div>'+
                                //                 '</div>'+
                                //             '</div>'+
                                //         '</li>');
                                ele.append('<li class="aui-list-item">'+
                                                '<div class="aui-list-item-inner">'+
                                                    '<div class="aui-list-item-title">'+data.data.pgList[i].DeviceName+(data.data.pgList[i].TaskState?'<span style="color: #03a9f4;">（已完成）</span>':'')+'</div>'+
                                                    '<p>负责人：'+((data.data.pgList[i].UserName==null)?'未命名':data.data.pgList[i].UserName) + (data.data.pgList[i].Solution?('<br/>解决方案：'+ data.data.pgList[i].Solution):'')+'</p>'+
                                                    // '<div class="aui-row aui-row-padded">'+
                                                    //     '<div class="aui-col-xs-4">'+
                                                    //         '<img src="../../image/demo1.png"/>'+
                                                    //     '</div>'+
                                                    //     '<div class="aui-col-xs-4">'+
                                                    //         '<img src="../../image/demo2.png" />'+
                                                    //     '</div>'+
                                                    //     '<div class="aui-col-xs-4">'+
                                                    //         '<img src="../../image/demo3.png" />'+
                                                    //     '</div>'+
                                                    // '</div>'+
                                                '</div>'+
                                            '</li>')
                            // }
                        }
                        // if(taskNum==0){
                        //     ele.html("<div class='noContent'>没有任务</div>");
                        // }
                    }
                }
                else{
                    ele.html("<div class='noContent'>没有任务</div>");
                }
            }
        },
        error:function(error){
            showToast("获取失败！");
            ele.html("<div class='noContent'>没有任务</div>");
        }
    })

}

/*
turn 任务详情（管理员）
taskId 任务id
num 任务类型 维修：2 保养：3
*/
// function turnTaskDetailAdmin(taskId,num,DeviceName,){
//     $("#history-repair-detail header .aui-title").attr("data-value",data.data[0].TaskId).attr("data-type",num);
//     $("#history-repair-detail .content-block .white-back").eq(0).find("span").eq(0).html((data.data[0].DeviceName?data.data[0].DeviceName:devName)).attr("data-value",data.data[0].DeviceId);
//     $("#history-repair-detail .content-block .white-back").eq(0).find("span").eq(1).html("负责人："+(sessionStorage.getItem('RealName')=='null'?sessionStorage.getItem('phone'):sessionStorage.getItem('RealName')));  
//     $("#history-repair-detail .content-block .white-back").eq(1).html(data.data[0].Solution);
//     $("#history-repair-detail .content-block p").css("display","");
//     turnPage("#history-repair-detail","history-task");
// }

/*
turn 任务详情；
taskid 任务id
num 任务类型 维修：2 保养：3
name:设备名称；
user：负责人姓名；
*/
function turnTaskDetail(taskid,num,name,user){
    $("#repair-detail header a.aui-pull-right").attr("onclick","submitResult("+num+",\'"+taskid+"\')");
    $("#repair-detail .content .white-back").eq(0).find("span").eq(0).html(name);
    $("#repair-detail .content .white-back").eq(0).find("span").eq(1).html("负责人："+(user=='null'?sessionStorage.getItem("phone"):user));
    $("#repair-detail .content textarea").val("");
    $("repair-detail #fileUploadContent").html("");
    $("repair-detail #fileUploadContent").attr("data-img","");
    initFileUpload();
    turnPage("#repair-detail","task");
}

/*
生成 点检 radio
name radio name
name taskid; data deviceId
*/
function makeRadio(name,data){
    var a='<label class="aui-col-xs-4"><input class="aui-radio aui-radio-green" type="radio" name="'+name+'" data-id="'+data+'" value="0"> 正常运行</label>'+
            '<label class="aui-col-xs-4"><input class="aui-radio aui-radio-dark-green" type="radio" name="'+name+'" data-id="'+data+'" value="1"> 故障运行</label>'+
            '<label class="aui-col-xs-4"><input class="aui-radio aui-radio-gray" type="radio" name="'+name+'" data-id="'+data+'" value="2"> 正常停机</label>'+
            '<div class="clearfix"></div> <br> '+
            '<label class="aui-col-xs-4"><input class="aui-radio aui-radio-blue" type="radio" name="'+name+'" data-id="'+data+'" value="3"> 调试</label>  '+
            '<label class="aui-col-xs-4"><input class="aui-radio aui-radio-yellow" type="radio" name="'+name+'" data-id="'+data+'" value="4"> 维修保养</label> '+
            '<label class="aui-col-xs-4"><input class="aui-radio aui-radio-red" type="radio" name="'+name+'" data-id="'+data+'" value="5"> 故障停机</label>'+
            '<div class="clearfix"></div>';
    return a;
}

/*
turn 添加任务
num 任务类型 1：点检；2：维修；3：保养；0：默认；
*/
function turnAddTask(num){
    if(num==2||num==3){
        $("#add-task #sitRepeat").css("display","none");
        $("#add-task .content-block li").eq(0).attr("onclick","turnSelectDevice()")
    }
    else{
        $("#add-task #sitRepeat").css("display","");
        $("#add-task .content-block li").eq(0).attr("onclick","turnSelectDevice()")
    }
    turnPage("#add-task","task");
    $("#add-task header .aui-pull-right").attr("onclick","addTask("+num+")");

}

/*
turn 选择设备
num = 0 或空为单选
num = 1 为多选
*/
function turnSelectDevice(num){
    turnPage("#select-device","add-task");
    var ele=$("#select-device .content .aui-list");
    ele.html("");
    $.ajax({
        url:baseurl+"devicegroup/get_list_comp?comp_id="+sessionStorage.getItem("CompanyId"),
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data.length>0){
                    for(var i=0;i<data.data.length;i++){
                        ele.append('<div class="aui-collapse-item">'+
                                        '<li class="aui-list-item aui-collapse-header" tapmode>'+
                                            '<div class="aui-list-item-inner">'+
                                                '<div class="aui-list-item-text">'+
                                                    '<div class="aui-list-item-title aui-font-size-14">'+data.data[i].DeviceGroupName+'</div> &nbsp;&nbsp;'+
                                                    '<div class="aui-list-item-text">'+
                                                        data.data[i].DeviceCount+"台"+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="aui-list-item-right">'+
                                                    '<i class="aui-iconfont aui-icon-down aui-collapse-arrow"></i>'+
                                                '</div>'+
                                            '</div> '+
                                        '</li>'+
                                    '</div>');
                        $.ajax({
                            url:baseurl+"device/getlistbygroupid?comp_id="+sessionStorage.getItem("CompanyId")+"&group_id="+data.data[i].DeviceGroupId,
                            async:false,
                            dataType:"json",
                            success:function(data){
                                if(data.code==0){
                                    if(data.data.length>0){
                                        ele.find(".aui-collapse-item").last().append('<div class="aui-collapse-content"></div>');
                                        for(var i=0;i<data.data.length;i++){
                                            ele.find(".aui-collapse-content").last().append('<li class="aui-list-item">'+
                                                                                                '<div class="aui-list-item-inner">'+
                                                                                                    '<div class="aui-list-item-title">'+data.data[i].DeviceName+'</div>'+
                                                                                                    '<div class="aui-list-item-right">'+
                                                                                                        '<input class="aui-radio aui-radio-white" type="'+(num?'checkbox':'radio')+'" name="demo1" value="'+data.data[i].DeviceId+'" data-value="'+data.data[i].DeviceName+'">'+
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
                    var collapse = new auiCollapse({
                        autoHide:false //是否自动隐藏已经展开的容器
                    });
                }
                else{
                    showToast("未获取到设备")
                }
            }
            else{

            }
        },
        error:function(error){
            showToast("获取设备列表失败");
        }
    })

}

/*
选择设备
*/
function selectDevice(){
    var deviceId="";
    var data=$("#select-device .content input:checked");
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            deviceId+=data[i].value+",";
        }
        deviceId = deviceId.substring(0,deviceId.length-1);
    }
    if(deviceId.length>0){
        $("#add-task .content-block li").eq(0).find(".aui-list-item-right").html((data.length>1?("已选择"+data.length+"台设备"):data.attr("data-value"))).attr("data-value",deviceId);
        pageBack();
    }

}

/*
设置重复
*/
function sitRepeat(){
    if($("#sit-repeat input:checked").length){
        $("#add-task .content-block #sitRepeat div.aui-list-item-right").html($("#sit-repeat input:checked").attr("data-value")).attr("data-value",$("#sit-repeat input:checked").val());
        pageBack();
    }
}

/*
选择提醒时间
*/
function selectTime(){
    var btn=[];
    for(var i=1;i<61;i++){
        btn.push("提前"+i+"分钟");
    }
    actionsheet.init({
        frameBounces:true,//当前页面是否弹动，（主要针对安卓端）
        buttons:btn
    },function(ret){
        $("#sit-remind .content-block li").eq(1).find("input").val(ret.text).attr("data-value",ret.index);
    })
}

/*
设置重复
*/
function sitRemind(num){
    if(num==0){
        $("#add-task .content-block li").eq(3).find(".aui-list-item-right").html("从不").attr("data-value",0);
        pageBack();
        return;
    }
    else{
        $("#add-task .content-block li").eq(3).find(".aui-list-item-right").html($("#time_select_dummy").val()).attr("data-value",$("#time_select").val());
        pageBack();
    }
}

/*
turn 选择点检人
*/
function turnSelectPreson(){
    $("#sit-principal header .aui-title").html("选择点检人");
    $("#sit-principal header .aui-pull-right").attr("onclick","selectPreson()");
    var ele=$("#sit-principal .content .aui-list");
    initPrincipal(ele);
    turnPage("#sit-principal","add-task");
}

/*
设置负责人
*/
function selectPreson(){
    if($("#sit-principal .content input").val()){
        $("#add-task .content-block ul").eq(1).find("li .aui-list-item-right").html($("#sit-principal .content input:checked").attr("data-value")).attr("data-value",$("#sit-principal .content input:checked").val());
    }
    pageBack();
}

/*
分配任务 提交
*/
function addTask(num){
    var ele=$("#add-task .content-block")
    var data={"title":"",
            "type":num,
            "device_id":ele.find("li").eq(0).find(".aui-list-item-right").attr("data-value"),
            "comp_id":sessionStorage.getItem("CompanyId"),
            "user_id":ele.find("ul").eq(1).find("li .aui-list-item-right").attr("data-value"),
            "start_time":ele.find("input").eq(0).val(),
            "end_time":ele.find("input").eq(0).val(),
            "repeat":(ele.find("#sitRepeat .aui-list-item-right").attr("data-value")?ele.find("#sitRepeat .aui-list-item-right").attr("data-value"):0),
            "remind":ele.find("li").eq(3).find(".aui-list-item-right").attr("data-value"),
            "admin_id":sessionStorage.getItem("UserId")};
    $.ajax({
        url:baseurl+"task/submit",
        type:"post",
        data:data,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("任务添加成功！");
                if(num==1){
                    var ele=$("#task .tabs .tab").eq(0).find(".aui-content");
                  }
                  else if(num==2){
                    var ele=$("#task .tabs .tab").eq(1).find("ul");
                  }
                  else{
                    var ele=$("#task .tabs .tab").eq(2).find("ul");
                  }
                  getTastListAdmin(num,ele)
                  pageBack();
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("添加任务失败！请重试")
        }
    })
}

/*
提交任务检查结果
num 点检：1 维修：2 保养：3
taskid 任务id
*/
function submitResult(num,taskid){
    var data={"type":num};
    if(num==1){
        var ele=$("#task .tabs .tab").eq(0).find("input:checked");
        var success = true;
        for(var i=0;i<ele.length;i++){
            data["task_checks"]=[];
            data["tast_id"]=ele.eq(i).attr("name");
            data["task_checks"].push({"device_id":ele.eq(i).attr("data-id"),"state":ele.eq(i).val()});
            $.ajax({
                url:baseurl+"task/result",
                type:"post",
                async:false,
                data:data,
                dataType:"json",
                success:function(data){
                    if(data.code==0){
                        
                    }
                    else{
                        showToast(data.msg);
                        success = false;
                    }
                },
                error:function(error){
                    showToast("提交失败！请重试")
                    success = false;
                }
            })
            if(success == false){
                break;
            }
        }
        if(success){
            showToast("提交成功！");
            $("input[type=radio]").removeAttr("checked");
        }
    }
    else{
        data["tast_id"]=taskid;
        data["solution"]=$("#repair-detail .content textarea").val();
        data['annex']=$("#repair-detail #fileUploadContent").attr("data-img");
        $.ajax({
            url:baseurl+"task/result",
            type:"post",
            data:data,
            dataType:"json",
            success:function(data){
                if(data.code==0){
                    showToast("提交成功！");
                    if(num!=1){
                        pageBack();
                        var ele=$("#task .tabs .tab").eq(num-1).find("ul");
                        getUserTask(num,ele);
                    }
                    else{
                        $("input[type=radio]").removeAttr("checked");
                    }
                }
                else{
                    showToast(data.msg);
                }
            },
            error:function(error){
                showToast("提交失败！请重试")
            }
        })
    }
}

/*
turn 用户信息
*/
function turnUserInfo(){
    var ele=$("#my-info .content li");
    ele.eq(0).find("img")[0].src=sessionStorage.getItem("HeadIcon");
    ele.eq(1).find(".aui-list-item-right").html(sessionStorage.getItem("RealName")).parent().attr("onclick","alterUserInfo('"+sessionStorage.getItem("RealName")+"')");
    // ele.eq(2).find(".aui-list-item-right").html(sessionStorage.getItem("position")).parent().attr("onclick","alterUserInfo(1,'"+sessionStorage.getItem("position")+"')");
    turnPage("#my-info","mine");
}

/*
修改 RealName
text 原名称;
*/
function alterUserInfo(text){
    var dialog = new auiDialog();
    var dialog_title="修改用户名";
    dialog.prompt({
        title:dialog_title,
        value:text,
        type:'text',
        buttons:['取消','确定']
    },function(ret){
        if(ret.text!=""){
            if(ret.buttonIndex == 2){
                var data={"F_Id":sessionStorage.getItem("UserId"),"F_MobilePhone":sessionStorage.getItem("phone")};
                data["F_RealName"]=ret.text
                $.ajax({
                    url:baseurl+"user/edit",
                    data:data,
                    type:"post",
                    dataType:"json",
                    success:function(data){
                        if(data.code==0){
                            showToast("修改成功！");
                            var ele=$("#my-info .content li");
                            sessionStorage.setItem("RealName",ret.text);
                            ele.eq(1).find(".aui-list-item-right").html(sessionStorage.getItem("RealName"));
                            ele.eq(1).find(".aui-list-item-inner").attr("onclick","alterUserInfo('"+sessionStorage.getItem("RealName")+"')");
                        }
                        else{
                            showToast(data.msg);
                        }
                        $(".aui-mask").remove();
                    },
                    error:function(error){
                        showToast("信息修改失败！");
                        $(".aui-mask").remove();
                    }
                })
            }
            else{
                // $(".aui-mask").remove();
            }
        }
        else{
            showToast("请输入内容！");
        }
    })
}

/*
turn 我的账号
*/
function turnMyAccout(){
    $("#my-account .content li").eq(0).find(".aui-list-item-right").html(sessionStorage.getItem("phone"));
    turnPage("#my-account","set");
}

/*
turn 修改手机号
*/
function turnAlertPhone(){
    $("#alert-phone .changePhoneTitle a").html(sessionStorage.getItem("phone"));
    turnPage("#alert-phone","my-account");
}

/*
修改手机号 获取验证码
*/
function getverifyforchangephone(){
    if((/^1[34578]\d{9}$/.test($("#alert-phone input[name=phone]").val()))){
        $.ajax({
            url:baseurl+"user/phone_verify?number="+$("alert-phone input[name='phone']")+"&verify_type=change",
            type:"get",
            dataType:"json",
            success:function(data){
                showToast("验证码已发送！请查收");
                $("#alert-phone").find("input[name=verify]").val(data.data.PhoneVerify);
                time(this);
            },
            error:function(error){
                showToast("获取验证码失败！");
            }
        })
    }
    else{
        showToast("请输入正确的手机号！");
    }
    
}

/*
修改手机号
*/
function alertPhone(){
    $.ajax({
        url:baseurl+"user/change",
        type:"post",
        data:{"user_id":sessionStorage.getItem("UserId"),"new_num":$("#alert-phone input[name=phone]").val(),"pv":sessionStorage.getItem("UserId"),"new_num":$("#alert-phone input[name=verify]").val()},
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("手机号修改成功！");
                sessionStorage.setItem("phone",$("#alert-phone input[name=phone]").val());
                $("#my-account .content li").eq(0).find(".aui-list-item-right").html(sessionStorage.getItem("phone"));
                pageBack();
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("手机号修改失败！请重试");
        }
    })
}

/*
退出登录
*/
function quit(){
    sessionStorage.clear();
    lastPage=[];
    turnPage("#login");
}

/*
turn 任务记录
num 2：维修任务；3：保养任务；
*/
function turnHistoryTask(num){
    var ele=$("#history-task .content ul");
    ele.html("");
    if(num==2){
        $("#history-task header .aui-title").html("维修任务");
    }
    else{
        $("#history-task header .aui-title").html("保养任务");
    }
    $.ajax({
        url:baseurl+"task/gettaskbyuser?user_id="+sessionStorage.getItem("UserId")+"&type="+num,
        type:"get",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.code==0){
                if(data.data.pgList.length>0){
                    for(var i=0;i<data.data.pgList.length;i++){
                        // if(data.data.pgList[i].TaskState!=0){
                            ele.append('<li class="aui-list-item aui-list-item-middle" onclick="getTaskDetail(\''+data.data.pgList[i].TaskId+'\','+num+',\''+data.data.pgList[i].DeviceName+'\')">'+
                                        '<div class="aui-media-list-item-inner">'+
                                            '<div class="aui-list-item-inner aui-list-item-arrow">'+
                                                '<div class="aui-list-item-text">'+
                                                    '<div class="aui-list-item-title aui-font-size-14">'+data.data.pgList[i].DeviceName+(data.data.pgList[i].TaskState?'<span style="color: #03a9f4;">（已完成）</span>':'')+'</div>'+
                                                    '<div class="aui-list-item-right sit-position">查看详情</div>'+
                                                '</div>'+
                                                '<div class="aui-list-item-text">'+
                                                    '负责人：'+((data.data.pgList[i].UserName==null)?sessionStorage.getItem("phone"):data.data.pgList[i].UserName)+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>');
                        // }
                    }
                }
                else{
                    ele.html("<div class='noContent'>没有历史任务</div>");
                }
            }
            else{
                showToast(data.msg);
            }
            turnPage("#history-task","my-task");
        },
        error:function(error){
            showToast("获取任务列表失败！");
        }
    })
}

/*
获取历史任务详情
taskId 任务id 
num 任务类型（维修：0 保养：1 默认：0）
*/
function getTaskDetail(taskId,num,devName){
    $.ajax({
        url:baseurl+"task/getdetails?task_id="+taskId+"&type="+num,
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                console.log(data.data);
                $("#history-repair-detail header .aui-title").attr("data-value",data.data[0].TaskId).attr("data-type",num);
                $("#history-repair-detail .content-block .white-back").eq(0).find("span").eq(0).html((data.data[0].DeviceName?data.data[0].DeviceName:devName)).attr("data-value",data.data[0].DeviceId);
                $("#history-repair-detail .content-block .white-back").eq(0).find("span").eq(1).html("负责人："+(sessionStorage.getItem('RealName')=='null'?sessionStorage.getItem('phone'):sessionStorage.getItem('RealName')));  
                $("#history-repair-detail .content-block .white-back").eq(1).html(data.data[0].Solution);
                $("#history-repair-detail .content-block p").css("display","");
                $("#history-repair-detail .content-block .aui-row-padded").html("")
                if(data.data[0].annex!==undefined&&data.data[0].annex!=""){
                    $("#history-repair-detail .content-block .aui-row-padded").append('<div class="aui-col-xs-3">'+
                                                                                        '<img src="images/demo1.png"/>'+
                                                                                      '</div>')
                }
                turnPage("#history-repair-detail","history-task");
            }
            else{
                showToast(data.msg);
                turnPage("#history-repair-detail","history-task");
            }
        },
        error:function(error){
            showToast("获取任务详情失败！");
            turnPage("#history-repair-detail","history-task");
        }
    })
}

/*
编辑历史任务
*/
function editHistoryTask(){
    var text=$("#history-repair-detail .white-back").eq(1).text();
    $("#history-repair-detail .white-back").eq(1).html('<textarea placeholder="请描述你的维修过程..." style="height: 10rem;">'+$.trim(text)+'</textarea>');
    $("#history-repair-detail .content-block p").css("display","none");
    $("#history-repair-detail header .aui-pull-right").css("display","").attr("onclick","submitHistoryTask()");
}

/*
提交编辑的历史任务
*/
function submitHistoryTask(){
    var data={"type":($("#history-repair-detail header .aui-title").attr("data-type")/1),"task_id":$("#history-repair-detail header .aui-title").attr("data-value"),solution:$("#history-repair-detail textarea").val()};
    $.ajax({
        url:baseurl+"task/result",
        type:"post",
        data:data,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                showToast("修改成功！");
                $("#history-repair-detail .white-back").eq(1).html($("#history-repair-detail .white-back textarea").val());
                $("#history-repair-detail .content-block p").css("display","");
                $("#history-repair-detail header .aui-pull-right").css("display","none");
            }
            else{
                showToast(data.msg);
            }
        },
        error:function(error){
            showToast("修改失败！请重试");
        }
    })
}

/*
获取未读消息
*/
function getMsg(){
    var message=$.ajax({
        url:baseurl+"message/notread?user_id="+sessionStorage.getItem("UserId"),
        type:"get",
        async:false,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(!data.data.ReadFlag){
                    return true;
                }
                else{
                    return false;
                }
            }
        },
        error:function(error){
            return false
        }
    });
    if(message){
        $("footer .aui-bar-tab-label").eq(2).find(".aui-dot").css("display","");
        $("#mine header .aui-dot").css("display","");
    }
    else{
        $("footer .aui-bar-tab-label").eq(2).find(".aui-dot").css("display","none");
        $("#mine header .aui-dot").css("display","none");
    }
}

/*
判断是否有未读消息
*/
function msg(){
    $.ajax({
        url:baseurl+"message/notread?user_id="+sessionStorage.getItem("UserId"),
        type:"get",
        async:false,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(!data.data.ReadFlag){
                    return true;
                }
                else{
                    return false;
                }
            }
        },
        error:function(error){
            return false
        }
    })
}

setInterval(getMsg,5000);

/*
turn 消息界面
*/
function turnMessage(){
    var message=$.ajax({
        url:baseurl+"message/notread?user_id="+sessionStorage.getItem("UserId"),
        type:"get",
        async:false,
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(!data.data.ReadFlag){
                    return true;
                }
                else{
                    return false;
                }
            }
        },
        error:function(error){
            return false
        }
    });
    if(message){
        $("#message .content-block li .aui-dot").css("display","");
    }
    else{
        $("#message .content-block li .aui-dot").css("display","none");
    }
    turnPage("#message","mine");
}

/*
turnMessageDetail turn 消息详情
*/
function turnMessageDetail(){
    $("#message-detail .aui-chat").html("");
    $.ajax({
        url:baseurl+"message/getlist?user_id="+"5ecb7a47-eaef-44d5-ae29-5ddfacf4db34"+"&type=0",
        type:"get",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data.pgList.length>0){
                    for(var i=0;i<data.data.pgList.length;i++){
                        $("#message-detail .aui-chat").append('<div class="aui-chat-item aui-chat-left" data-msgId="'+data.data.pgList[i].MsgId+'">'+
                                                            '<div class="aui-chat-media">'+
                                                                '<img src="images/demo2.png" />'+
                                                            '</div>'+
                                                            '<div class="aui-chat-inner">'+
                                                                '<div class="aui-chat-name">'+data.data.pgList[i].UserName+' </div>'+
                                                                '<div class="aui-chat-content">'+
                                                                    '<div class="aui-chat-arrow"></div>'+
                                                                    data.data.pgList[i].Content+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>');
                        if(!data.data.pgList[i].ReadFlag){
                            $.ajax({
                                url:baseurl+"message/setread?msg_id="+data.data.pgList[i].MsgId,
                                type:"post",
                                dataType:"json",
                                success:function(data){
                                    if(data.code==0){

                                    }
                                },
                                error:function(error){

                                }
                            })
                        }
                    }
                    turnPage("#message-detail","message");

                }
                else{
                    $("#message-detail .aui-chat").html("无消息");
                    turnPage("#message-detail","message");
                }
            }
            else{
                showToast(data.msg);
                $("#message-detail .aui-chat").html("无消息");
                turnPage("#message-detail","message");
            }
        },
        error:function(error){
            showToast("消息获取失败！请重试");
            $("#message-detail .aui-chat").html("无消息");
            turnPage("#message-detail","message");
        }
    })
}

/*
turn 我的账号
*/
function turnMyAccount(){
    $("#my-account .content .aui-list-item-right").eq(0).html(sessionStorage.getItem("phone"));
    turnPage("#my-account","set");
}

/*
turn 上传头像
*/
function turnUploadPic(){
    $("#headIcon-upload #headIcon")[0].src=sessionStorage.getItem("HeadIcon");
    turnPage("#headIcon-upload","my-info");
}

$("#choosehead").change(function(){
    var form = $("form#headFile");
    var options  = {
        url:baseurl+'user/user_icon?user_id='+sessionStorage.getItem("UserId"),
        type:'post',
        async:false,
        success:function(data){
            if(data.code==0){
              $("#headIcon")[0].src=baseurl+data.data.IconUrl;
              sessionStorage.setItem("HeadIcon",baseurl+data.data.IconUrl);
            }
            else{
                showToast(data.msg)
            }
        },
        error:function(error){
            showToast("上传失败！请重试")
        }
    };
    form.ajaxSubmit(options);
})


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

function turnUserCheck(){
    turnPage("#user-check","mine");
    getUnCheckList()
}

/*
*获取未审核用户列表
*/
function getUnCheckList(){
    var ele=$("#user-check .content .aui-list");
    ele.html("");
    $.ajax({
        url:baseurl+"user/add_check?comp_id="+sessionStorage.getItem("CompanyId")+"&idx=1&size=100",
        type: "get",
        dataType: "json",
        success: function(data){
            if(data.code==0){
                if(data.data.lists.length>0){
                    for(var i=0;i<data.data.lists.length;i++){
                        var userType="";
                        switch(data.data.lists[i].UserType){
                            case 0:
                                userType="普通用户";
                                break;
                            case 1:
                                userType="企业管理员";
                                break;
                            case 2:
                                userType="设备管理员";
                                break;
                            default:
                                userType="职员"
                        }
                        ele.append('<li class="aui-list-item aui-list-item-arrow" onclick="openCheckUser(\''+data.data.lists[i].UserId+'\')">'+
                                        '<div class="aui-media-list-item-inner">'+
                                            '<div class="aui-list-item-inner">'+
                                                '<div class="aui-list-item-text">'+
                                                    '<div class="aui-list-item-title">'+"手机号："+data.data.lists[i].MobilePhone+'</div>'+
                                                    '<div class="aui-list-item-right"></div>'+
                                                '</div>'+
                                                '<div class="aui-list-item-text aui-ellipsis-2">'+
                                                    '类型：'+userType+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>');
                    }
                    
                }
                else{
                    ele.html("<div class='noContent'>没有未审核用户</div>");
                }
            }
            else{
                ele.html("<div class='noContent'>没有未审核用户</div>");
                showToast("获取未审核用户失败！");
            }
        },
        error:function(error){
            ele.html("<div class='noContent'>没有未审核用户</div>");
            showToast("获取未审核用户失败！");
        }
    })
}

/*
*用户通过审核
*id 用户id
*/
function checkUser(id){
    var data={"user_id":id,check_user_id:sessionStorage.getItem("UserId"),check_user__name:sessionStorage.getItem("RealName")}
    dialog.alert({
        title:"提示",
        msg:'确认通过审核？',
        buttons:['取消','确定']
    },function(ret){
        if(ret.buttonIndex==2){
            $.ajax({
                url:baseurl+"user/add_check",
                type: "post",
                data:data,
                dataType: "json",
                success: function(data){
                    showToast(data.msg);
                    getUnCheckList();
                }
            })
        }
    })
}

function initFileUpload(){
    $("#fileUploadContent").initUpload({
        "uploadUrl":baseurl+"task/upld_annex",//上传文件信息地址
        //"size":350,//文件大小限制，单位kb,默认不限制
        //"maxFileNumber":3,//文件个数限制，为整数
        //"filelSavePath":"",//文件上传地址，后台设置的根目录
        "beforeUpload":beforeUploadFun,//在上传前执行的函数
        "isHiddenUploadBt":true,//是否隐藏上传按钮
        "isHiddenCleanBt":true,//是否隐藏清除按钮  
        "onUpload":onUploadFun,//在上传后执行的函数
        autoCommit:true,//文件是否自动上传
        "fileType":['png','jpg','docx','doc']//文件类型限制，默认不限制，注意写的是文件后缀
    });
}

function beforeUploadFun(opt){
    opt.otherData =[{"name":"name","value":"zxm"}];
}

function onUploadFun(opt,data){
    console.log(data);
    var url=$("#repair-detail #fileUploadContent").attr("data-img");
    if(url==undefined||url==""){
        url=data.data.AnnexUrl;
    }
    else{
        url=url+','+data.data.AnnexUrl;
    }
    $("#repair-detail #fileUploadContent").attr("data-img",url)
    uploadTools.uploadError(opt);//显示上传错误
    uploadTools.uploadSuccess(opt);//显示上传成功
}