$(function(){
	var hastouch = "ontouchstart" in window ? true: false,
	tapstart = hastouch ? "touchstart": "mousedown";
	$(".u-audio").get(0).addEventListener(tapstart,function(){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});






});