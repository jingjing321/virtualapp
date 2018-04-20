var lastPage=[];

$(function() {
	var Accordion = function(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.link');
		// Evento
		links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el;
			$this = $(this),
			$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		};
	}	

	var accordion = new Accordion($('#accordion'), false);
});

var slideHeight = 51; // px
var defHeight = $('#wrap').height()+20;
$(function(){

if(defHeight >= slideHeight){
	$('#wrap').css('height' , slideHeight + 'px');
	$('#read-more').append('<a href="#">查看更多</a>');
	$('#read-more a').click(function(){
		var curHeight = $('#wrap').height()+20;
		if(curHeight == slideHeight){
			$('#wrap').animate({
			  height: defHeight
			}, "normal");
			$('#read-more a').html('收起');
			$('#gradient').fadeOut();
		}else{
			$('#wrap').animate({
			 height: slideHeight
			}, "normal");
			$('#read-more a').html('查看更多');
			$('#gradient').fadeIn();
		}
		return false;
	});		
}
});


$('#time_factory').mobiscroll().date({
    theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
    mode: "mixed",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
    display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
    lang: "zh"        // Specify language like: lang: 'pl' or omit setting to use default 
});

$('#time_storage').mobiscroll().date({
    theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
    mode: "mixed",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
    display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
    lang: "zh"        // Specify language like: lang: 'pl' or omit setting to use default 
});

$('#time_start').mobiscroll().time({
    theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
    mode: "mixed",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
    display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
    lang: "zh"        // Specify language like: lang: 'pl' or omit setting to use default 
});

$('#time_end').mobiscroll().time({
    theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
    mode: "mixed",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
    startTime:"08:00",
    display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
    lang: "zh"        // Specify language like: lang: 'pl' or omit setting to use default 
});

for(var i=1;i<61;i++){
    $("#time_select").append('<option value="'+i+'">提前'+i+'分钟</option>');
}
$('#time_select').mobiscroll().select({
    theme:"android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
    mode:"mixed",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
    display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
    lang: "zh"        // Specify language like: lang: 'pl' or omit setting to use default 
});

/*
页面跳转
page 页面id:#page
thiz btn或前一个页面的ID:page
*/
function turnPage(page,thiz){
  $(".page").css("display","none");
  lastPage.push("#"+($(thiz).parents(".page").attr("id")?$(thiz).parents(".page").attr("id"):thiz));
  $(page).css("display","");
  if($(page).hasClass("nofooter")){
    $("footer").css("display","none");
  }
  else{
    $("footer").css("display","");
  }
}
function pageBack(){
  $(".page").css("display","none");
  var page=lastPage.pop();
  $(page).css("display","");
  if($(page).hasClass("nofooter")){
    $("footer").css("display","none");
  }
  else{
    $("footer").css("display","");
  }
}

var tab = new auiTab({
        element:document.getElementById("footer")
    },function(ret){
        var page=["yunxing.png","rw.png","me.png"];
        var pageOn=["yunxin_on.png","rw_on.png","me_on.png"];
        var ele=["#index","#task","#mine"];
        var num=ret.index/1-1;
        $(".page").css("display","none");
        $(ele[num]).css("display","");
        $("footer").find("aui-active").removeClass("aui-active");
        for(var i=0;i<$("footer img").length;i++){
          $("footer img").eq(i)[0].src="images/"+page[i];
        }
        $("footer img").eq(num)[0].src="images/"+pageOn[num];
        if(ret.index==1){
          initIndex();
        }
        else if(ret.index==2){
          var ele=$("#task .tab").eq(0).find(".aui-content");
          getUserTask(1,ele);
        }
        else if(ret.index==3){
          initUser();
        }
        
    });
var tab2=new auiTab({
  element:document.getElementById("indexTab")
    },function(ret){
      $("#index .tabs").find(".tab").css("display","none");
      $("#index .tabs").find("#indexTab"+ret.index).css("display","");
      if(ret.index==1){
        getPieData()
      }
      else{
        generateBar();
      }
})

var tab3=new auiTab({
  element:document.getElementById("taskTab")
    },function(ret){
      $("#task .tabs").find(".tab").css("display","none");
      $("#task .tabs").find("#taskTab"+ret.index).css("display","");
      if(ret.index==1){
        var ele=$("#task .tabs .tab").eq(0).find(".aui-content");
      }
      else if(ret.index==2){
        var ele=$("#task .tabs .tab").eq(1).find("ul");
      }
      else{
        var ele=$("#task .tabs .tab").eq(2).find("ul");
      }
      getUserTask(ret.index,ele);
})

var tab_task2=new auiTab({
  element:document.getElementById("task2_tab")
    },function(ret){
      $("#task2 .tabs").find(".tab").css("display","none");
      $("#task2 .tabs").find(".tab").eq(ret.index/1-1).css("display","");
      if(ret.index==1){
        var ele=$("#task2 .tab").eq(0).find(".aui-content ul");
        getgroup(0,ele);
      }
      else if(ret.index==2){
        var ele=$("#task2 .tab").eq(1).find(".aui-content ul");
        getgroup(1,ele);
      }
      else{
        
      }
})

var tab_index_detail=new auiTab({
  element:document.getElementById("index-detail-tab")
    },function(ret){
      $("#index-detail .tabs").find(".tab").css("display","none");
      $("#index-detail .tabs").find(".tab").eq(ret.index/1-1).css("display","");
      if(ret.index==1){
        turnDeviceDetail($("#index-detail header .aui-title").attr("data-deviceId"));
      }
      else if(ret.index==2){
        getDeviceDetail($("#index-detail header .aui-title").attr("data-deviceId"));
      }
      else{
        deviceDetail($("#index-detail header .aui-title").attr("data-deviceId"));
      }
})

function imgChange(obj1, obj2) {
  //获取点击的文本框
  var file = document.getElementById("file");
  //存放图片的父级元素
  var imgContainer = document.getElementsByClassName(obj1)[0];
  //获取的图片文件
  var fileList = file.files;
  //文本框的父级元素
  var input = document.getElementsByClassName(obj2)[0];
  var imgArr = [];
  //遍历获取到得图片文件
  for (var i = 0; i < fileList.length; i++) {
      var form = $("form#headFile");
      var options  = {
          url:baseurl+'device/upld_annex',
          type:'post',
          async:false,
          success:function(data){
              if(data.code==1){
                showToast(data.msg);
              }
              else{
                var imgUrl = window.URL.createObjectURL(file.files[i]);
                imgArr.push(imgUrl);
                var img = document.createElement("img");
                img.setAttribute("src", imgArr[i]);
                var imgAdd = document.createElement("div");
                imgAdd.setAttribute("class", "z_addImg");
                imgAdd.appendChild(img);
                imgContainer.appendChild(imgAdd);
              }
          },
          error:function(error){
              showToast("上传失败！请重试")
          }
      };
      form.ajaxSubmit(options);
  }
  // imgRemove();
}

function imgRemove() {
  var imgList = document.getElementsByClassName("z_addImg");
  var mask = document.getElementsByClassName("z_mask")[0];
  var cancel = document.getElementsByClassName("z_cancel")[0];
  var sure = document.getElementsByClassName("z_sure")[0];
  for (var j = 0; j < imgList.length; j++) {
      imgList[j].index = j;
      imgList[j].onclick = function() {
          var t = this;
          mask.style.display = "block";
          cancel.onclick = function() {
              mask.style.display = "none";
          }
          sure.onclick = function() {
              mask.style.display = "none";
              t.style.display = "none";
          }
      }
  }
}