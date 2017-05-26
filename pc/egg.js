//兼容域名
var fix = '',
    payFix = '';

if(window.location.hostname.indexOf('test') != -1 || window.location.hostname.indexOf('192.168.0.206')!=-1||window.location.hostname.indexOf('122.144.135.120') != -1|| window.location.hostname.indexOf('192.168.31.101')!=-1 ){
	fix = 'http://testinclude.idazui.com';
	payFix = 'http://testw.idazui.com';
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
var URL="";
var pageNow = 1 ;//当前是第几页
	   
if(url.indexOf("?") != -1){
	  URL = url.substr(1);  //去除"?"
}

//加载页面
$(function(){
	
	//切换按钮背景
	$('.rankList span').bind('click',function(){
		toggleBg($(this),'rankInner');
	});
	
	$('.bdList span').bind('click',function(){
		toggleBg($(this),'listConWrap');
		
	});
	
	var curPrize=0;
	$('.togglePrize span').bind('click',function(){
		pageNow = 1;
		toggleBg($(this),'prizeTab');
		
		curPrize = $(this).index();
		togglePrize(curPrize);
		$('.showPage li').css('background','').eq(0).css({
			'background': '#fff'
		});
	})
	
	$('.closeBtn').click(function(){
		$(this).parents('.skip').hide();
	});
	//收货地址
	$('.writeAddress').click(function(){
		if(!$(this).hasClass('active')){
			$('.skAddress').show();
		}else{
			
			
			$('.skLookAds').find('.uname').html($('.skAddress').find('.uname').val());
			$('.skLookAds').find('.uphone').html($('.skAddress').find('.uphone').val());
			$('.skLookAds').find('.address').html($('.skAddress').find('.address').val());
			$('.skLookAds').show();
		}
		
	});
	//修改收货地址
	$('.modify').click(function(){
		
		$('.skAddress').show().siblings('.skip').hide();
	});
	//填写地址输入框
	var $oText = $('.skAddress form p input');
	
	$oText.focus(function(){
		if($(this).val()=='请输入姓名'||$(this).val()=='请输入手机号'){
			$(this).val('');
		}
	});
	
	
	//输入框不能为空
	$('.skAddress form .uInfo').blur(function(){
		var iText = $(this).val().toString().replace(/(^\s*)|(\s*$)/g, "");
		if(iText==''){
			$(this).parent().find('i').css('visibility','visible');

		}else{
			$(this).parent().find('i').css('visibility','hidden');
		}
	});
	
	//失去光标时里面内容为空，复原来的内容
	$('.skAddress .uname').blur(function(){
		iBlur($(this),'请输入姓名');
		
	});
	var uphone ='';
	var reg = /^[1][358][0-9]{9}$/;
	$('.skAddress .uphone').blur(function(){
		iBlur($(this),'请输入手机号');
		oldPhone = $('.skAddress .uphone').val();
		uphone = reg.test($('.uphone').val());
		if(!uphone){
			$(this).parent().find('i').css('visibility','visible');
			$('.skAddress .uphone').val('请输入手机号');
		}else{
			$(this).parent().find('i').css('visibility','hidden');
		}
		
	});
	
	//保存邮寄地址(判断)
	$('#uAddress .submit').click(function(){
		var reg = /^[1][358][0-9]{9}$/;
		uphone = reg.test($('.uphone').val());
		
		
		

		var inputCon = $('.skAddress form i').next().val().toString().replace(/(^\s*)|(\s*$)/g, "");
		var address = $('.skAddress form .address').val().toString().replace(/(^\s*)|(\s*$)/g, "");
		if(inputCon == ''||address==''||uphone==false||$('.skAddress form i').next().val().indexOf('请输入')!=-1){
			$('.limitTips').show().find('p').html('输入框内容不能为空或者不符合要求，请重新输入！');
			
			if($('.writeAddress').hasClass('active')){
				if(mobile!=''||realName!=''||addrContent!=''){
					$('.skAddress .uphone').val(mobile);
					$('.skAddress .uname').val(realName);
					$('.skAddress .address').val(addrContent);
				}else{
					$('.skAddress .uphone').val(userMsg.mobile);
					$('.skAddress .uname').val(userMsg.realName);
					$('.skAddress .address').val(userMsg.addrContent);
				}
				
//				if(realName!=''){
//					$('.skAddress .uname').val(realName);
//				}else{
//					$('.skAddress .uname').val(userMsg.realName);
//					
//				}
//				
//				if(addrContent!=''){
//					$('.skAddress .address').val(addrContent);
//				}else{
//					$('.skAddress .address').val(userMsg.addrContent);
//					
//				}
				
			}else{
					$('.skAddress .uphone').val('请输入手机号');
					$('.skAddress .uname').val('请输入姓名');
					$('.skAddress .address').val('请输入地址')
				
			}
			
			return ;
		}else{
			var userInfo = $('#uAddress').serialize();
			userInfo = decodeURIComponent(userInfo,true);
			//在进行编码
//			userInfo = encodeURI(encodeURI(userInfo));
//			alert(userInfo);

			if(!$('.writeAddress').hasClass('active')){
				saveOrUpdateAddress(userInfo,addressId);
				
//				eggData(URL);
			}else{
				saveOrUpdateAddress(userInfo,addressId);
				
			}
			return false;
		}
	});
	
	//地址
	limitDown($('.skAddress .address'),72,'地址');
	
	//手机号
	limitDown($('.skAddress .uphone'),12,'手机号');
	
	//姓名
	limitDown($('.skAddress .uname'),18,'姓名');
	
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
	
	//我的金蛋
	$('.myEgg').click(function(){
		$('.skMyPrize').show();
		goldEgg01();//默认初始化我的金蛋
	});
	//翻页导航
	// 添加点击事件
	
	$('.showPage').delegate('input','click',function(){
			pageNow = parseInt($(this).attr('rel'));
			togglePrize(curPrize);
	});
	
	
	
});
var realName = '',
	addrContent = '',
	mobile ='';
var addressId='';
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
		maps = {
			'address.realName':uname,
			'address.mobile':uphone,
			'address.addrContent':address,
			'address.activityId':activityId
		};
	}else{
		maps = {'address.realName':uname,
			'address.mobile':uphone,
			'address.addrContent':address,
			'address.activityId':activityId,
			'address.addressId':addressId
		};
	}
	
	$.ajax({
        type : 'get',
		url : fix+'/activity/saveOrUpdateAddress.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token,
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
						'background':'url(img/egg/addressBtn02.png) no-repeat 0px 0px'
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
eggData(URL);
var userMsg ;
function eggData(url){
	$.ajax({
        type : 'get',
		url : url,
        dataType : 'json', 
        success : function(json){
//      	console.log(json);
			// 初始化排名、金蛋数
			if(json.map.status == 1){
				if(json.map.addressInfo.status==1){
					addressId = json.map.addressInfo.addressInfo.addressId;
					
				}
				
				$('.todayNum').html(json.map.rankInfo.todayNum);
				$('.todayRank').html(json.map.rankInfo.todayRank);
				$('.totalNum').html(json.map.rankInfo.totalNum);
				$('.totalRank').html(json.map.rankInfo.totalRank);

				initList(json.map.todayAllRank,$('.todayListCon table tbody'));//初始化今日榜单
				
				
				if(json.map.eggInfo.length!=0){
					var egginfo = json.map.eggInfo;
					
					for(var i=0;i<egginfo.length;i++){
						if(egginfo[i].gameing){
							$('.skInitEgg .gameing').html('恭喜通过游戏获得<span class="fw">'+egginfo[i].gameing+'</span>个金蛋赶快查看排名变化吧！');
						}
						if(egginfo[i].longing){
							$('.skInitEgg .logining').html('恭喜通过登录获得<span class="fw">'+egginfo[i].longing+'</span>个金蛋赶快查看排名变化吧！');
						}
						if(egginfo[i].coining){
							$('.skInitEgg .coining').html('恭喜通过充值获得<span class="fw">'+egginfo[i].coining+'</span>个金蛋赶快查看排名变化吧！');
						}
						
						
					}
					$('.skInitEgg').show();
					
				}
				
				
				//邮寄地址
				if(json.map.addressInfo.status==1){
					    userMsg = json.map.addressInfo.addressInfo;
//					    alert(userMsg.mobile);
					$('.writeAddress').addClass('active');
					$('.writeAddress').css({
						'background':'url(img/egg/addressBtn02.png) no-repeat 0px 0px'
					});
					
					upDateForm(userMsg.realName,userMsg.mobile,userMsg.addrContent);
					
					
				}else if(json.map.addressInfo.status==0){
					$('.writeAddress').css({
						'background':'url(img/egg/writeAddress.png) no-repeat 0px 0px'
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
function upDateForm(name,phone,address){
	
	$('.skLookAds .uname').html(name);
	$('.skLookAds .uphone').html(phone);
	$('.skLookAds .address').html(address);
	
	$('.skAddress .uname').val(name);
	$('.skAddress .uphone').val(phone);
	$('.skAddress .address').val(address);
}
function totalRank(){
		$.ajax({
	        type : 'get',
			url : fix+'/activity/totalRankInfo.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&activityId='+activityId,
	        dataType : 'json', 
	        success : function(json){
				initList(json.map.totalAllRank,$('.allListCon table tbody'));//初始化总榜单
				
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
		url : fix+'/activity/myJindanLog.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='+pageNow+'&activityId='+activityId,
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
		url : fix+'/activity/rankPrize.action?tokenUserName='+userName+'&tokenId='+userId+'&token='+token+'&curPage='+pageNow+'&activityId='+activityId,
        dataType : 'json', 
        success : function(json){
//      	console.log(json);
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
function initMyEgg(data,ele){
	if(data.length!=0){
		var myEgg = '';
		for(var i=0;i<data.length;i++){
			myEgg +='<tr><td>'+data[i][0]+'</td><td>'+data[i][1]+'</td><td>'+data[i][2]+'</td></tr>';
		}
		ele.html(myEgg);
	}else{
		ele.html('<tr><td colspan="3">暂无数据</td></tr>');
		totalPage=1;
		
	}
	
	
}
function initList(data ,ele){
	var userRank = '';
	for(var i=0;i<data.length;i++){
		userRank += '<tr><td>'
			+(i+1)+"</td><td>"
			+data[i][0]+'</td><td class="e59">'
			+data[i][2]+'</td></tr>';
	}
	ele.html(userRank).find('tr:lt(3)').css({
		'fontWeight':'bold',
		'color':'red'
	}).find('td').removeClass('e59');
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
	pageNow = parseInt(pageNow);
	var PageLeft = '<span class="dlb fl">第'+pageNow+'页</span>';
	var Pageright = '<span class="dlb fl">共'+totalPage+'页</span>';
	
	var prevStr = '',
		nextStr = '';
	if(totalPage>1){
			//如果你显示的第一页
		if(pageNow == 1){
			prevStr = '<input type="button" class="dlb fl prev cp" disabled />';
			nextStr = '<input type="button" class="next fl cp" rel="'+(pageNow+1)+'"/>';
		
		}if(pageNow >= totalPage){
			prevStr = '<input type="button" class="dlb fl prev cp" rel="'+(pageNow-1)+'" />';
			nextStr = '<input type="button" class="next fl cp" disabled/>';
			
			
		}else if(pageNow>1 && pageNow<totalPage){
			prevStr = '<input type="button" class="dlb fl prev cp" rel="'+(pageNow-1)+'" />';
			nextStr = '<input type="button" class="next fl cp" rel="'+(pageNow+1)+'"/>';
			
		}
	}else{
			prevStr = '<input type="button" class="dlb fl prev cp" disabled />';
			nextStr = '<input type="button" class="next fl cp" disabled/>';
	}
	
	
	ele.html(PageLeft+prevStr+nextStr+Pageright);
	
	$('.showPage li').mouseenter(function(){
			$(this).css('background', '#f2dac0');
	}).mouseleave(function(){
		if(!$(this).hasClass('active')){
			$(this).css('background', '');
		}
	}).removeClass('active').eq(pageNow-1).addClass('active');
	
	$('.showPage li.active').css({
		'background': '#f2dac0'
	});
}


function iBlur(ele,msg){
	if(ele.val().toString().replace(/(^\s*)|(\s*$)/g, "")==''){
		   ele.val(msg);
	}
	
}

function toggleBg(ele1,className){
	ele1.addClass('active').siblings().removeClass('active');
	$('.'+className).eq(ele1.index()).show().siblings('.'+className).hide();
	
}
