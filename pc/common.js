//--活动入口--
 $(function(){
 	var reg = /^\d(&$)/gi;
 	

 	$('#loginError').click(function(){
		window.external.CB_Windows_CloseLobbyChildWnd("LOBBY_CHILDWND_ACTIVITY");
	});
 	   //兼容域名
		var fix = '';
		var payFix = '';
		
		if(window.location.hostname.indexOf('test') != -1 || window.location.hostname.indexOf('192.168.0.212')!=-1||window.location.hostname.indexOf('122.144.135.120') != -1|| window.location.hostname.indexOf('192.168.31.101')!=-1 ){
			fix = 'http://testinclude.idazui.com';
			payFix = 'http://testw.idazui.com';

		}else if( window.location.hostname.indexOf('139.196.240.10:8000')!=-1){
			fix = 'http://139.196.240.10:8000';
		}else if(window.location.hostname.indexOf('jlxqp') != -1){
			fix = 'http://include.jlxqp.com';
			payFix = 'http://w.jlxqp.com';
		}else{

			fix = 'http://include.idazui.cn';
			payFix = 'http://w.idazui.com';
		}
			
			
		var taskId ,//任务id
			amount ,//抽奖次数   			
		 	Json,//存储--初始化请求的数据
			url= window.location.search,
		    userId = '',
		    userName = '',
		    token = '',
		    activityId = '';
			if(url.indexOf("?") != -1){
				  params = url.substr(1);  //去除"?"
				  var strs = params.split("&");
				  for(var i=0; i<strs.length; i++){
				  	var vals = strs[i].split("=");
				  	if(vals[0]=="tokenId"){
				  		userId = vals[1];
				  	}else if(vals[0]=="token"){
				  		token = vals[1];
				  	}else if(vals[0]=="tokenUserName"){
				  		userName = vals[1];
				  	}else if(vals[0]=="activityId"){
				  		activityId = vals[1];
				  	} 
				  	
				  }
			 }
			

			
	   	var initFlag = init();
	   	if(!initFlag){
			$("#loading").html("<p style='line-height:25px;text-align:center;'>信息已过期，请重新登录</p>");
			return ;
		}
//	   	alert(id );
	   	var initDate ,
	   		URL ;
	 	function init(){
	 		var a = true;
	 		$.ajax({
			        type : 'get',
					url :  '/activity/pcActivityList.action',
			        dataType : 'json', 
			        success : function(json){
			        	
						if(json.map=='null'||json.map=='undefined'){
							$('.tips_login').show();
							return ; 
						}else{
							$('.tips_login').css('display','block');
								initDate = json;
					        	//动态生成ay-list
								var ayListStr = '';
								for(var i=0;i<json.map.activityList.length;i++){
									
									ayListStr+='<li id="'+json.map.activityList[i][0]
									+'" link="'+json.map.activityList[i][3]+'" style="background:url('+json.map.activityList[i][2]+')"></li>';
									
								}
								
								$('#ay-list').html(ayListStr);
								
								//如果有taskId则显示，否则默认第一个
								if(url.indexOf("taskId") != -1){
									var activityReg = /\d+/;
//									alert(activityReg.exec(url.toString()));
									var curActivityId = activityReg.exec(url.toString());					
									$('#ay-list').children('li[id='+curActivityId+']').addClass('active');
									$('.ay_tab iframe').attr('src',"activity"+curActivityId+".html?"
												+$('#ay-list').children('li[id='+curActivityId+']').attr('link')) ;
								}else{
									$('#ay-list').children('li').eq(0).addClass('active');
				$('.ay_tab iframe').attr('src',"activity"+$('#ay-list li').eq(0).attr('id')+".html?"+$('#ay-list li').eq(0).attr('link')) ;
								}
// 	alert(url)
// 	alert(url.indexOf("taskId"));
// 	alert(url.toString().substr(url.indexOf("taskId")+6,3))
								
								$('.ay-list').delegate('li','click',function(){
								
									var id = $(this).attr('id');
									var url = $(this).attr('link');
									$('.ay_tab iframe').attr('src',"activity"+id+".html?"+url) ;
									$(this).addClass('active').siblings().removeClass('active');
									$(this).css('background-position','-371px 0px').siblings().css('background-position','0px 0px');
								});
							
								
								//鼠标移入移出
								$('.ay-list li').mouseenter(function(){
									if(!$(this).hasClass('active')){
										
										$(this).css('background-position','-185px 0px');
									}
									
								}).mouseleave(function(){
									if($(this).hasClass('active')){
										$(this).css('background-position','-371px 0px');
									}else{
										$(this).css('background-position','0px 0px');
									}
								});
						}
					 },
					 error : function(){
					 	a = false;
					 	
					 	$('.login_skip').css('display','block').find('.sk_con p').html('您的信息已过期，请重新登录！')
				   },
				   complete : function(){
				   	$('#ay-list li.active').css({'backgroundPosition':'-371px 0px'});
				   },
				   beforeSend : function(){
//				   		$('.ay').html('<span id="loading">努力加载中...</span>');
				   }
			});
			return a;
	 	}
 		
		
		//关闭按钮
		$('.close_btn').click(function(){
			window.external.CB_Windows_CloseLobbyChildWnd("LOBBY_CHILDWND_ACTIVITY");
		});
		
		
});




