//����΢��֧��
function wxPay(url){
	$.ajax({
	   type: "get",
	   dataType:'jsonp',
	   //url:"http://testinclude.idazui.com/activity/guesstop10",
	   url: url,
	   success: function(msg){
	   		if(msg.result=="ok"){
//	   			alert("����΢��֧��");
		   		var turnForm = document.createElement("form");   
		   	    //һ��Ҫ���뵽body�У���   
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


//����֧����֧��
function zfbPay(url){
	$.ajax({
		   type     : "get",
		   dataType :'jsonp',
		   url  : url,
		   success  : function(msg){
		   		console.log(msg);
		   		if(msg.result=="ok"){
//		   			alert("����֧����֧��");
			   		var turnForm = document.createElement("form");   
			   	    //һ��Ҫ���뵽body�У���   
			   	    document.body.appendChild(turnForm);
			   	    turnForm.method = 'post';
				   	turnForm.action = 'https://mapi.alipay.com/gateway.do?_input_charset=utf-8';
				   	for (var key in msg.map) { 
			             var newElement=createEment(key,msg.map[key]);
			             turnForm.appendChild(newElement);
			         }
				   	turnForm.submit();
		   		}else{
		   			window.history.back();//֧��ʧ�ܷ���
		   		}
			}
	});
}