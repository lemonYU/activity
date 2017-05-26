//抽奖活动-----取数据模块---点击转盘按钮  面向对象抽奖方法
$(function(){
	// 点击事件
	    $('.skip_close').click(function(){
			$(this).parent().hide();
		});
//兼容域名
		var fix = '';
		var payFix = '';
		
		if(window.location.hostname.indexOf('test') != -1 || window.location.hostname.indexOf('192.168.0.206')!=-1||window.location.hostname.indexOf('122.144.135.120') != -1|| window.location.hostname.indexOf('192.168.31.101')!=-1 ){
			fix = 'http://testinclude.idazui.com';
			payFix = 'http://testw.idazui.com';
		}else if( window.location.hostname.indexOf('139.196.240.10:8000')!=-1){//预生产
			fix = 'http://139.196.240.10:8000';
		}else if(window.location.hostname.indexOf('jlxqp') != -1){//晋老西
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
			var URL="";
			if(url.indexOf("?") != -1){
				  URL = url.substr(1);  //去除"?"
			 }
			
		//初始化
		var initData,
			pageNow = 1 ,
			totalPage ;
			
		discData(URL,pageNow);
		
		function discData(url,pageNow){
//			alert(url)
			$.ajax({
		        url : url+'&curPage='+pageNow,
		        dataType : 'json',
		        type : 'get',
		        success : function(json){
		        	initData = json;
		        	
//		        	console.log(json)
		        	init(initData);
		        	//初始化签到按钮状态
		        	checkStatus(initData.map.task1.status,$('.coin .lq_btn'));
		        	checkStatus(initData.map.task2.status,$('.baox .lq_btn'));
		        	
		        },
		        complete : function(){
		        	

		        },
		        error : function(jqXHR, textStatus, errorThrown){
		        	$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	$("#lotteryBtn").click(function(){
		        		$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	});
		        }
			});
		
		}
		function prizeData2(pageNow){
			$.ajax({
		        url : "/activity/myPrizeLog.action?curPage="+pageNow+"&activityId="+activityId,
		        dataType : 'json',
		        type : 'get',
		        success : function(json){
//		        	alert(json)
		        	totalPage = json.map.allCount;
		        	
		        	var myPrizeStr = '<thead><tr><th>奖品</th><th>获得时间</th></tr></thead>';
			        	//初始化中奖纪录表格
			        	if(json.map.allCount!=0){
			    			
			    			for(var i=0 ;i<json.map.logList.length;i++){
			    				
			    				myPrizeStr+='<tr><td>'+json.map.logList[i][0]+'</td><td>'+json.map.logList[i][1]+'</td></tr>'
			    			}
			    			$('.record_skip .sk-tab').html(myPrizeStr);
			    		}else{
			    			$('.record_skip .sk_con').html('暂无记录');
			    			$('.record_skip .sk_con').css({
			    				'font-size': '16px',
							    'color': '#c2560e',
							    'paddingTop': '55px',
							    'textAlign': 'center'
			    			})	
			    		}
		        	//初始化签到按钮状态
		        	$('.record_skip').show().siblings('.tips_skip').hide();
		        },
		        complete : function(){
		        	
		        	showBtn( $('.record_skip .page') ,pageNow,totalPage);
		        },
		        error : function(jqXHR, textStatus, errorThrown){
		        	$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	$("#lotteryBtn").click(function(){
		        		$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	});
		        }
			});
		
		}
		// 滚动事件
		$('.disc_title li').css('width',2550);
		new Slide('disc_title_wrap','left',3);
		
		function init(initData){
			if(initData.map.status == 1){
		        		//初始化公告1
			        	var gao1 = '';
			        	for(var i=0; i<initData.map.task3.BigPrize.length;i++){
			        		gao1 +='<li>恭喜 <span class="uname">"'+initData.map.task3.BigPrize[i].username+'" </span> 获得<span class="ucoin  pl10">'+initData.map.task3.BigPrize[i].prizename+'</span></li>';
			        	}
			        	$('.disc_title').html(gao1);
//			        	$('.disc_title li').css('width',$('.disc_title li').offset().width+200);
			        	
			        	//初始化公告2
			        	
			        	var gao2 = '';
			        	for(var i=0; i<initData.map.task3.allPrize.length;i++){
			        		gao2 +='<li class="ffe"><span class="uname fbc tl">"'+initData.map.task3.allPrize[i].username
			        		+'" </span><span class="time">'+initData.map.task3.allPrize[i].prizetime.slice(11,-2)
			        		+' </span><span class="ucoin tl">抽到 <i class="fbc">'+initData.map.task3.allPrize[i].prizename+'</i></span></li>';
			        	}
			        	$('.disc_list').html(gao2+gao2);
			        	$('.disc_list tr').css('width','426px');
			        	
			        	//免费机会
			        	$('.free_chance').html( initData.map.task3.freeNum);
				        //宝箱
			        	$('.openNum').html(initData.map.task2.openNum);
			        	$('.freeNum').html(initData.map.task2.gainFreeNum);
			        	
//			        	window.external.CB_Windows_RefreshUserInfo(); //刷新平台左上角游戏币数量
			        	
			        	
			    		
			    		
			    		
		        	}
		}
		//判断状态-1为灰色按钮;1为正常按钮
		function checkStatus(status, element){
			if(status == -1){
        		//按钮灰色
        		element.css({
        			'background': 'url(img/disc/yilingqu.png) no-repeat 0% 0%'
        		});
        	}else{
        		element.css({
        			'background': 'url(img/disc/lingqu_54.png) no-repeat 0% 0%'
        		});
        	}
		}
		//今日签到
		var signData;
		function todaySign(){
			$.ajax({
		        url : fix+'/activity/luckyWheelSigned?activityId='+activityId+'&tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
		        dataType : 'json', 
		        type : 'get',
//		        async:false,
		        success : function(json){
		        	signData = json;
//		        	console.log('签到',json);
					if(signData.map.status==1){
		    			$('.lottery').css('display','block').find('.sk_con p').html('成功领取<i class="fw">'+signData.map.content+'游戏币</i>奖励，明天再来喔~').siblings('.tips_skip').hide();
		    			//签到成功，按钮只为灰色  ‘已签到’
						$('.coin .lq_btn').css({
					       	'background':'url(img/disc/yilingqu.png) no-repeat 0% 0%'
					    });
						window.external.CB_Windows_RefreshUserInfo(); //刷新平台左上角游戏币数量
						
		    		}else{
		    			//签到过一次或不符合
		    			$('.lottery').css('display','block').find('.sk_con p').html(signData.map.content).siblings('.tips_skip').hide();
		    			return ; 
		    		}
		        	
		        },
		        error : function(jqXHR, textStatus, errorThrown){
//		        	alert(jqXHR+'---'+textStatus+'---'+errorThrown);
		        	$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	$("#lotteryBtn").click(function(){
		        		$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	});
		        }
			});
		
		}

		//宝箱签到
		var boxSignData ;
		function boxSign(){
			$.ajax({
		        url : fix+'/activity/luckyWheelGetBox?activityId='+activityId+'&tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
		        dataType : 'json', 
		        type : 'get',
//		        async:false,
		        success : function(json){
//		        	alert(json);
		        	boxSignData = json;
		        
					if(boxSignData.map.status==1){

		    			$('.lottery').css('display','block').find('.sk_con p').html('成功领取<i class="fw">'+boxSignData.map.content+'游戏币</i>奖励，明天再来喔~').siblings('.tips_skip').hide();
		    			//签到成功，按钮只为灰色  ‘已签到’
				       $('.baox .lq_btn').css({
				         	'background':'url(img/disc/yilingqu.png) no-repeat 0% 0%'
				       });
				       window.external.CB_Windows_RefreshUserInfo(); //刷新平台左上角游戏币数量
				       //免费机会
			        	$('.free_chance').html(boxSignData.map.freeNum);
				        //宝箱
			        	$('.openNum').html(boxSignData.map.openNum);
			        	$('.freeNum').html(boxSignData.map.gainFreeNum);	
				       
				       
						
		    		}else{
		    			//签到过一次
		    			
		    			$('.lottery').css('display','block').find('.sk_con p').html(boxSignData.map.content).siblings('.tips_skip').hide();
		    			return ; 
		    		}
				        	
		        },
		        error : function(jqXHR, textStatus, errorThrown){
//		        	alert(jqXHR+'---'+textStatus+'---'+errorThrown);
		        	$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	$("#lotteryBtn").click(function(){
		        		$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	});
		        }
			});
		
		}
		
		//抽奖
		var getPrizeData ;
		function getPrize(){
			var b=true;
			$.ajax({
		        url : fix+'/activity/luckyWheelGetPrize?activityId='+activityId+'&tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
		        dataType : 'json', 
		        type : 'get',
		        async:false,
		        success : function(json){
		        	getPrizeData = json;
//		        	alert('抽奖',json);
		        	if($('.lottery').find('p').html()=='您的信息已过期，请重新登录！'){
		        		$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	}
		        },
		        error : function(jqXHR, textStatus, errorThrown){
//		        	alert(jqXHR+'---'+textStatus+'---'+errorThrown);
		        	b = false;
		        	$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	$("#lotteryBtn").click(function(){
		        		$('.lottery').show().find('p').html('您的信息已过期，请重新登录！');
		        	});
		        }
			});
		return b;
		}

		//抽奖
		var click_count = 0;
		var timer;
		var clicked = false;//未点击的标志位
		

        //签到领取金币
    	$('.coin .lq_btn').click(function(){
    		if(initData.map.task1.status!=-1){
    			todaySign();
    		}else{
    			$('.lottery').show().find('.sk_con p').html('每天只能领取一次,请您明天再来!').siblings('.tips_skip').hide();
    		}
    	});
    	
    	//签到领取宝箱
    	
    	$('.baox .lq_btn').click(function(){
    		if(initData.map.task2.status!=-1){
    			boxSign();
    		}else{
    			$('.lottery').show().find('.sk_con p').html('每天只能领取一次,请您明天再来!').siblings('.tips_skip').hide();
    		}
    	});
    	//我的中奖纪录
    	$('.cj_btn1').click(function(){
//  		location.reload(true);
			prizeData2(pageNow);
    		
    	});
    	
    	$('.cj_btn2').click(function(){
    		$('.activity_info').show().siblings('.tips_skip').hide();
    	});
    	
    	$('.page').delegate('input','click',function(){
    		if($(this).attr)
    		
    		pageNow = $(this).attr('rel');
	        
				if(pageNow){
		            pageNow = parseInt(pageNow);
		            prizeData2(pageNow);
		        }
    	});
    	
    	
    	
    	
    	//花点小钱
    	$('.purchase').click(function(){
    		var opid = url.slice(-1);
//  		alert(url);
    		if(opid==1){
//  			224
				 $('.ay-list li[id="224"]', parent.document).click();
			
    		}else if(opid==2){
//  			225
 				$('.ay-list li[id="225"]', parent.document).click();
    		}
    	});
    	
   //判断抽奖状态

	
   //抽奖动画
   var timeOut = function(){  //超时函数

		$("#lotteryRotate").rotate({

			angle:0, 

			duration: 20000, 

			animateTo: 2160, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，2160是因为我要让它转6圈，就是360*6得来的

			callback:function(){

				$('.lottery').css('display','block').find('.sk_con p').html('请求超时！');

			}

		}); 

	}; 
	var rotateFunc = function(awards,angle,text){  //awards:奖项，angle:奖项对应的角度

		$('#lotteryRotate').stopRotate();

		$("#lotteryRotate").rotate({

			angle:0, 

			duration: 2000, 

			animateTo: angle+1080, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^

			callback:function(){
				$('.lottery').css('display','block').find('.sk_con p').html('恭喜您获得<i class="fw e59">'+getPrizeData.map.content+'</i>奖励，继续加油~~').siblings('.tips_skip').hide();
				$('.lottery-star').css('backgroundPosition','-4px -5px');
				
				window.external.CB_Windows_RefreshUserInfo(); //刷新平台左上角游戏币数量
				clicked = false;
			}

		}); 

	};

	

	$("#lotteryBtn").rotate({ 

	   bind: { 
			click: function(){
				if(!clicked){
					clicked = true;
//					console.log(clicked);
					var bFlag = getPrize();	
					if(!bFlag){
						$('.lottery').show().find('p').html('您的信息已过期，请重新登录！').siblings('.tips_skip').hide();
						return ;
					}
					if(getPrizeData.map.status==1){
						
							$('.lottery-star').css('backgroundPosition','-120px -5px');
							//点击抽奖按钮，是为了抽奖
							var gifts = getPrizeData.map.awardList;
							//要转到的度数就应该是degrees[degrees_index]，度数通过索引值和gifts对应
							for(var i=0;i<gifts.length;i++){
								if(gifts[i]==getPrizeData.map.content){
									var gifts_index = i ;
									
								}
							}
						    var degrees = [0, 36, 72, 108, 144, 180, 216,252,288,324];
							var degrees_index = gifts_index;
							
						    rotateFunc(gifts_index,degrees[degrees_index],getPrizeData.map.content);
							//免费机会
				        	$('.free_chance').html(getPrizeData.map.freeNum);
							
							
					
					}else if(getPrizeData.map.status==-1){
						
						$('.huaqian').css('display','block').find('.sk_con p').html(signData.map.content).siblings('.tips_skip').hide();
						clicked = false;
						return;
					}
					
	
				}else{
//防止用户狂点抽奖按钮
					return false;
				}
	
			
	
			}
		
		 } 

	   

	});
	
	
	
	run('colee');//上下滚动
    	
});


//显示分页按钮
function showBtn(ele,pageNow,totalPage){
	var pageNavStr = '<span class="fl">第 '+pageNow+' 页 </span>';
	if(totalPage>1){
			//如果你显示的第一页
			if(pageNow == 1){
				pageNavStr += '<input type="button" class="prev fl" disabled value=""/><input type="button" class="next fl" rel="'+(pageNow+1)+'"  value=""/>';
			
			}if(pageNow >= totalPage){
				
				pageNavStr += '<input type="button" class="prev fl" rel="'+(pageNow-1)+'"  value=""/><input type="button" class="next fl" disabled  value=""/>';
				
			}else if(pageNow>1 && pageNow<totalPage){
				pageNavStr += '<input type="button" class="prev fl" rel="'+(pageNow-1)+'"  value=""/><input type="button" class="next fl" rel="'+(pageNow+1)+'"  value=""/>';
				
			}
	}else{
			pageNavStr += '<input type="button" class="prev fl" disabled  value=""/><input type="button" class="next fl" disabled  value=""/>';
	}
	pageNavStr+='<span  class="fl"> 总页数 '+totalPage+'</span>';
	ele.html(pageNavStr);
}
function run(id){
	//上下无缝滚动
	var mydiv=document.getElementById(id);
	var myul=mydiv.getElementsByTagName("ul")[0];
	var myli=myul.getElementsByTagName("li");
	var mya=document.getElementsByTagName("a");
	var speed=-2;
	myul.innerHTML += myul.innerHTML;
	var timer=null;
	
//	clearInterval(timer);
//	timer=setInterval(domove,100);
	
	function domove(){
		myul.style.top=myul.offsetTop+speed+"px";
		if(myul.offsetTop<=-myul.offsetHeight/2){
			myul.style.top="0px";
		}else if(myul.offsetTop>=0){
			myul.style.top=-myul.offsetHeight/2+"px";
		}
	}
	
	
	var timeout = false; //启动及关闭按钮 
	clearTimeout(timer);
	time();
	function time(){  
	  if(timeout) return;  
	  domove(); 
	 
	  timer = setTimeout(time,100); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
	} 
}


			
			
			
