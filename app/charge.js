//--充值返利活动手机/pc公用方法--

//兼容域名
var fix = '';
var payFix = '';


	if(window.location.hostname.indexOf('test') != -1 ||  window.location.hostname.indexOf('122.144.135.120') != -1||window.location.hostname.indexOf('192.168.0.212') != -1){
		//<!-- http改成https -->
		fix = 'https://testinclude.idazui.com';
		payFix = 'https://testw.idazui.com';
	}else if(window.location.hostname.indexOf('mobile.jlxqp.com') != -1 ){
		fix = 'https://include.jlxqp.com';
		payFix = 'https://w.jlxqp.com';
	}else {
		fix = 'https://include.idazui.cn';
		payFix = 'https://w.idazui.com';
	}



//返回数字的长度（位数）
 function countLen(num){
 	return num.toString().length;
 }
 
 //返回数字的每一位数字
 function getNum(obj){
 	var str = obj.toString();
 	var arr = [];
 	arr.push(str.split(''));
 	return arr;
 }


//check购买数量		
function checkAmount(ele,val){
	//数字不能小于1大于10
	if((ele.val()>1 && val==-1 ) || ( parseInt(ele.val())<10 && val== 1 )){
		ele.val(function(idx,oldVal){
			return parseInt(oldVal)+parseInt(val);
		});
	}else {
		return ;
	}
}


//调用微信支付
function wxPay(url){
	$.ajax({
	   type: "get",
	   dataType:'jsonp',
	   //url:"http://testinclude.idazui.com/activity/guesstop10",
	   url: url,
	   success: function(msg){
	   		if(msg.result=="ok"){
//	   			alert("调用微信支付");
		   		var turnForm = document.createElement("form");   
		   	    //一定要加入到body中！！   
		   	    document.body.appendChild(turnForm);
		   	    turnForm.method = 'post';
			   	for (var key in msg.map) {
			   		 if(key=="url"){
			   			turnForm.action = msg.map[key];
			   		 }else{
			   			var newElement=createEment(key,msg.map[key]);
			            turnForm.appendChild(newElement);
			   		 }
		        }
			   	turnForm.submit();
	   		}else{
	   			window.history.back();
	   		}
	   }
	});
}


//调用支付宝支付
function zfbPay(url){
	$.ajax({
		   type     : "get",
		   dataType :'jsonp',
		   url  : url,
		   success  : function(msg){
		   		console.log(msg);
		   		if(msg.result=="ok"){
//		   			alert("调用支付宝支付");
			   		var turnForm = document.createElement("form");   
			   	    //一定要加入到body中！！   
			   	    document.body.appendChild(turnForm);
			   	    turnForm.method = 'post';
				   	turnForm.action = 'https://mapi.alipay.com/gateway.do?_input_charset=utf-8';
				   	for (var key in msg.map) { 
			             var newElement=createEment(key,msg.map[key]);
			             turnForm.appendChild(newElement);
			         }
				   	turnForm.submit();
		   		}else{
		   			window.history.back();//支付失败返回
		   		}
			}
	});
}
			
function createEment(name,value){
	var newElement = document.createElement("input");
    newElement.setAttribute("name",name);
    newElement.setAttribute("type","hidden");
    newElement.setAttribute("value",value);
    return newElement;
}


		