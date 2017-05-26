//--充值返利活动--
function openBrowser(url){
		if(url.indexOf("http://")==-1){
			url=window.location.protocol+"//"+window.location.host+url;
		}		
		window.external.CB_Windows_OpenActivityURL(url);
}
 $(function(){
	   //兼容域名
		var fix = '';
		var payFix = '';
		
		if(window.location.hostname.indexOf('test') != -1 || window.location.hostname.indexOf('192.168.0.206')!=-1||window.location.hostname.indexOf('122.144.135.120') != -1|| window.location.hostname.indexOf('192.168.31.101')!=-1 ){
			fix = 'http://testinclude.idazui.com';
			payFix = 'http://testw.idazui.com';
		}else if(window.location.hostname.indexOf('jlxqp') != -1){
			fix = 'http://include.jlxqp.com';
			payFix = 'http://w.jlxqp.com';
		}else{
			fix = 'http://include.idazui.cn';
			payFix = 'http://w.idazui.com';
		}
		var url= window.location.search,
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
		
	   	var initFlData ,
		    taskId ,//任务id
			amount ,//抽奖次数   			
			lotData,	//抽次按钮获取数据	
			pageNow = 1 ,//当前是第几页
		    pageSize = 8 ,  //一页有几条记录
			totalPage  ,//一共有几页
			chargeData;
			//初始化页面数据
			var URL="";
			if(url.indexOf("?") != -1){
				  URL = url.substr(1);  //去除"?"
			 }
			
			chargeData(URL);
			function chargeData(URL){
				var chargeFlag = true;
					$.ajax({
				        type : 'get',
 						url : URL,
				        dataType : 'json', 
//				        async:false,
				        success : function(json){
//				        	console.log(json)
				        	chargeData = json;
							totalPage=json.map.totalPage;
							//活动时间
							$('.activityDate i').html(json.map.activityDate);
							//初始化公告
							var firLen;
							if(json.map.gonggaoList.length%4 == 0){
								 firLen = parseInt(json.map.gonggaoList.length)/4;
							}else{
								 var lenStr = (parseInt(json.map.gonggaoList.length)/4).toString();
								 firLen = lenStr.substring(0,lenStr.indexOf("."));
							}
							
							if(json.map.gonggaoList.length<15){
								
								var oneLine = '';
								for(var j=0;j<json.map.gonggaoList.length;j++){ 
										
										oneLine += '<li class="fl"><span class="uname"> '
											+json.map.gonggaoList[j][0]+' </span><span class="utime">于 '
											+json.map.gonggaoList[j][1]+' 充值'
											+json.map.gonggaoList[j][2]+'元</span><span class="ucoin">获得 '
											+json.map.gonggaoList[j][3] +' 游戏币</span></li>';
										
								}
								
								$('#run_item_wrap1 .run_item').html(oneLine);
							}else{
								
								$('.run_item').each(function(cur,ele){
					
									var gonggao = '';
									var len = 4 ;
									var add = json.map.gonggaoList.length%4;//余数
									var shang = (json.map.gonggaoList.length-add)/4;
									
									if(cur<len-1){
											for(var j=shang*cur;j<(cur+1)*shang;j++){ 
												
												gonggao += '<li class="fl"><span class="uname"> '
												+json.map.gonggaoList[j][0]+' </span><span class="utime">于 '
												+json.map.gonggaoList[j][1]+' 充值'
												+json.map.gonggaoList[j][2]+'元</span><span class="ucoin">获得 '
												+json.map.gonggaoList[j][3] +' 游戏币</span></li>';
												
											}
									}else if(cur==len-1){
						
											for(var j=shang*cur;j<(cur+1)*shang+add;j++){ 
												gonggao += '<li class="fl"><span class="uname"> '
												+json.map.gonggaoList[j][0]+' </span><span class="utime">于 '
												+json.map.gonggaoList[j][1]+' 充值'
												+json.map.gonggaoList[j][2]+'元</span><span class="ucoin">获得 '
												+json.map.gonggaoList[j][3] +' 游戏币</span></li>';
											}
						
									}
									ele.innerHTML+=gonggao;
								});
								
							}
							//公告内容
							
													

								
								
							//初始化红包
							for(var i=0;i<json.map.pageInfoList.length;i++){
									//返利百分率
									$('.ay_bonus li').eq(i).find('.fl_rate').html('<span> '+json.map.pageInfoList[i][1]+'</span>');
									
									//金币数
									var rate = json.map.pageInfoList[i][1].split('-')[0].replace(/[^0-9]/ig,""); 
									var init_coin = (json.map.pageInfoList[i][2]*rate/100)+json.map.pageInfoList[i][2];
									$('.ay_bonus li').eq(i).find('.coin_bg').html('');//清空
									for(var j=0;j<countLen(init_coin);j++){
//										
										$('.ay_bonus li').eq(i).find('.coin_bg').html(function(idx,oldhtml){
											return oldhtml+'<i class="cb_'+getNum(init_coin)[0][j]+'"></i>';
										});
									}
									$('.ay_bonus  .coin_bg i').each(function(i,ele){
										var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
										$(ele).css({
											
											'background':'url(img/charge_pc/red_num.png) no-repeat '+(-14)*clsNum+'px -2px'
										})
									});
									
									//抽次按钮的状态
									if(chargeData.map.pageInfoList[i][4]!=0){
//										alert(i)
										$('.hb_chouci').eq(i).css('background','url(img/charge_pc/bling_28.gif) no-repeat -3px 0px' );
									}
									//抽次
									$('.ay_bonus li').eq(i).find('.chouci_num').html('');//清空
									for(var j=0;j<countLen(json.map.pageInfoList[i][4]);j++){
										
										$('.ay_bonus li').eq(i).find('.chouci_num').html(function(idx,oldhtml){
											return oldhtml+'<span class="chouci_num'+getNum(json.map.pageInfoList[i][4])[0][j]+'"></span>';
										});
									}
									$('.ay_bonus .chouci_num span').each(function(i,ele){
										
										var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
										$(ele).css({
											'background': 'url(img/charge_pc/rbtn_num0.png) no-repeat '+(-14)*clsNum+'px 6px',
    										'background-size':'140px 20px'
										})
									});
									
			
									//充值面额
									$('.ay_bonus li').eq(i).find('.money').html('');//清空
									for(var j=0;j<countLen(json.map.pageInfoList[i][3]);j++){
										
										$('.ay_bonus li').eq(i).find('.money').html(function(idx,oldhtml){
											return oldhtml+'<i class="mc'+getNum(json.map.pageInfoList[i][3])[0][j]+'"></i>';
										});
									}
									$('.ay_bonus .money i').each(function(i,ele){
										var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
										$(ele).css({
											'background':'url(img/charge_pc/btn_num1.png) no-repeat '+clsNum*(-11.9)+'px 0px',
											'background-size': '110px 18px'
										})
									})
							}
									
				        
								new Slide('run_item_wrap1','left',5);
								new Slide('run_item_wrap2','left',2);
								new Slide('run_item_wrap3','left',4);
								new Slide('run_item_wrap4','left',3);
							
							
				        
				        },
				        error : function(){
				        	chargeFlag = false;
//				            alert('初始化页面数据加载失败...');
				        },
				        complete : function(){
				        	
				            //充值按钮
							$('.bonus_bt').click(function(){
								
								var taskNo= $(this).parent().attr('class').slice($(this).parent().attr('class').length-1,$(this).parent().attr('class').length);
								taskId = chargeData.map.pageInfoList[parseInt(taskNo)-1][0];
								$('.sk_wrap').css('display','block');
								$('.cz_skip').css('display','block').siblings().css('display','none');
							});
							
							
								
							//充值弹框
							$('.buy-method ').delegate('.method-item','click',function(){
								
								$(this).find('.pay').addClass('selected').parent().siblings().find('.pay').removeClass('selected');
								$(this).find('.choosePay').css('display','block').parent().siblings().children('.choosePay').css('display','none');
								
							});
							
							//抽次按钮
							$('.bonus_hb').delegate('.hb_chouci','click',function(){
									if(!$(this).Clicked){//true
											
											$(this).Clicked = true;
											var clsStr = $(this).parent().parent().attr('class');
											var taskNo= clsStr.slice(clsStr.length-1,clsStr.length);
											taskId = chargeData.map.pageInfoList[parseInt(taskNo)-1][0];
											var curIndex = $(this).parent().parent().index();
											
											$('.sk_wrap').css('display','block');
											$('.cj_skip').css('display','block').siblings().css('display','none');
											
											
											if(chargeData.map.pageInfoList[curIndex][4]==0){
												
												$('.cj_skip .sk_con p').html('您还没有抽奖次数，现在充值即可获得，更有高额返利等你来拿哦~');
												return;
												
											}else{
												var b = lotteryData(taskId);
												if(!b){
													$("#loading").html("<p style='line-height:25px;text-align:center;white-space:nowrap;'>信息已过期，请重新登录</p>");
													return ;
												}
												//点击之后抽次按钮减1
												if(lotData.map.result == 'error'){
													return ;
												}else{
													//有抽奖机会时
												    chargeData.map.pageInfoList[curIndex][4]=chargeData.map.pageInfoList[curIndex][4]-1;
												
													if(chargeData.map.pageInfoList[curIndex][4]>=1){
				//										alert(i)
														$(this).css('background','url(img/charge_pc/bling_28.gif) no-repeat -3px 0px' );
													}else{
														$(this).css('background','url(img/charge_pc/chouci_btn.png) no-repeat -3px 0px' );
													}
											
												
													$(this).find('.chouci_num').html('');//清空
														for(var j=0;j<countLen(chargeData.map.pageInfoList[curIndex][4]);j++){
															
															$(this).find('.chouci_num').html(function(idx,oldhtml){
																return oldhtml+'<span class="chouci_num'+getNum(chargeData.map.pageInfoList[curIndex][4])[0][j]+'"></span>';
															});
														}
														
														$(this).find('.chouci_num span').each(function(i,ele){
															
															var clsNum = $(ele).attr('class').slice($(ele).attr('class').length-1,$(ele).attr('class').length);
															$(ele).css({
																'background': 'url(img/charge_pc/rbtn_num0.png) no-repeat '+(-14)*clsNum+'px 6px',
					    										'background-size':'140px 20px'
															})
														});
														
													$(this).Clicked = false;	
												}
													
												
												
											}
											
											
										}else{
											return ;//false
										}
									
									
									$(".hb_chouci").unbind("click");
//									$(".ay_title_btn").unbind("click");
							})
						
						// 返利记录按钮 --分页
											
					    $('.record_skip .sk-btn').delegate('input','click',function(){
					         
					         pageNow = $(this).attr('rel');
					         if(pageNow){
					            pageNow = parseInt(pageNow);
					            
					            var flFlag = fanliData(pageNow);
					            if(!flFlag){
					            	$("#loading").html("<p style='line-height:25px;text-align:center;white-space:nowrap;'>信息已过期，请重新登录</p>");
					            	return ;
					            }
					         }
					    });	
							var taskId ;//任务id
							var amount ;//抽奖次数
							
							//确认支付按钮
							
							$('.queren').click(function(){
								$(this).parents('.cz_skip').css('display','none');
								
									amount = $('.buy-method .buy-cs').val();
									if(amount>10){
										$('.cj_skip').siblings().css('display','none')
										$('.cj_skip').css('display','block').find('.sk_con p').html('购买数量最大为10哦，请重新输入！')
										return ;
									}else{
										$('.sk_wrap').css('display','block');
										$('.tips_skip').css('display','block').find('.sk_con p').html('如您充值成功并获得返利抽奖机会，可至活动的页面查看哦~');
										
										$('.reload').click(function(){
											location.reload(true);
										})
										
										
										var wxUrlpc = payFix+'/pay/doPay?userName='+userName+'&tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&paymentType=6&amount='
													+amount+'&taskId='+taskId;
						
									var zfbUrlpc = payFix+'/pay/doalipayPC?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&paymentType=6&amount='
													+amount+'&taskId='+taskId;
						
										if($('.buy-method .selected').hasClass('weixin')){
//											$('.sk_wrap').show();
//											$(".cj_skip").show().find('.sk_con').html("<p style='padding-top: 55px;'>微信支付维护中，请使用支付宝支付~</P>");
											//微信支付
											openBrowser(wxUrlpc);
											
										}else if($('.buy-method .selected').hasClass('zhifubao')){
											
											openBrowser(zfbUrlpc);
											
										
											
											
										}
									}
									
								
							});
							
							//充值数量
							$('.jian').click(function(){
								checkAmount($('.buy-cs'),-1);
							})
							$('.jia').click(function(){
								checkAmount($('.buy-cs'),1);
							});
							
							//限制充值次数最大为10
							$('.buy-cs').on('keyup',function(){
									limitAmount($(this));
							    
							});
							
							$('.buy-cs').on('keydown',function(){
								limitAmount($(this));
							});
							
							//返利记录按钮
							$('.ay_title_btn').click(function(){
								var flFlag = fanliData(pageNow);
					            if(!flFlag){
					            	$("#loading").html("<p style='line-height:25px;text-align:center;white-space:nowrap;'>信息已过期，请重新登录</p>");
					            	return ;
					            }
								
								$('.sk_wrap').css('display','block');
								$('.record_skip').css('display','block').siblings().css('display','none');

							})
							
							
							
							//小弹框关闭按钮
							$('.skip_close').click(function() {
								$(this).parent().parent().hide();
								pageNow = 1;
							});
							
							
				        },
				        beforeSend : function(){
				            $('.charge_item').html('<span id="loading">努力加载中...</span>');
				        }
				    });
				    return chargeFlag;
				}
				
				
		
		//显示分页按钮
		function showBtn(ele){
			if(totalPage>1){
					//如果你显示的第一页
					if(pageNow == 1){
						pageNavStr = '<input type="button" class="prev" disabled /><input type="button" class="next" rel="'+(pageNow+1)+'"/>';
					
					}if(pageNow >= totalPage){
						
						pageNavStr = '<input type="button" class="prev" rel="'+(pageNow-1)+'" /><input type="button" class="next" disabled/>';
						
					}else if(pageNow>1 && pageNow<totalPage){
						pageNavStr = '<input type="button" class="prev" rel="'+(pageNow-1)+'" /><input type="button" class="next" rel="'+(pageNow+1)+'"/>';
						
					}
			}else{
					pageNavStr = '<input type="button" class="prev" disabled /><input type="button" class="next" disabled/>';
			}
			
			
			ele.html(pageNavStr);
		}
		
   		// 创建一个函数，通过Ajax从后台获取数据（传一个参数：当前页：pageNow）
		function fanliData(pageNow){
			var flFlag = true;
		    $.ajax({
		        type : 'get',
//		        url :fix+'/activity/rebateDrawLog.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='
//						+pageNow,
				url :fix+'/activity/rebateDrawLog.action?&curPage='
						+pageNow,
		        dataType : 'json', 
		        success : function(json){
					totalPage=json.map.totalPage;
					//返利记录表格--分页--每页显示八行
					var tbody='<tr><td>名称</td><td>获得游戏币</td><td>时间</td></tr>';
					
					//数据为空时，显示-暂无记录
					if(json.map.list.length==0){
						$('.record_skip .sk-tab  tbody').html('<span id="loading"> 暂无数据 </span>');

					}else{
						
						for(var i=0;i<json.map.list.length;i++){
							tbody +='<tr><td>'+json.map.list[i][0]+'</td><td>'+json.map.list[i][1]+'</td><td>'+json.map.list[i][2]+'</td></tr>';
						}
						
						$('.record_skip .sk-tab tbody').html(tbody);
//						$('.record_skip .sk-tab').css('height','200px');
					}
					
		        },
		        error : function(){
		        	flFlag = false;
		        	$("#loading").html("<p style='line-height:25px;text-align:center;white-space:nowrap;'>信息已过期，请重新登录</p>");
//		            alert('返利数据加载失败...');
		        },
		        complete : function(){
		        	  showBtn($('.record_skip .sk-btn'));//调用显示分页按钮
		        },
		        beforeSend : function(){
		            $('.record_skip .sk-tab tbody').html('<span id="loading"> 努力加载中...</span>')
		        }
		    });
		    return flFlag;
		}
			
				
		//抽次弹框
		function lotteryData(taskId){
			var b=true;
			$.ajax({
		        type : 'get',
//				url : fix+'/activity/rebateDraw.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&taskId='+taskId,
				url : fix+'/activity/rebateDraw.action?&taskId='+taskId,
		        dataType : 'json', 
		        async:false,
		        success : function(json_data){	        	
		        	lotData = json_data;
//					alert('抽奖数据',json_data);
					if(json_data.map.result=='error'){
						$('.cj_skip .sk_con p').html(json_data.map.desc);
					}else{
						$('.cj_skip .sk_con p').html(json_data.map.desc);
						window.external.CB_Windows_RefreshUserInfo(); //刷新平台左上角游戏币数量
					}
		        },
		        error : function(){	        	
		        		b= false;
		        },
		        complete : function(){

		        },
		        beforeSend : function(){
		            $('.cj_skip .sk_con p').html('<span id="loading"> 努力加载中...</span>')
		        }
		    });
		    return b;
		}
		
		
});


function limitAmount(ele){
	
	ele.val( ele.val().replace(/[^\d]|^0|\t|\n/g, '') );//如果输入非数字，则替换为''
    var v = parseInt(ele.val(), 10);
    if(v > 10){
        ele.val(10);
    }else if(ele.val().replace(/(^\s*)|(\s*$)/g, "").length==0){
    	ele.val(1);//输入空替换为1
    }
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

		