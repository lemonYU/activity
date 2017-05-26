//兼容域名
var fix = '';
var payFix = '';

if(window.location.hostname.indexOf('test') != -1 || window.location.hostname.indexOf('192.168.0.219')!=-1||window.location.hostname.indexOf('122.144.135.120') != -1|| window.location.hostname.indexOf('192.168.31.101')!=-1 ){
	
		fix = 'https://testinclude.idazui.com';
		payFix = 'https://testw.idazui.com';
}else{
		fix = 'https://include.idazui.cn';
		payFix = 'https://w.idazui.com';
}

var url= window.location.search,
    userId = '',
    userName = '',
    token = '',
    activityId ='';
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
$(function(){
	
//	var myScroll;
//	function loaded() {
//	    setTimeout(function () {
//	        $('#iscroll-wrap').height( $(window).height()- $('footer').height());
//	    	
//	    	myScroll = new IScroll( $("#iscroll-wrap")[0]);
//	    }, 200);
//	}
//	window.addEventListener('load', loaded, false);
    
	
// 注册事件
    $('.closeBtn').tap(function(){
		$(this).parents('.skip').hide();
	});
	
	$('.myEgg').tap(function(){
		
			$('.skMyPrize').show();
			goldEgg01();
		
	});
	
	$('.writeAddress').tap(function(){
		if($(this).hasClass('active')){
			$('.skLookAds').show();								

		}else{
			$('.skAddress').show();
			
		}
		
	});
	// 榜单
	$('.bdList span').tap(function(){
		toggleBg($(this),'bdContent');//切换
	});
	// 排行奖励
	$('.rankList span').tap(function(){
		toggleBg($(this),'rankCon');
	});
	// 活动说明
	$('.activityInfo').tap(function(){
		$('.skAcivityMsg').show();
	});
	//弹框--我的奖励
	var curPrize = 0;
	$('.togglePrize span').on('tap',function(){
		pageNow = 1;
		toggleBg($(this),'prizeTab');
		curPrize = $(this).index();
		togglePrize(curPrize);
	});
	//输入框不能为空
	$('.skAddress label').next().blur(function(){
		var iText = $(this).val().toString().replace(/(^\s*)|(\s*$)/g, "");
		if(iText==''){
			$(this).parent().find('small').css('visibility','visible');
		}else{
			$(this).parent().find('small').css('visibility','hidden');
		}
	});
	
	//手机号输入限制
	var uphone = true;
	var reg = /^[1][358][0-9]{9}$/;
	$('.uphone').blur(function(){
		
		uphone = reg.test($('.uphone').val());

		if(!uphone){
			$(this).parent().find('small').css('visibility','visible');
		}else{
			$(this).parent().find('small').css('visibility','hidden');
		}
	});
	//地址输入限制
	$('.skAddress .address').keyup(function(){
		if($(this).val().length>=65){
			$(this).val($(this).val().toString().slice(0,65))
			$('.limitTips').show().find('p').html('地址超出字数限制！');
		}
	});
	//保存邮寄地址（判断）
	$('.submit').tap(function(){
		uphone = reg.test($('.uphone').val());
		
		var inputCon = $('.skAddress form label').next().val().toString().replace(/(^\s*)|(\s*$)/g, "");
		if(inputCon == ''||uphone==false||$('.skAddress form label').next().val().indexOf('请输入')!=-1){
			$('.limitTips').show().find('p').html('输入内容为空或者不符合要求，请重新输入！');
			return false;
		}else{
			var userInfo = $('#uAddress').serialize();
//			userInfo = decodeURIComponent(userInfo,true);
			//在进行编码
//			userInfo = encodeURI(encodeURI(userInfo));
//			alert(userInfo);
			if(!$('.writeAddress').hasClass('active')){
				saveOrUpdateAddress(userInfo,addressId);
			}else{
				saveOrUpdateAddress(userInfo,addressId);
			}
		}
		
	});
	//修改收货地址
	$('.modify').tap(function(){
		$(this).parents('.skip').hide();
		$('.skAddress').show();
		
	});
	
	
	//地址
	limitDown($('.skAddress .address'),72,'地址');
	
	//手机号
	limitDown($('.skAddress .uphone'),12,'手机号');
	
	//姓名
	limitDown($('.skAddress .uname'),15,'姓名');
	
	function limitDown(ele,len,name){
		ele.keydown(function(){
			if(ele.val().length >= len){
				$(this).val($(this).val().toString().slice(0,len-1));
				$('.limitTips').show().find('p').html(name+'超出字数限制！');
			}
		});
		ele.keyup(function(){
			if(ele.val().length >= len){
				$(this).val($(this).val().toString().slice(0,len-1));
				$('.limitTips').show().find('p').html(name+'超出字数限制！');
			}
		})
		
	}
	
	
	//我的奖励分页
	var pageFlag = false;
	$('.showPage').delegate('input','tap',function(){
		if(!pageFlag){
			pageFlag = true;
		
			pageNow = parseInt($(this).attr('rel'));
			if(pageNow){
				togglePrize(curPrize);
			}
		}
		pageFlag = false;
	});
	
	
});
var realName = '',
	addrContent = '',
	mobile =''; 
var uname = '',
	uphone = '',
	address = '',
	addressId='';
function saveOrUpdateAddress(userInfo,addressId){
	var maps={};
	var userStrs = userInfo.split("&");
	for(var i=0; i<userStrs.length; i++){
	  	var vals = userStrs[i].split("=");
	  	if(vals[0]=="uname"){
	  		uname = vals[1];
	  	}else if(vals[0]=="uphone"){
	  		uphone = vals[1];
	  	}else if(vals[0]=="address"){
	  		address = vals[1];
	  	}
	}
	if(addressId==''){
		maps = {'address.realName':uname,'address.mobile':uphone,'address.addrContent':address,'address.activityId':activityId};
	}else{
		maps = {'address.realName':uname,'address.mobile':uphone,'address.addrContent':address,'address.activityId':activityId,'address.addressId':addressId};
	}
	
	$.ajax({
        type : 'get',
		url : fix+'/activity/saveOrUpdateAddress.action?&tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
		data : maps ,
        dataType : 'json', 
        success : function(json){
//      	console.log(json);
//			alert('保存修改 success!');
			
			$('.limitTips').show().find('p').html('保存成功！');
			$('.skAddress').hide();
			//邮寄地址
				if(json.map.status==1){
					addressId = json.map.info.addressId;
					
					$('.writeAddress').addClass('active');
					$('.writeAddress').css({
						'background':'url(img/addressBtn_01.png) no-repeat',
						'backgroundSize': '100% 100%'
					});
					
					    realName = json.map.info.realName;
					    addrContent = json.map.info.addrContent;
						mobile = json.map.info.mobile;
					
					upDateForm(realName,mobile,addrContent);
					
				}
			
        },
        error:function(){
        	//提示用户信息过期
        	$('.limitTips').show().find('p').html('您的信息已过期，请重新登录！');
        }
     });
} 
var pageNow = 1,
	totalPage ;
initData();
function initData(){
	$.ajax({
        type : 'get',
		url : fix+'/activity/newYearDayInitDate.action?&tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&activityId='+activityId,
        dataType : 'json', 
        async:false,
        success : function(json){
        	console.log(json);
//      	alert(json);
			// 初始化排名、金蛋数
			if(json.map.status == 1){
				
				if(json.map.addressInfo.status==1){
					addressId = json.map.addressInfo.addressInfo.addressId;
					
				}

				
				$('.todayNum').html(json.map.rankInfo.todayNum);
				$('.todayRank').html(json.map.rankInfo.todayRank);
				$('.totalNum').html(json.map.rankInfo.totalNum);
				$('.totalRank').html(json.map.rankInfo.totalRank);

				initList(json.map.todayAllRank,$('.todayListCon tbody'));//初始化今日榜单

				if(json.map.eggInfo.length!=0){
					$('.initEgg').show();
					var egginfo = json.map.eggInfo;
					for(var i=0;i<egginfo.length;i++){
						
						if(egginfo[i].longing){
							$('.rl_run').append($('<li class="fl h100 eggPrize logining">恭喜通过登录获得<span class="fw">'+egginfo[i].longing+'</span>个金蛋赶快查看排名变化吧!</li>'));
						}
						if(egginfo[i].gameing){
							$('.rl_run').append($('<li class="fl h100 eggPrize gameing">恭喜通过游戏获得<span class="fw">'+egginfo[i].gameing+'</span>个金蛋赶快查看排名变化吧!</li>'));
						}
						if(egginfo[i].coining){
							$('.rl_run').append($('<li class="fl h100 eggPrize coining">恭喜通过充值获得<span class="fw">'+egginfo[i].coining+'</span>个金蛋赶快查看排名变化吧!</li>'));
						}
						
					}
					
					
					
					$('.rl_run li').css({
						'padding':'0rem 0.3rem'
					});
					new Slide('rl_run_wrap','left',4);//初始化金蛋滚动
					
					
					
				}
				
				//邮寄地址
				if(json.map.addressInfo.status==1){
					var userMsg = json.map.addressInfo.addressInfo;
					$('.writeAddress').addClass('active');
					$('.writeAddress').css({
						'background':'url(img/addressBtn_01.png) no-repeat',
						'backgroundSize': '100% 100%'
					});

					upDateForm(userMsg.realName,userMsg.mobile,userMsg.addrContent);
					
				}else if(json.map.addressInfo.status==0){
					$('.writeAddress').css({
						'background':'url(img/addressBtn_02.png) no-repeat',
						'backgroundSize': '100% 100%'
					});
				}
			}
			
			//调用总榜单接口
			totalRank();
        },
        error:function(){
        	//提示用户信息过期
        	$('.limitTips').show().find('p').html('您的信息已过期，请重新登录！');
        }
     });
}
function goldEgg01(){
	$.ajax({
        type : 'get',
		url : fix+'/activity/myJindanLog.action?&tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='+pageNow+'&activityId='+activityId,
        dataType : 'json',
        success : function(json){
//      	console.log(json);
        	totalPage = json.map.jindanTotalPage;
			initMyEgg(json.map.jindanListInfo,$('.myEggTab tbody'));
			showBtn($('.showPage'));
        },
        error:function(){
        	//提示用户信息过期
        	$('.limitTips').show().find('p').html('您的信息已过期，请重新登录！');
        }
     });
}
function goldEgg02(){
	$.ajax({
        type : 'get',
		url : fix+'/activity/rankPrize.action?&tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='+pageNow+'&activityId='+activityId,
        dataType : 'json', 
        success : function(json){
        	console.log(json);
        	totalPage = json.map.rankPrizeTotalPage;
			
			initMyEgg(json.map.rankPrizeListInfo,$('.rankPrizeTab tbody'));
			showBtn($('.showPage'));
        },
        error:function(){
        	//提示用户信息过期
        	$('.limitTips').show().find('p').html('您的信息已过期，请重新登录！');
        }
     });
}
function initList(data ,ele){
	var userRank = '';
	for(var i=0;i<data.length;i++){
		userRank += '<tr><td>'
			+(i+1)+"</td><td>"
			+data[i][0]+'</td><td class="orange">'
			+data[i][2]+'</td></tr>';
	}
	ele.html(userRank);
	//样式修改前三名加粗标红
	for(var j=0;j<3;j++){
		ele.find('tr').eq(j).children('td').eq(2).removeClass('orange');
	}
	
}

function initMyEgg(data,ele){
	if(data.length!=0){
		var myEgg = '';
		for(var i=0;i<data.length;i++){
			myEgg +='<tr><td>'+data[i][0]+'</td><td>'+data[i][1]+'</td><td>'+data[i][2]+'</td></tr>';
		}
		ele.html(myEgg);
	}else{
		ele.html('<tr><td colspan="3">暂无数据</td></tr>');
	}
}

function upDateForm(name,phone,address){
	
	$('.skLookAds .name').html(name);
	$('.skLookAds .phone').html(phone);
	$('.skLookAds .location').html(address);
	
	$('.skAddress .uname').val(name);
	$('.skAddress .uphone').val(phone);
	$('.skAddress .address').val(address);
}

function togglePrize(curPrize){
	
	if(curPrize==0){
			goldEgg01();
		}else if(curPrize==1){
			goldEgg02();
	}
}
//显示分页按钮
function showBtn(ele){
	if(totalPage == 0){
		totalPage = 1;
	}
	var PageLeft = '<span class="dlb fl">第'+pageNow+'页</span>';
	var PageRight = '<span class="dlb fr">共'+totalPage+'页</span>';	
	var prevStr = '',
		nextStr = '';
	if(totalPage>1){
			//如果你显示的第一页
		if(pageNow == 1){
			prevStr = '<input type="button" class="dlb fl prev" disabled />';
			nextStr = '<input type="button" class="dlb fr next" rel="'+(pageNow+1)+'"/>';
		
		}if(pageNow >= totalPage){
			prevStr = '<input type="button" class="prev fl" rel="'+(pageNow-1)+'" />';
			nextStr = '<input type="button" class="dlb fr next" disabled/>';
			
			
		}else if(pageNow>1 && pageNow<totalPage){
			prevStr = '<input type="button" class="dlb fl prev" rel="'+(pageNow-1)+'" />';
			nextStr = '<input type="button" class="dlb fr next" rel="'+(pageNow+1)+'"/>';
			
		}
	}else{
			prevStr = '<input type="button" class="dlb fl prev" disabled />';
			nextStr = '<input type="button" class="dlb fr next" disabled/>';
	}
	ele.html(PageLeft+prevStr+PageRight+nextStr);
}


function toggleBg(ele1,className){
	var cur = ele1.index();
	ele1.addClass('active').siblings().removeClass('active');
	$('.'+className).eq(ele1.index()).show().siblings('.'+className).hide();
	
}
function totalRank(){
		$.ajax({
        type : 'get',
		url : fix+'/activity/totalRankInfo.action?&tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&activityId='+activityId,
        dataType : 'json',
        success : function(json){
//      	console.log(json);
			initList(json.map.totalAllRank,$('.allListCon tbody'));//初始化总榜单
        	
        	
        },
        error:function(){
        	//提示用户信息过期
        	$('.limitTips').show().find('p').html('您的信息已过期，请重新登录！');
        }
     });
	}