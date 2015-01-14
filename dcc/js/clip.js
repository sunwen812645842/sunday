var audio;
var canvas = document.getElementById("cas"),
ctx = canvas.getContext("2d");
var x1, y1, a = 25,
timeout, totimes = 100,
range = 25;
var area = 0;
var isInited = false;
canvas.width = document.getElementById("bb").clientWidth;
canvas.height = document.getElementById("bb").clientHeight;
var img = new Image();
img.src = "images/1.jpg";
img.onload = function() {
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	ctx.fillRect(0, 0, canvas.width, canvas);
	otherClip();
}
//通过修改globalCompositeOperation来达到擦除的效果
//使用clip来达到擦除效果
function otherClip() {
	var hastouch = "ontouchstart" in window ? true: false,
	tapstart = hastouch ? "touchstart": "mousedown",
	tapmove = hastouch ? "touchmove": "mousemove",
	tapend = hastouch ? "touchend": "mouseup";
	canvas.addEventListener(tapstart,
		function(e) {
			e.preventDefault();
			canvas.addEventListener(tapmove, tapmoveHandler);
			x1 = hastouch ? e.targetTouches[0].pageX: e.clientX - canvas.offsetLeft;
			y1 = hastouch ? e.targetTouches[0].pageY: e.clientY - canvas.offsetTop;
			ctx.save();
			ctx.beginPath();
			ctx.arc(x1, y1, a, 0, 2 * Math.PI);
			ctx.clip();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.restore();

		});

	function tapmoveHandler(e) {
		e.preventDefault();
		x2 = hastouch ? e.targetTouches[0].pageX: e.clientX - canvas.offsetLeft;
		y2 = hastouch ? e.targetTouches[0].pageY: e.clientY - canvas.offsetTop;
		var asin = a * Math.sin(Math.atan((y2 - y1) / (x2 - x1)));
		var acos = a * Math.cos(Math.atan((y2 - y1) / (x2 - x1)));
		var x3 = x1 + asin;
		var y3 = y1 - acos;
		var x4 = x1 - asin;
		var y4 = y1 + acos;
		var x5 = x2 + asin;
		var y5 = y2 - acos;
		var x6 = x2 - asin;
		var y6 = y2 + acos;
		ctx.save();
		ctx.beginPath();
		ctx.arc(x2, y2, a, 0, 2 * Math.PI);
		ctx.clip();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x3, y3);
		ctx.lineTo(x5, y5);
		ctx.lineTo(x6, y6);
		ctx.lineTo(x4, y4);
		ctx.closePath();
		ctx.clip();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
		x1 = x2;
		y1 = y2;
	}
	canvas.addEventListener(tapend,
		function(e) {
			e.preventDefault();
			canvas.removeEventListener(tapmove, tapmoveHandler);
			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var dd = 0;
			for (var x = 0; x < imgData.width; x += range) {
				for (var y = 0; y < imgData.height; y += range) {
					var i = (y * imgData.width + x) * 4;
					if (imgData.data[i + 3] > 0) {
						dd++;
					}
				}
			}
			if (dd / (imgData.width * imgData.height / (range * range)) < 0.4) {
				$(".u-arrow ").show();
				$("#cover").fadeOut("3000");
				initImages();
			}
		},
		false);
}
var index = 0;
var width = document.getElementById("bb").clientWidth;
var height = document.getElementById("bb").clientHeight;
function initImages() {
	$("#cover").hide();
	var startX, startY, endX, endY
	var scrollTopVal = 0;
	var sign = 0;
	var oneround = false;
	var moved = false;
	var next, pre, nextImage, preImage, thisImage;
	var hastouch = "ontouchstart" in window ? true: false,
	tapstart = hastouch ? "touchstart": "mousedown",
	tapmove = hastouch ? "touchmove": "mousemove",
	tapend = hastouch ? "touchend": "mouseup";
	function touchStart(event) {
		event.preventDefault();
		document.getElementById("bb").addEventListener(tapmove, touchMove, false);
		if (!isInited) {
			isInited = true;
			document.getElementById("bb").addEventListener(tapend, touchEnd, false);
		}
		startY = hastouch ? event.touches[0].screenY: event.clientY;
		if (thisImage) {
			thisImage.hide();
		}
		moved = false;
		thisImage = $(".boximages:eq(" + index % ($(".boximages").size()) + ")");
		thisImage.show();
		thisImage.css("-webkit-animation", "");
		thisImage.find("div").css("-webkit-animation", "");
		thisImage.css("-webkit-transform", "scale(1)");
		thisImage.find("div").css("-webkit-transform", "scale(1)");
		thisImage.css("z-index", "1");
	}
	function touchMove(event) {
		event.preventDefault();
		moved = true;
		var tempY = hastouch ? event.touches[0].screenY: event.clientY;
		sign = (startY - tempY) > 0 ? 1 : -1;
		endY = (startY - tempY) * sign;
		var ratio = 1 - endY * 0.2 / height;
		//var width=$(".boximages:eq("+index+")").width();
		// var height=$(".boximages:eq("+index+")").height();
		//thisImage.height(height * ratio);
		//$(".boximages:eq("+(index)+")").find("img").height(height*ratio*1.05);
		//thisImage.find("img").height(height * ratio);
		//thisImage.find("img").width(width * ratio);

		next = (index + sign) % ($(".boximages").size());
		pre = (index - sign) % ($(".boximages").size());
		nextImage = $(".boximages:eq(" + next + ")");
		preImage = $(".boximages:eq(" + pre + ")")

		if (preImage) {
			preImage.hide();
		}
		if (next >= 0) {
			nextImage.css("-webkit-animation", "");
			nextImage.css("-webkit-transform", "scale(1)");
			nextImage.css("z-index", "9");
			nextImage.find("div").css("-webkit-transform", "scale(1)");
			nextImage.show();
			nextImage.css("-webkit-transform", "translate(0px," + (height - endY) * sign + "px) ");
			thisImage.css("-webkit-transform", "scale(" + ratio + ") translate(0px," + (height * (ratio - 1) * sign) + "px)");
		}

		//thisImage.find("div").css("-webkit-transform","scale("+ratio+")");
		//nextImage.offset({top:nextImagePostion.top-endY,left:0})
	}
	function touchEnd(event) {
		//$("#tips").text(endY);
		event.preventDefault();
		document.getElementById("bb").removeEventListener(tapmove, touchMove, false);
		//$(".boximages:eq(" + (index) + ")").slideUp();
		//nextImage.css("transform","translate(0px,0px)");
		//nextImage.css("-webkit-transform","translate(0px,0px)");
		//nextImage.animate({left:"0px",top:"0px"});
		if (moved) {
			if (endY / height > 0.15 && next >= 0) {
				nextImage.css("z-index", "9");
				nextImage.css("-webkit-animation", "transtoTop 0.3s forwards");
				if (sign == 1) {
					thisImage.css("-webkit-animation", "slideUp 0.5s forwards");
				} else {
					thisImage.css("-webkit-animation", "slideDown 0.5s forwards");
				}
				index = index + sign == 0 ? (oneround ? $(".boximages").size() * 100 : 0) : index + sign;
				if (index >= $(".boximages").size()) {
					oneround = true;
				}

			} else {
				thisImage.css("z-index", "9");
				nextImage.css("z-index", "1");
				nextImage.css("-webkit-transform", "translate(0px," + height * sign + "px) ");
				thisImage.css("-webkit-animation", "firstStatus 0.5s forwards");
				//thisImage.find("div").css("-webkit-animation","firstStatus 0.5s forwards");
			}
		};

	}
	document.getElementById("bb").addEventListener(tapstart, touchStart, false);

}

function jumptoUrl() {
	var hastouch = "ontouchstart" in window ? true: false,
	tapstart = hastouch ? "touchstart": "mousedown",
	tapmove = hastouch ? "touchmove": "mousemove",
	tapend = hastouch ? "touchend": "mouseup";
	window.location.href = "http://www.la-routine.com";
}