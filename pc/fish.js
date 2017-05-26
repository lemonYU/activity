//----捕鱼活动-------
$(function(){
//兼容域名
		var fix = '';
		var payFix = '';
		
		if(window.location.hostname.indexOf('test') != -1 || window.location.hostname.indexOf('192.168.0.206')!=-1||window.location.hostname.indexOf('122.144.135.120') != -1|| window.location.hostname.indexOf('192.168.31.101')!=-1 ){
			fix = 'http://testinclude.idazui.com';
			payFix = 'http://testw.idazui.com';
		}else if( window.location.hostname.indexOf('139.196.240.10:8000')!=-1){
			fix = 'http://139.196.240.10:8000';
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
		    token = '';
			if(url.indexOf("?") != -1){
				  params = url.substr(1);  //去除"?"
				  params = params.substr(params.indexOf("?")+1);
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
//			alert(userId)
			//初始化页面数据
			var URL="";
			if(url.indexOf("?") != -1){
				  URL = url.substr(1);  
			 }
			
			fishData(URL);
			var fishJson;
			function fishData(url){
					$.ajax({
				        type : 'get',
   						url :url,
				        dataType : 'json', 
				        success : function(json){
				        	fishJson = json;
				        	if(json.map.todayRank.length!=0){
				        		
					        	var todayStr = '<table class="w100 tod_tab f14" >' ;
					        	for(var i=0;i<json.map.todayRank.length;i++){
					        		
					        		todayStr += '<tr><td>'+(parseInt(json.map.todayRank[i].sort)+1)
									        	   +'</td><td>'+json.map.todayRank[i].nickName
									        	   +'</td><td>'+json.map.todayRank[i].userScore
									        	   +'</td><td>'+json.map.todayRank[i].userPrize
									            +'</td></tr>';
					        	}
					        	$('#tod_tab').html(todayStr+'</table>');
				        	}else{
				        		var tod_tab = document.getElementById('tod_tab');
				        		tod_tab.innerText = "暂无数据";
				        		$('#tod_tab').css({
				        			'fontSize': '16px',
				        			'lineHeight':'30px',
				        			'textAlign':'center',
									'color': '#c86629'
				        		});
				        	}
				        	//根据签到按钮的状态显示按钮
				        	if(json.map.signStatus==-1){
				        		//如果签到过则点击按钮无效
				        		$('.qd_btn').css('background','url(img/fish/signed.png) no-repeat -3px 0px').addClass('signed');
				        		
				        	}else{
				        		//未签到或不满足签到条件
				        		
						        $('.qd_btn').css('background','url(img/fish/qt_37.png) no-repeat -3px 0px');
				        		if(!$('.qd_btn').hasClass('signed')){
				        			//按钮为有效状态下
				        			$('.qd_btn').mouseenter(function(){
									    $(this).css({
											'background':'url(img/fish/qt_37.png) no-repeat -311px 0px'
										});
									}).mouseleave(function(){
										$(this).css('backgroundPosition','-3px 0px');
										
									});
				        		}
				        		
				        	}
				        	
							
				        	if(json.map.personInfo.userScore&&json.map.personInfo.userSort){
				        		
				        		$('.bd_rank').html('我的击杀得分 : <span class="score">'+json.map.personInfo.userScore+'</span>当前排名 : <span class="rank">'+json.map.personInfo.userSort+'</span>');
				        	}else{
				        		$('.bd_rank').html('我的击杀得分 :<span class="score"> 0 </span>当前排名 :<span class="rank"> 未入榜</span>');
				        	}
				        	
				        },
				        error : function(){
//				            alert('初始化页面数据加载失败...');
							$('.tips_wrap').css('display','block').find('.sk_con p').html('您的信息过期，请重新登录！');
				        },
				        complete : function(){
				        	$('.tab_wrap .bd_list').eq(0).css({'width':'323px','height':'auto'});
							$('.bd_con_btn span').click(function(){
								$(this).addClass('active').siblings().removeClass('active');
								$('.tab_wrap .bd_list').eq($(this).index()-1).css({'display':'block'}).siblings().css({'display':'none'});
							});
							
				        	$('.skip_close').click(function(){
				        		
								$(this).parent().parent().hide();
							})
				        },
				        beforeSend : function(){
				           // $('.admin-wrap').html('<span id="loading">努力加载中...</span>');
				        }
				    });
				}
			
			//昨日榜单
			$('.tommorow').click(function(){
				$.ajax({
				        type : 'get',
   						url : fix+'/activity/yesterDayRank?activityId=228&tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
				        dataType : 'json', 
				        success : function(json){
//							alert(json);
				        	if(json.map.yesterdayRank[0].status==-1){
							     $('#tom_tab').html('<p class="tc f16" style="line-height:25px;color:">暂无数据，请明日再来查看！</p>');
				        		
				        	}else{
				        		var yesterdayStr ='<table class="w100 tom_tab f14">';
				        		
					        	for(var i=0;i<json.map.yesterdayRank.length;i++){
					        		yesterdayStr += '<tr><td>'+(parseInt(json.map.yesterdayRank[i].sort)+1)
					        		     +'</td><td>'+json.map.yesterdayRank[i].nickName+'</td><td>'
					        		     +json.map.yesterdayRank[i].userScore+'</td><td>'+json.map.yesterdayRank[i].userPrize+'</td></tr>'
					        	}
					        	 $('#tom_tab').html(yesterdayStr+'</table>');
				        	}
							
				        },
				        error:function(){
//								        	alert('出错')
				        	$('.tips_wrap').css('display','block').find('.sk_con p').html('您的信息已过期，请重新登录!');
				        }
				 });
			});
			//点击签到按钮后 状态变化
			$('.qd_btn').click(function(){
				
				$.ajax({
				        type : 'get',
   						url : fix+'/activity/catchFishSigned?activityId=228&tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
				        dataType : 'json', 
				        success : function(json){
//				        	console.log(json);
				        	
							if(json.map.status==-1){//签到过则按钮无效
				        		
				        		$('.tips_wrap').css('display','block').find('.sk_con p').html(json.map.content+'！');
				        		
				            }else if(json.map.status==1){

			        		    $('.tips_wrap').css('display','block').find('.sk_con p').html('恭喜你签到成功,获得'+json.map.content+'游戏币,明天再来哦~');
					        	//签到后按钮变灰
					        	$('.qd_btn').css('background','url(img/fish/signed.png) no-repeat -3px 0px').addClass('signed');
				        		if($('.qd_btn').hasClass('signed')){
				        			//按钮为有效状态下
				        			$('.qd_btn').hover(function(){
									    $(this).css({
											'background':'url(img/fish/signed.png) no-repeat -3px 0px'
										});
									});
				        		}
									
				        	}

				        },
				        error:function(){
				        	$('.tips_wrap').css('display','block').find('.sk_con p').html('您的信息已过期，请重新登录!');
				        }
				        
					});
			});
			
			
			
});	
		
