//公用全局变量
var theme = '#D91715';

var toCode = function (str) {var foekkocoodokkrfjoidjovfoijgboiobgjowkwelkrlqewmkoviiDNFNSFSJNJKSDNFJNKNFDNJNFDfnjenfjenjgejngkejng = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";var l = foekkocoodokkrfjoidjovfoijgboiobgjowkwelkrlqewmkoviiDNFNSFSJNJKSDNFJNKNFDNJNFDfnjenfjenjgejngkejng.length;var a = foekkocoodokkrfjoidjovfoijgboiobgjowkwelkrlqewmkoviiDNFNSFSJNJKSDNFJNKNFDNJNFDfnjenfjenjgejngkejng.split("");var s = "",b, b1, b2, b3;for (var i = 0; i <str.length; i ++) {b = str.charCodeAt(i);b1 = b % l;b = (b - b1) / l;b2 = b % l;b = (b - b2) / l;b3 = b % l;s += a[b3] + a[b2] + a[b1];}return s;}
var indexOpen;
;!function (win) {
	"use strict";

	var Pro = function(){
		this.name = "请求对象";
	};

	/**
	 调用服务接口  service-服务名（springBean名）  method-调用的方法名   params-参数对象   , func 回调函数
	 */
	var indexLoad;

	Pro.prototype.callServer= function(service ,method , params ,func){
		console.log(params)
		$.ajax({
			url:"/serviceCtl" , // 请求路径
			type:"POST" , //请求方式
			timeout : 120000,
			contentType: "application/json; charset=utf-8",
			data:toCode(JSON.stringify({
				serviceName : service,
				methodName : method,
				params : params
			})),
			beforeSend : function(){ 
				layui.use(['layer'] , function(){
					var layer = layui.layer;
					var loadNum = getCookie("indexLoad");
					if(loadNum == null || loadNum == ''){
						indexLoad = layer.load(3);
						setCookie("indexLoad",indexLoad);
					}
				});
			},
			complete : function(){
				layui.use(['layer'] , function(){
					var layer = layui.layer;
					layer.close(indexLoad);
					delCookie("indexLoad");
				});
			},
			success:function (res) {

				// if(res.state == '-9'){
				// 	top.window.location='/login.html';
				// 	return;
				// }
				// var indexOpenCookie = getCookie("indexOpen");
				// if(res.state == '-10' && indexOpenCookie != '-10'){
				// 	setCookie("indexOpen",res.state);
				// 	initPass()
				// }
				// if(res.state == '-11'){
				// 	alert(res.msg);
				// 	top.window.location='/index.html';
				// 	return;
				// }
				func(res);
			},//响应成功后的回调函数
			error:function () {
				alert("服务器正忙，请重试！")
			},//表示如果请求响应出现错误，会执行的回调函数
			dataType:"json"//设置接受到的响应数据的格式
		});
		// axios({
		// 	    method: 'post',
		// 	    url: '/serviceCtl',
		// 	    data:{
		// 	    	serviceName : service,
		// 	    	methodName : method,
		// 	    	params : params
		// 	    }
		//     }
		// ).then(function(res){
		// 	// console.log(res);
		// 	// console.log(res.state);
		// 	if(res.data./**/state == '-9'){
		// 		top.window.location='/login.html';
		// 	}
		// 	func(res)
		// });
	}

	var layer ;

	Pro.prototype.callServerDataV= function(service ,method , params ,func){
		layui.use(['layer'] , function(){
			layer = layui.layer;
			$.ajax({
				url:"/serviceCtl" , // 请求路径
				type:"POST" , //请求方式
				timeout : 120000,
				async:false,
				contentType: "application/json; charset=utf-8",
				data:toCode(JSON.stringify({
					serviceName : service,
					methodName : method,
					params : params
				})),
				beforeSend : function(){
					var loadNum = getCookie("indexLoad");
					if(loadNum == null || loadNum == ''){
						indexLoad = layer.load(3);
						setCookie("indexLoad",indexLoad);
					}
				},
				complete : function(){
					layer.close(indexLoad);
					delCookie("indexLoad");
				},
				success:function (res) {
					layer.close(indexLoad);
					delCookie("indexLoad");
					if(res.state == '-9'){
						top.window.location='/login.html';
						return;
					}
					var indexOpenCookie = getCookie("indexOpen");
					if(res.state == '-10' && indexOpenCookie != '-10'){
						setCookie("indexOpen",res.state);
						initPass()
					}
					if(res.state == '-11'){
						alert(res.msg);
						top.window.location='/index.html';
						return;
					}
					func(res);
				},//响应成功后的回调函数
				error:function () {
					alert("服务器正忙，请重试！")
				},//表示如果请求响应出现错误，会执行的回调函数
				dataType:"json"//设置接受到的响应数据的格式
			});
		});
	}


	win.pro = new Pro();

	win.loadCss = function(url) {
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = url;
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(link);
	};
}(window);

var exportService = function(formname ,queryid ){
	var params = {};
	//获取所有条件
	var inputs = $(formname).find("input,select");
	//重新初始化table 添加查询条件
	params.queryId = queryid;
	inputs.each(function(index){
		if($(this).attr("name") == "")return;
		params[ $(this).attr("name")] = $(this).val();
	});

	var paramStr = parseParam(params);
	console.log(paramStr)
	// window.open("http://61.243.10.48:901/serviceCall?serivceName=queryService&methodName=exportById&"+paramStr);
	window.open("http://61.243.1.244:8011/serviceCall?serivceName=queryService&methodName=exportById&"+paramStr);
}

var exportServicePrams = function(params ){
	var paramStr = parseParam(params);
	// window.open("http://61.243.10.48:901/serviceCall?serivceName=queryService&methodName=exportById&"+paramStr);
	window.open("http://61.243.1.244:8011/serviceCall?serivceName=queryService&methodName=exportById&"+paramStr);
}

/**
 * 转换obj为url参数
 * @param param
 * @param key
 * @returns {string}
 */
var parseParam=function(param, key){
	var paramStr="";
	if(param instanceof String||param instanceof Number||param instanceof Boolean){
			paramStr+="&"+key+"="+encodeURIComponent(param);
	}else{
		$.each(param,function(i){
			var k=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);
			paramStr+='&'+parseParam(this, k);
		});
	}
	return paramStr.substr(1);
};

/**
 * 添加审核通过图片
 */
function addPassImg(){
	$('body').append("<img class='pass-stamp' src='/images/pass.png'></img>")
}

function rerender(){
	layui.use('table',function(){
		var table = table.form;
		table.render('test');
		console.log(123123);
	});
}
 function initPass(){
	 layui.use(['form', 'layedit', 'laydate'], function(){
		 var form = layui.form,layer = layui.layer
		 layer.open({
			 closeBtn: false,
			 area: ['600px', '430px'],
			 type: 2,
			 title: '修改密码（初始化密码必须修改）',
			 content: '/sys/html/user/editUserPass.html'	 //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
		 });
	 });
 }
//获取url传来的参数
function getUrlParam(variable)
{
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

//前端本地存储、缓存
function tempkset(key, value) {
	window.sessionStorage.setItem(key, value);
}
//读取本地缓存的数据，根据key获取
function tempkget(key) {
	return window.sessionStorage.getItem(key);
}

//获取缓存的cookie数据
function getCookie(objName){//获取指定名称的cookie的值
	var arrStr = document.cookie.split("; ");
	for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName) return unescape(temp[1]);
	}
}
//删除缓存的cookie数据
function delCookie(name)//删除cookie
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) {
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
}



//新增缓存信息，可设置过期时间：单位小时
function addCookie(objName,objValue,objHours){      //添加cookie
	var str = objName + "=" + escape(objValue);
	if(objHours > 0){
		var date = new Date();
		var ms = objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}

	document.cookie = str;
}



function setCookie(name,value){ //两个参数，一个是cookie的名子，一个是值
	var Days = 30; //此 cookie 将被保存 30 天
	var exp = new Date();    //new Date("December 31, 9998");
	exp.setTime(exp.getTime() + 30*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}


function initUplader(id,parameter,suc ){
	var uploader = WebUploader.create({

		// swf文件路径
		swf: '/lib/webuploader/Uploader.swf',

		// 文件接收服务端。
		server: '/upoadFile',
		formData:{ "pdfType": parameter},

		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: id,
		// 选完文件后，是否自动上传。
		auto: true,
		// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		resize: false,
		// 只允许选择图片文件。
		accept: {
			title: 'Images',
			extensions: 'pdf',
			mimeTypes: '*'
		},

	});
// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file ,res) {
		if(suc != null){
			suc(res)
		}
		this.reset();
	});
	uploader.on( 'error', function( msg ,file) {
		console.log("上传错误");
		alert(msg)
		if(msg == 'Q_TYPE_DENIED'){
			alert('只允许pdf文件');
			this.reset();
		}


	});
// 文件上传过程中创建进度条实时显示。
	uploader.on( 'uploadProgress', function( file, percentage ) {


	});
	return uploader;
}

function initImgUplader(id,parameter,suc ){
	var fileMaxSize = 1;

	var uploader = WebUploader.create({

		// swf文件路径
		swf: '/lib/webuploader/Uploader.swf',
		// 文件接收服务端。
		server: '/upoadImgFile',
		formData:{ "invoiceid": parameter},
		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: {
			id: id,
			multiple: false
		},
		//单个上传的文件大小
		fileSingleSizeLimit: fileMaxSize * 1024 * 1024,
		//不允许重复上传
		duplicate :false,
		// 选完文件后，是否自动上传。
		auto: true,
		// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		resize: false,
		// 只允许选择图片文件。
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,png',
			mimeTypes: '*'
		},
	});
// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file ,res) {
		if(suc != null){
			suc(res)
		}
		this.reset();
	});
	uploader.on( 'error', function(type) {
		console.log("上传错误");
		if(type == 'Q_TYPE_DENIED'){
			alert('只允许 gif,jpg,jpeg,png 文件');
		} else if (type == 'F_EXCEED_SIZE') {
			alert('文件大小超出限制,不能超过1M！');
		}
		
		this.reset();
	});
// 文件上传过程中创建进度条实时显示。
	uploader.on( 'uploadProgress', function( file, percentage ) {
	});

	//删除附件
	$(document).on('click','.cancelButton',function(file){
		var fileId = $(this).attr("name");
		uploader.removeFile(fileId,true);
		$(this).closest('.preview').remove()
	});
	return uploader;
}

//表单select属性值填充，需要再select标签上加code属性，code属性对应sys_code表的CODE_TYPE字段, value 参数不为空的时候判断选中
window.initSelect = function (value) {
	//查询所有带code的select
	var codeSelectArr = $('select[code]');
	console.log("code值："+codeSelectArr)
	console.log("value值："+value)
	var arrstr = "";
	codeSelectArr.each(function () {
		arrstr += $(this).attr('code') + ",";
	});
	if (arrstr != '') {
		arrstr = arrstr.substring(0, arrstr.length - 1);
		pro.callServerDataV("sysCodeService", "getAllCode", {code: arrstr}, function (res) {
			console.log(res)
			if (res.state == "1") {
				var data = res.data;
				codeSelectArr.each(function () {
					$(this).append('<option value="" selected>请选择</option>');
					for (var i in data) {
						if ($(this).attr('code') == i) {
							// $(this).append('<option value="">请选择</option>');
							for (var j in data[i]) {
								if(value == data[i][j].codeValue){
									$(this).append('<option value="' + data[i][j].codeValue + '" selected>' + data[i][j].codeName + '</option>');
								}else{
									$(this).append('<option value="' + data[i][j].codeValue + '">' + data[i][j].codeName + '</option>');
								}
							}
						}
					}
				});
				layui.use('form',function(){
					var form = layui.form;
					form.render();
				});
			} else {
				//初始化失败!
			}
		});
	}
}

//阻止冒泡
function stopPropagation(e) {
	e = e || window.event;
	if(e.stopPropagation) { //W3C阻止冒泡方法
		e.stopPropagation();
	} else {
		e.cancelBubble = true; //IE阻止冒泡方法
	}
}


//获取html请求的get值
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	var q = window.location.pathname.substr(1).match(reg_rewrite);
	if(r != null){
		return unescape(r[2]);
	}else if(q != null){
		return unescape(q[2]);
	}else{
		return null;
	}
}
//-------------------------------------------------------------------- 公用方法
/**
 * 根据input框的值来改变input的宽度
 * @param elenment 需要更改的id或者class
 * @param text 传入input框里面的文本
 */
//获取文本宽度
var textWidth = function(elenment,text){
	var sensor = $('<pre>'+ text +'</pre>').css({display: 'none'});
	$('body').append(sensor);
	var width = sensor.width();
	sensor.remove();
	$(elenment).width(width);
};


/**
 * 正浮点数
 **/

function isPosNumber(val){

	var regPos = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/; //正浮点数
	if(regPos.test(val))
		//&& regNeg.test(val)
	{
		return true;
	}else{
		return false;
	}

}

/**
 * 判断是否是空对象或者空字符
 * @param val
 * @returns {boolean}
 */
function isNull(val){
	if(val == undefined || val == "undefined" || val == '' || val == null){
		return true;
	}else{
		return false;
	}
}


/**
 * 校验正数就返回true
 **/

function isPosIntNum(val){
	var regPosInt = /^[1-9]\d*$/; // 非负整数
	var regNeg = /^\-[1-9][0-9]*$/; // 负整数
	if(regPosInt.test(val))
		//&& regNeg.test(val)
	{
		return true;
	}else{
		return false;
	}
}


function openFileWindos(obj,imgType) {
	var fileId= "";
	layer.open({
		title: '选择文件',
		type:2,
		content: ['/base/html/CAfile/baseKgmLt.html?imgType='+imgType+'&objId='+obj, 'no'],
		area: ['1000px', '500px'],
		//回调函数   layero为当前dome对象
		cancel: function(index, layero){
			if(confirm("确定关闭该窗口吗")){
				// debugger
				layer.close(index); //关闭弹窗
				fileId=sessionStorage.getItem('fileId');
				sessionStorage.removeItem('fileId');
				if (fileId != null){
					$('#' + obj).after("<div class='preview' style='background-image: url(\"/getThumbnail?fileId="+ fileId +"\")'   onclick='showPdf(this)' imgurl='"+ fileId +"' > " +
						// "<i class='layui-icon layui-icon-close-fill' onclick='delpdf(this)' ></i> </div>");
					    "<i class='layui-icon layui-icon-close-fill' onclick='delpdf(this)' name="+fileId+"></i> </div>");
				}
				if(obj === "yyzzuploader" && fileId != null){
					yyzzArr.push(fileId);
				}else if(obj === "cgzmuploader" && fileId != null){
					cgzmArr.push(fileId)
				}
				return fileId;
			}else{
				return fileId;
			}
		}
	});
}

// 关闭父窗口所有弹出窗
function closeAllLayer(){
	if(parent.layer != null || parent.layer != undefined){
		parent.layer.closeAll();
	}else{
		parent.layui.use('layer',function(){
			layui.layer.closeAll();
		});
	}
}

//检索金额是否正确，输入的金额必须不为空才能判断
function verificationAmount(value) {
	var reg =  /(^[0-9]([0-9]+)?(\.[0-9]+)$)|(^(0){1}$)|(^([0-9]+)?$)/;
	if (!reg.test(value) && value!=null && value!='') {
		return false;
	}
	return true;
}
//----------------------------------------------------------------公用方法
