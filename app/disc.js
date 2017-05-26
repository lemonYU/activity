//抽奖活动-----取数据模块---点击转盘按钮  面向对象抽奖方法
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

$(function(){
	 $('.sk_wrap').css('height',$(window).height());
	getData(pageNow);
	
	if(isiOS){
		var iscrollWrap = $('<div class="iscroll-wrap pr" id="iscroll-wrap">');
		var iscroll = $('<div class="iscroll pa" id="iscroll">');
		
		$('.disc_info').prependTo(iscroll);
		$('.disc_wrap').prependTo(iscroll);
		iscroll.appendTo(iscrollWrap);
		iscrollWrap.appendTo($('body'));
		$('.disc_mid').on('tap', function(e) {
		    return false;
		});
		$(".disc_mid").on("touchstart", function (event) {
	     //很多处理比如隐藏什么的
	     event.preventDefault();
	});
		 
		$('.iscroll-wrap').css({
		    'width': '100%',
		    'overflow': 'hidden'
		})
		$('.iscroll').css({
			'width': '100%',
			'overflow': 'hidden'
		})
		
//			 滑动事件
		var myScroll;
		    function loaded() {
		        setTimeout(function () {
		            $('#iscroll-wrap').height( $(window).height()- $('footer').height());
		        	
		        	myScroll = new IScroll( $("#iscroll-wrap")[0]);
		        }, 200);
		    }
		    window.addEventListener('load', loaded, false);
    
		
	    
	}
	

//  $('.sk_wrap').css('height',document.body.clientHeight);
    // 点击事件
    
    $('.close').on("click",function (event) {
    	
    	$(this).parent().css('display','none');
		$(this).parent().parent().css('display','none');
		event.preventDefault();
    });
    
	
});	
	//抽奖活动-----取数据模块---点击转盘按钮 	$('.record-run li').css('width',document.body.clientWidth );
	
	//初始化
    //兼容域名
	var fix = '';
	var payFix = '';

	if(window.location.hostname.indexOf('test') != -1 || window.location.hostname.indexOf('192.168.0.212')!=-1||window.location.hostname.indexOf('122.144.135.120') != -1|| window.location.hostname.indexOf('192.168.31.101')!=-1 ){
		fix = 'https://testinclude.idazui.com';
		payFix = 'https://testw.idazui.com';
	}else{
		fix = 'https://include.idazui.cn';
		payFix = 'https://w.idazui.com';
	}
        var url= window.location.search,
		    userId = '',
		    userName = '',
		    token = '';
		if(url.indexOf("?") != -1){
			  params = url.substr(1);  //去除"?"
			  var strs = params.split("&");
			  for(var i=0; i<strs.length; i++){
			  	var vals = strs[i].split("=");
			  	if(vals[0]=="userId"){
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
		//初始化
		var initData,
		    pageNow = 1 ,//当前是第几页
		    pageSize = 8 ,  //一页有几条记录
			totalPage ;//一共有几页
		
    	
		function getData(pageNow){
			
			$.ajax({
		        url : fix+'/activity/luckyWheelInitDate?activityId='+activityId+'&tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='+pageNow,
		        dataType : 'json', 
		        type : 'get',
		        async:false,
		        success : function(json){
		        	initData = json;
//		        	console.log(json);
		        	
		        	init(initData);
		        	//初始化签到按钮状态
		        	checkStatus(initData.map.task1.status,$('.disc_jb .lq_btn'));
		        	checkStatus(initData.map.task2.status,$('.disc_bx .lq_btn'));
		        	
		        	new Slide('rl_run_wrap','left',5);
		        },
		        complete : function(){
		        	// 滚动事件
    				
		        }
		        ,
		        error : function(){
		        	$('.sk_wrap').css('display','block');
		        	$('.logined').css('display','block').siblings('.sk').css('display','none');
		        }
			});
		
		}
		
		function prizeData2(pageNow){
			
			$.ajax({
		        url : fix+'/activity/myPrizeLog.action?activityId='+activityId+'&tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='+pageNow,
		        dataType : 'json', 
		        type : 'get',
		        async:false,
		        success : function(json){
		        	totalPage = json.map.allCount;
//		        	console.log(json);
		        	//初始化中奖纪录表格
		        	var myPrizeStr = '';
		        	if(json.map.allCount!=0){
		    			
		    			for(var i=0 ;i<json.map.logList.length;i++){
		    				
		    				myPrizeStr+='<tr><td>'+json.map.logList[i][0]+'</td><td>'+json.map.logList[i][1].toString().slice(5,-3)+'</td></tr>'
		    			}
		    			$('.record-tab tbody').html(myPrizeStr);
		    		}else{
		    			$('.sk-record .sk-con').html('暂无记录');
		    			$('.sk-record .sk-con').css({
		    				'font-size': '16px',
						    'color': '#c2560e',
						    'paddingTop': '55px',
						    'textAlign': 'center'
		    			})	
		    		}
		        	
		        	$('.sk_wrap').css('display','block');
    				$('.sk-record').css('display','block').siblings('.sk').css('display','none');
					
		        }
		        ,
		        complete : function(){
		        	showBtn($('.page'),pageNow,totalPage);
		        }
		        ,
		        error : function(){
		        	
		        	$('.sk_wrap').css('display','block');
		        	$('.logined').css('display','block').siblings('.sk').css('display','none');
		        }
			});
		
		}
		//初始化公告
		function init(initData){
			if(initData.map.status == 1){
	        		//初始化公告1
		        	var gao1 = '';
		        	for(var i=0; i<initData.map.task3.BigPrize.length;i++){
		        		gao1 +='<li class="fl">恭喜 <span class="uname e59">"'+initData.map.task3.BigPrize[i].username+'" </span> 获得<span class="ucoin e59">'+initData.map.task3.BigPrize[i].prizename+'</span></li>';
		        	}
		        	
		        	$('.rl_run').html(gao1);
		        	$('.rl_run li').css({
		        		'padding':'0px 20px'
		        	});
		        	//初始化公告2
		        	
		        	var gao2 = '';
		        	for(var i=0; i<initData.map.task3.allPrize.length;i++){
		        		gao2 +='<li><span class="uname tl e59">"'+initData.map.task3.allPrize[i].username
		        		+'" </span><span class="utime tc">'+initData.map.task3.allPrize[i].prizetime.substr(11,5)
		        		+' </span><span class="ucoin tl"> 抽到 <i class=" e59">'+initData.map.task3.allPrize[i].prizename+'</i></span></li>';
		        	}
		        	$('.bt_run').html(gao2+gao2);
		        	$('.bt_run li').css('width',screen.width);
		        	
		        	//免费机会
		        	$('.freeChance').html( initData.map.task3.freeNum);
			        //宝箱
		        	$('.openNum').html(initData.map.task2.openNum);
		        	$('.freeNum').html(initData.map.task2.gainFreeNum);	
		        
		    }
			
		}
		//判断状态-1为灰色按钮;1为正常按钮
		function checkStatus(status, element){
			if(status == -1){
        		//按钮灰色
        		element.css({
        			'background': 'url(img/disc_app/yiling.png) no-repeat 0% 0%',
					'backgroundSize': '100% 100%'
        		});
        	}else{
        		element.css({
        			'background': 'url(img/disc_app/lq_btn.png) no-repeat 0% 0%',
					'backgroundSize': '100% 100%'
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
		        async:false,
		        success : function(json){
		        	signData = json;
		        	
		        },
		        error : function(){
		        	$('.sk_wrap').css('display','block');
		        	$('.logined').css('display','block').siblings('.sk').css('display','none');
		        	
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
		         async:false,
		        success : function(json){
		        	boxSignData = json;
//		        	console.log('宝箱签到',json);
		        	
		        },
		        error : function(){
		        	$('.sk_wrap').css('display','block');
		        	$('.logined').css('display','block').siblings('.sk').css('display','none');
		        	
		        }
			});
		
		}
		
		//抽奖
		var getPrizeData ;
		//抽奖
		var click_count = 0,
		    timer       = null,
		    clicked     = false;//未点击的标志位
		function getPrize(){
			$.ajax({
		        url : fix+'/activity/luckyWheelGetPrize?activityId='+activityId+'&tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
		        dataType : 'json', 
		        type : 'get',
		        async:false,
		        success : function(json){
		        	getPrizeData = json;
					   //判断抽奖状态
						if(getPrizeData.map.status==1){
							//按钮灰色
							//上次抽奖已经完成
							
								click_count++;
								$('.disc_center').addClass('active');
								$('.disc_rotate').addClass('run');
								//点击抽奖按钮，是为了抽奖
								var gifts = getPrizeData.map.awardList;
								//度数通过索引值和gifts对应
								for(var i=0;i<gifts.length;i++){
									if(gifts[i]==getPrizeData.map.content){
										var gifts_index = i ;
									}
								}
								var degrees = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
								var degrees_index = gifts_index;
					
								//要转到的度数就应该是degrees[degrees_index]
								$('.disc_rotate').css({"-webkit-transform":"rotate("+(3*360*click_count+degrees[degrees_index])+"deg)"});
								$('.disc_rotate').css({"-moz-transform":"rotate("+(3*360*click_count+degrees[degrees_index])+"deg)"});
								$('.disc_rotate').css({"transform":"rotate("+(3*360*click_count+degrees[degrees_index])+"deg)"});
								
								clearTimeout(timer);
								timer = setTimeout(function(){
									$('.sk_wrap').css('display','block');
									$('.qd_success').css('display','block').find('.sk-con').html('恭喜您获得<i class="fw e59">'+getPrizeData.map.content+'</i>奖励，继续加油~~').siblings('.sk').css('display','none');
									
									$('.disc_center').removeClass('active');
									$('.disc_rotate').removeClass('run');
									$('.freeChance').html( getPrizeData.map.freeNum);
									updateGameCoin();
									
									clicked = false;
								}, 2000);

						}else if(getPrizeData.map.status==-1){
							clicked = false;
							//提示不能抽奖
							$('.sk_wrap').css('display','block');
							$('.limitTips').css('display','block').find('.sk-con p').html(getPrizeData.map.content).siblings('.sk').css('display','none');
							
						}
						
		        },
		        error : function(){
		        	clicked = false;
		        	$('.sk_wrap').css('display','block');
		        	$('.logined').css('display','block').siblings('.sk').css('display','none');
		        }
			});
			
		}
		
		
	if(isiOS){
		$('.disc_center').on("tap",function (event) {
			if(!clicked){
				clicked = true;
				getPrize();
			}
			
		});
		//我的中奖纪录
    	$('.disc_aside .zj').on("tap",function (event) {
    		pageNow=1;
    		prizeData2(pageNow);
    	});
    	$('.disc_aside .sm').on("tap",function (event) {
    	
			$('.sk_wrap').css('display','block');
			$('.choujiang').css('display','block').siblings('.sk').css('display','none');
		});

	}else if(isAndroid){
			$('.disc_center').on("click",function (event) {
				
				if(!clicked){
					clicked = true;
					getPrize();
				}
				
			});
			//我的中奖纪录
	    	$('.disc_aside .zj').on("click",function (event) {
	    		pageNow=1;
	    		prizeData2(pageNow);
	    	});
	    	$('.disc_aside .sm').on("click",function (event) {
	    	
				$('.sk_wrap').css('display','block');
				$('.choujiang').css('display','block').siblings('.sk').css('display','none');
			});

	}
		
		

        //签到领取金币
    	$('.disc_jb .lq_btn').on("tap",function (event) {
    		todaySign();
    		if(signData.map.status==1){
//  			成功领取888游戏币奖励，明天再来喔~
				$('.sk_wrap').css('display','block');
    			$('.qd_success').css('display','block').find('.sk-con').html('成功领取<i class="fw">'+signData.map.content+'游戏币</i>奖励，明天再来喔~').siblings('.sk').css('display','none');
    			//签到成功，按钮只为灰色  ‘已签到’
				$(this).css({
			       	'background':'url(img/disc_app/yiling.png) no-repeat 0% 0%',
			       	'backgroundSize':'100% 100%'
			    });
				updateGameCoin();//安卓手机更新游戏币
    		}else{
    			//签到过一次
    			$('.sk_wrap').css('display','block');
    			$('.qd_success').css('display','block').find('.sk-con').html(signData.map.content).siblings('.sk').css('display','none');
    			return ; 
    		}
    		
    		
    	});
    	
    	//签到领取宝箱
    	$('.disc_bx .lq_btn').on("tap",function (event) {
    		event.preventDefault();
    		boxSign();
    		
    		if(boxSignData.map.status==1){
    			$('.sk_wrap').css('display','block');
    			$('.qd_success').css('display','block').find('.sk-con').html('成功领取<i class="fw">'+boxSignData.map.content+'游戏币</i>奖励，明天再来喔~').siblings('.sk').css('display','none');
    			//签到成功，按钮只为灰色  ‘已签到’
		       $(this).css({
			       	'background':'url(img/disc_app/yiling.png) no-repeat 0% 0%',
			       	'backgroundSize':'100% 100%'
		       	});
//		       	//免费机会
		        $('.freeChance').html(boxSignData.map.freeNum);
		        //宝箱
	        	$('.openNum').html(boxSignData.map.openNum);
	        	$('.freeNum').html(boxSignData.map.gainFreeNum);		
				updateGameCoin();//安卓手机更新游戏币
				
    		}else{
    			//签到过一次
    			$('.sk_wrap').css('display','block');
    			$('.qd_success').css('display','block').find('.sk-con').html(boxSignData.map.content).siblings('.sk').css('display','none');
    			return ; 
    		}
    		
    	});
    	
    	
    	//记录翻页
    	$('.page').delegate('input','click',function(){
    		$(this).css({'background':'img/alert/page01.png'});
    		pageNow = $(this).attr('rel');
	        
				if(pageNow){
		            pageNow = parseInt(pageNow);
		            prizeData2(pageNow);
		        }
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
	pageNavStr+='<span  class="fl"> 总页数'+totalPage+'</span>';
	ele.html(pageNavStr);
	
}

function run(id){
	//上下无缝滚动
	var mydiv=document.getElementById(id);
	var myul=mydiv.getElementsByTagName("ul")[0];
	var myli=myul.getElementsByTagName("li");
	var mya=document.getElementsByTagName("a");
	var speed=-2;
	myul.innerHTML+=myul.innerHTML;
	var timer=null;
	
	clearInterval(timer);
	timer=setInterval(domove,100);
	
	function domove(){
		myul.style.top=myul.offsetTop+speed+"px";
		if(myul.offsetTop<=-myul.offsetHeight/2){
			myul.style.top="0px";
		}else if(myul.offsetTop>=0){
			myul.style.top=-myul.offsetHeight/2+"px";
		}
	}
}
run('colee');//上下滚动
function updateGameCoin(){
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isAndroid){
//		alert('刷新游戏币')
		$('.confirm').css('marginLeft','34.5%');
		window.js_call_app_android.refreshUserInfo(); //安卓刷新游戏币--判断安卓
	}
}
			
			
			
