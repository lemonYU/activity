//获奖公告滚动栏--左右无缝滚动
function Slide(obj, direction, speed) { //面向对象的方法，可以自由控制方向，speed=>3 ie下可以 
	this.container = document.getElementById(obj);
	this.content = this.container.getElementsByTagName("ul")[0];
	this.lis = this.content.getElementsByTagName("li");
	this.content.innerHTML += this.content.innerHTML;
	
	this.content.style.width = ($(this.lis[0]).width()+ 20) * this.lis.length + "px";
	this.time = null;
	var that = this;
	if(direction == "left") {
		this.speed = -speed;
	} else if(direction == "right") {
		this.speed = speed;
	}
	Slide.prototype.scroll = function() {
		this.content.style.left = this.content.offsetLeft + this.speed + "px";
		if(this.content.offsetLeft <= -this.content.offsetWidth / 2) {
			this.content.style.left = "0px";
		} else if(this.content.offsetLeft >= 0) {
			this.content.style.left = -this.content.offsetWidth / 2 + "px";
		}
	}
	var timeout = false; //启动及关闭按钮 
	time();
	clearTimeout(this.time);
	function time(){  
	  if(timeout) return;  
	  that.scroll(); 
	 
	  this.time = setTimeout(time,100); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒  
	}  
	
//	this.time = setInterval(function() {
//		that.scroll();
//	}, 100);
	

}	