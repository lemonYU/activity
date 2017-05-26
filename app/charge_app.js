var loginFlag = true;
		 $(function(){
		 	
	
		 	getData();//初始化页面数据
			var myScroll;
		    function loaded() {
		        setTimeout(function () {
		            $('#iscroll-wrap').height( $(window).height()- $('footer').height());
		        	
		        	myScroll = new IScroll( $("#iscroll-wrap")[0]);
		        }, 100);
		    }
		    window.addEventListener('load', loaded, false);
		 });
		
		
	    
		var taskId ,//任务id
			amount ,//抽奖次数   			
		//初始化页面--数据接口
		 	Json,//存储--初始化请求的数据
		// 以键值对的方式读取URL字符串
			url= window.location.search,
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
		var chargeData;
		function getData(){
			$.ajax({
		        url : fix+'/activity/rebateInitPageInfo.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
		        dataType : 'json', 
		        async:false,
		        type : 'get',
		        success : function(json){
		        	console.log(json)
		        	chargeData = json;
		        		$('footer .activityDate').html(json.map.activityDate);
		        		//初始化公告
		        		if(json.map.gonggaoList.length<4){
		        			
		        			var oneLine = '';
								for(var j=0;j<json.map.gonggaoList.length;j++){ 
										
										oneLine += '<li class="fl lwhite"><span class="uname yellow"> '
												+json.map.gonggaoList[j][0]+' </span>于 '
												+json.map.gonggaoList[j][1]+' 充值'
												+json.map.gonggaoList[j][2]+'元<span class="ucoin yellow">获得 '
												+json.map.gonggaoList[j][3] +' 游戏币</span></li>';
										
								}
								
							$('#notice-wrap1 .notice-item').html(oneLine);
							new Slide('notice-wrap1','left',5);
		        		}else{
		        			
		        			//公告内容
								$('.header-notice .notice-item').each(function(cur,ele){
									var gonggao = '';
									var len = 2 ;
									var add = json.map.gonggaoList.length%len;//余数
									var shang = (json.map.gonggaoList.length-add)/len;//15
									
									if(cur<len-1){
										
											for(var j=cur*shang;j<(cur+1)*shang;j++){ 
												
												gonggao += '<li class="fl lwhite"><span class="uname yellow"> '
												+json.map.gonggaoList[j][0]+' </span>于 '
												+json.map.gonggaoList[j][1]+' 充值'
												+json.map.gonggaoList[j][2]+'元<span class="ucoin yellow">获得 '
												+json.map.gonggaoList[j][3] +' 游戏币</span></li>';
												
											}
									}else if(cur==len-1){
						
											for(var j=cur*shang;j<(cur+1)*shang+add;j++){ 
												gonggao += '<li class="fl lwhite"><span class="uname yellow"> '
												+json.map.gonggaoList[j][0]+' </span>于 '
												+json.map.gonggaoList[j][1]+' 充值'
												+json.map.gonggaoList[j][2]+'元<span class="ucoin yellow">获得 '
												+json.map.gonggaoList[j][3] +' 游戏币</span></li>';
											}
						
									}
									ele.innerHTML+=gonggao;
								});
								new Slide('notice-wrap1','left',5);
								new Slide('notice-wrap2','left',4);
		        			
		        		}
								
								
								
			 			
		        	
		        	
		        	
					Json = json;
//					console.log('初始化页面数据---',json);
					
					//初始化红包
					for(var i=0;i<json.map.pageInfoList.length;i++){
							//返利百分率
							$('.charge-row .charge-col').eq(i).children('.fl-rate').html(json.map.pageInfoList[i][1]);
							var rate = json.map.pageInfoList[i][1].split('-')[0].replace(/[^0-9]/ig,""); 
							//金币数
							var init_coin = (json.map.pageInfoList[i][2]*rate/100)+json.map.pageInfoList[i][2];
							for(var j=0;j<countLen(init_coin);j++){
								$('.charge-body .charge-col').eq(i).find('.bd_coin').html(function(idx,oldhtml){
									return oldhtml+'<i class="coin'+getNum(init_coin)[0][j]+'"></i>';
								});
							}
							$('.charge-col .bd_coin i').each(function(i,ele){
								var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
								$(ele).css({
									'background':'url(img/charge_app/red_num.png) no-repeat '+11.1*(clsNum)+'% -2%',
									'background-size':'1080% 100%'
								});
							});
							
							
							//抽次按钮数字动态展示
							for(var j=0;j<countLen(json.map.pageInfoList[i][4]);j++){
								$('.charge-body .charge-col').eq(i).find('.chouci-num .num').html(function(idx,oldhtml){
									return oldhtml+'<i class="chouci-num'+getNum(json.map.pageInfoList[i][4])[0][j]+'"></i>';
								});
							}
							$('.charge-col .num i').each(function(i,ele){
								var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
								$(ele).css({
									'background':'url(img/charge_app/rbtn_num.png) no-repeat '+11*(clsNum)+'% -2%',
									'background-size':'1047% 65%'
								})
							});
							
	
							//充值面额
							
							for(var j=0;j<countLen(json.map.pageInfoList[i][3]);j++){
								
								$('.charge-body .charge-col').eq(i).find('.cm_much').html(function(idx,oldhtml){
									
									return oldhtml+'<i class="cm_much'+getNum(json.map.pageInfoList[i][3])[0][j]+'"></i>';
								});
							}
							$('.charge-col .cm_much i').each(function(i,ele){
								var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
								$(ele).css({
									'background':'url(img/charge_app/btn_num.png) no-repeat '+11.1*(clsNum)+'% -2%',
									'background-size':'1000% 98%'
								})
							})
					}
					
		 		$('.notice-item li').css({
		 			'padding-left':'0.37rem'
		 		});
					
		        },
		        error : function(){
		            $('.charge_item').html('<span id="loading" class="nowrap tc f14">您的信息已过期，请重新登录！</span>');
		        },
		        complete : function(){
		            //showNav();//显示我的分页导航
		        },
		        beforeSend : function(){
		        	$('.charge_item').html('<span id="loading">努力加载中...</span>');
		        }
		    });
		}
		
		//点击弹出我的返利记录
		$('.header-btn img').tap(function() {
			    fanliData(pageNow);//请求返利数据
			
				$('.charge-skip').show();
			    $('.sk-fanli').show().siblings().hide();
			
			
			
		});
		
		
		// 添加点击事件
	    $('.charge-skip .page').delegate('input','tap',function(){
	        pageNow = $(this).attr('rel');
	        
			$(this).addClass('active')
			if(pageNow){
	            pageNow = parseInt(pageNow);
	            fanliData(pageNow);
	         }
         
	    });
		
		
		//返利记录--数据接口
		var pageNow = 1 ,//当前是第几页
		    pageSize = 8 ,  //一页有几条记录
			totalPage,//一共有几页
			flData ;
		
   		// 创建一个函数，通过Ajax从后台获取数据（传一个参数：当前页：pageNow）
		function fanliData(pageNow){
			var fl = true;
		    $.ajax({
		        type : 'get',
		        url : fix+'/activity/rebateDrawLog.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='
						+pageNow,
		        dataType : 'json',
		        success : function(json){
		        	flData = json;
					totalPage=json.map.totalPage;
					//返利记录表格--分页--每页显示八行
					var tbody='';
					//数据为空时，显示-暂无记录
					if(json.map.list.length==0){
						$('.sk-fanli .fl-tab tbody').html('<span id="loading" class="tc"> 暂无数据 </span>');

					}else{
						for(var i=0;i<json.map.list.length;i++){
							tbody +='<tr><td>'+json.map.list[i][0]+'</td><td>'+json.map.list[i][1]+'</td><td>'+json.map.list[i][2]+'</td></tr>';
							
						}
						$('.sk-fanli .fl-tab tbody').html(tbody);
					}
					
					
		        },
		        error : function(){
		        	fl = false;
		        	loginFlag = false;
		        	$('.sk-fanli .fl-tab').html('<span id="loading" class="nowrap tc f14"> 您的信息已过期，请重新登录！</span>');
		        },
		        complete : function(){
		        	if(flData){
		            	showBtn($('.charge-skip .page'));//调用显示分页按钮
		        		
		        	}

		        },
		        beforeSend : function(){
		             $('.sk-fanli .fl-tab tbody').html('<span id="loading"> 加载中...</span>');
		        }
		    });
		    return fl;
		}
		
		
		
		var lotData;
		
		//抽次按钮--数据接口
		function lotteryData(val){
			$.ajax({
		        type : 'get',
		        url : fix+'/activity/rebateDraw.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&taskId='+val,
		        dataType : 'json', 
		        async : false,
		        success : function(json_data){
		        	$('.sk-chou .sk-con').css({
		        		'color':'#c86629 '
		        	});
		        	
		        	lotData = json_data ;
//					console.log('抽奖数据',json_data);
					if(json_data.map.result=='error'){
						$('.sk-chou .sk-con').html(json_data.map.desc);
						
					}else{
						$('.sk-chou .sk-con').html(json_data.map.desc);
						
						
						
					}
		        },
		        error : function(){
		        	loginFlag = false;
		            $('.sk-chou .sk-con').html('<span id="loading" class="nowrap tc f14">您的信息已过期，请重新登录！</span>')
		        },
		        complete : function(){
		            //showNav();//显示我的分页导航
		        },
		        beforeSend : function(){
		            $('.sk-chou .sk-con').html('<span id="loading"> 加载中...</span>')
		        }
		    });
		}
		
		//--事件--
		
		
		
		//显示分页按钮
		function showBtn(ele){
			
			if(totalPage>1){
					//如果你显示的第一页
					if(pageNow == 1){
						pageNavStr = '<input type="button" class="prev fl" disabled /><input type="button" class="next fr" rel="'+(pageNow+1)+'"/>';
					
					}if(pageNow >= totalPage){
						
						pageNavStr = '<input type="button" class="prev fl" rel="'+(pageNow-1)+'" /><input type="button" class="next fr" disabled/>';
						
					}else if(pageNow>1 && pageNow<totalPage){
						pageNavStr = '<input type="button" class="prev fl" rel="'+(pageNow-1)+'" /><input type="button" class="next fr" rel="'+(pageNow+1)+'"/>';
						
					}
			}else{
					pageNavStr = '<input type="button" class="prev fl" disabled /><input type="button" class="next fr" disabled/>';
			}
			ele.html(pageNavStr);
		}
		
		//支付
		$('.sk-pay .buy-method dd').tap(function(){
			$(this).find('.pay').addClass('selected').parent().siblings().find('.pay').removeClass('selected');
			$(this).find('.pay').next('.hook').css('display','block').parent().siblings().children('.hook').css('display','none');
			
		});
		
		//确认支付按钮
		$('.confirm').tap(function(){
			amount = $('.amount-wrap .amount').val();
			if(parseInt(amount)>10){
				amount = 10;
			}
			 //支付链接
			var wxUrlapp = payFix+'/pay/weixinWapPay?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&paymentType=6&amount='
	   			+amount+'&taskId='+taskId+'&jsoncallback=?' ;
			var zfbUrlapp = payFix+'/pay/doaliwapios?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&paymentType=6&amount='
		   			+amount+'&taskId='+taskId+'&jsoncallback=?' ;
				if($('.buy-method .selected').parent().index()==0){
//					$(this).parents('.sk-pay').hide();
//					$('.charge-skip').show();
//					$('.sk-chou').show().find('.sk-con').html('微信支付维护中，请使用支付宝支付~');
					//微信支付
					wxPay(wxUrlapp);
					
				}else if($('.buy-method .selected').parent().index()==1){
					//支付宝支付                                                                                                                                                                                                        
					zfbPay(zfbUrlapp);
				}
			
		});
		
		//充值按钮
		$('.charge-btn').tap(function() {
			
			var taskNo= $(this).parent().attr('class').slice($(this).parent().attr('class').length-1,$(this).parent().attr('class').length);
				
			taskId = Json.map.pageInfoList[parseInt(taskNo)-1][0];
//			console.log(taskId);
			$(this).css({'backgroundPosition':'100% 0%'})
			$('.charge-skip').show();
			$('.sk-pay').show().siblings().hide();
		});
		
		$('.jian').tap(function(){
			checkAmount($('.amount'),-1);
		});
		$('.jia').tap(function(){
			checkAmount($('.amount'),1);
		});
		//限制充值次数最大为10
		$('.amount').on('keyup',function(){
			limitAmount($(this));
		});
		$('.amount').on('keydown',function(){
			limitAmount($(this));
		});
		function limitAmount(ele){
			ele.val( ele.val().replace(/[^\d]|^0|\t|\n/g, '') );//如果输入非数字，则替换为''
		    var v = parseInt(ele.val(), 10);
		    if(v > 10){
		        ele.val(10);
		    }if(ele.val().replace(/(^\s*)|(\s*$)/g, "").length==0){
		    	ele.val(1);//输入空替换为1
		    }
		}
		//抽奖按钮
		$('.chouci-num').tap(function() {
			
			var taskNo=$(this).parents('li').attr('class').slice($(this).parents('li').attr('class').length-1,$(this).parents('li').attr('class').length);
//				$(this).find('.num i')[0].style.backgroundPositionX = parseInt(bpx1)+11+'%';
				taskId = Json.map.pageInfoList[parseInt(taskNo)-1][0];
				var curIndex = taskNo-1;
				
				lotteryData(taskId);
//				alert(curIndex);
				$('.charge-skip').show();
				$('.sk-chou').show().siblings().hide();
				//点击之后抽次按钮减1
				if(lotData.map.result == 'error'){
					$('.sk-chou .sk-con').html(lotData.map.desc);
					return ;
				}else{
					
					//有抽奖机会时
				    chargeData.map.pageInfoList[curIndex][4]=chargeData.map.pageInfoList[curIndex][4]-1;
				
					$(this).find('.num').html('');//清空
					for(var j=0;j<countLen(chargeData.map.pageInfoList[curIndex][4]);j++){
						
						$(this).find('.num').html(function(idx,oldhtml){
							return oldhtml+'<i class="chouci-num'+getNum(chargeData.map.pageInfoList[curIndex][4])[0][j]+'"></i>';
						});
					}
					
					$(this).find('.num i').each(function(i,ele){
						
						var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
						$(ele).css({
							'background':'url(img/charge_app/rbtn_num.png) no-repeat '+11*(clsNum)+'% -2%',
							'background-size':'1047% 65%'
						})
					});
					
				  updateGameCoin();//安卓手机更新游戏币
				}
				
		});
		//关闭按钮
		$('.close').tap(function() {
			$(this).parent().parent().hide();
			pageNow = 1;
		});
		function updateGameCoin(){
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if(isAndroid){
				$('.confirm').css('marginLeft','34.5%');
				window.js_call_app_android.refreshUserInfo(); //安卓刷新游戏币--判断安卓
			}
		}
		
