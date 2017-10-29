/**  *date:2017/08/16/23:02  * author:GuanQun  */
//保存图片数组
var img_data = {"imgList":[]};
//图片选择总数
var selectImgCount = 0;
/*拖拽*/
function drag(obj){
	obj.addEventListener('touchstart',function(ev){
		var disX = ev.targetTouches[0].pageX - obj.offsetLeft;
		var disY = ev.targetTouches[0].pageY - obj.offsetTop;
		console.log()
		function fnMove(ev){
			obj.style.left = ev.targetTouches[0].pageX - disX +'px';
			obj.style.top = ev.targetTouches[0].pageY - disY +'px';
		}
		function fnEnd(){
			obj.removeEventListener('touchmove',fnMove,false);
			obj.removeEventListener('touchend',fnEnd,false);
		}
		obj.addEventListener('touchmove',fnMove,false);
		obj.addEventListener('touchend',fnEnd,false);
		ev.preventDefault();
	},false);
}
var file_upload=function (picture,file) {
    if (picture.file.type.match('image.*')) {
        var w_h=0;
        var temp_img=new Image();
        temp_img.style.display="none";
        temp_img.src=picture.e.target.result;
		if(file.size > 5242880) {
			 alert("文件体积大于5M，上传失败！");
			 return false;
		}
        
        temp_img.onload = function () {
	        var that = this;
	        //生成比例 
	        var w = that.width,
	        h = that.height,
	        scale = w / h; 
	        w = 480 || w;  //480  你想压缩到多大
	        h = w / scale;
	        //生成canvas
	        var canvas = document.createElement('canvas');
	        
	        var ctx = canvas.getContext('2d');
	        
	        $(canvas).attr({width : w, height : h});
	        //获取照片方向角属性，用户旋转控制  
		    EXIF.getData(temp_img, function() {
		        EXIF.getAllTags(this);   
		        Orientation = EXIF.getTag(this, 'Orientation');
			    if(Orientation != "" && Orientation != null) {
			    	// 方向信息，canvas 显示形式，canvas 对象，that,宽度，高度
			    	rotateImg(Orientation,ctx,canvas,that,w,h);
			    }else {
			    	rotateImg(Orientation,ctx,canvas,that,w,h);
			    }
		    });
	    }
    }
    else{
        alert("请选择正确的图片格式上传");
    }
};
// 图片旋转操作，以及对图片压缩的处理。
var nodes = document.getElementById("pictureInfo");
function rotateImg(Orientation,ctx,canvas,that,w,h) {
//	alert(Orientation);
	if(Orientation == "6") {
		$(canvas).attr({width : w/2, height : h});
    	ctx.translate(270, 0);
	    var angle = 90;
	    ctx.clearRect(-w, -h, w, h); //x2 是为了把原来的图全部抹掉（不留下痕迹）
		ctx.rotate(angle * Math.PI / 180);
		ctx.fillRect(w, h, w, h);
    }
	//向画布上绘制图像、画布或视频
    ctx.drawImage(that, 0, 0, w, h);

    var base64 = canvas.toDataURL('image/jpeg',0.92);   //1z 表示图片质量，越低越模糊。
    base64.substring(22);
    var equalIndex= base64.indexOf('=');
    if(base64.indexOf('=')>0){
	    base64=base64.substring(0, equalIndex);
	
	}
    var strLength=base64.length;
    var fileLength=parseInt(strLength-(strLength/8)*2);
	
	//图片大小
    var oriSize = (fileLength / 1024).toFixed(1);
    
    var date = new Date();
    var pictureInfo = {
    	"imgName":date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate()+date.getTime(),
    	"imgSize":oriSize,
    	"imgType":"image/jpeg",
    	"base64":base64
    };
   	/*本地图片展示逻辑*/
   	/*var childs = nodes.childNodes;
   	for(var i = 0;i<childs.length;i++) {
   		var thisId = childs[i].id;*/
   		/*if(thisId) {*/
   			var display = document.getElementById('place1').style.display;
   			if(display == "none") {
   				document.getElementById('place1-img').src = base64;
   				document.getElementById('place1').style.display = "block";
   				drag(document.getElementById('place1-img'));
   			}else {
				document.getElementById('place1-img').src = base64;
                drag(document.getElementById('place1-img'));
   			}
   	/*	}
   	}*/
   	/*保存图片信息到数组，指定需要的图片数据从数组中获取。*/
   	img_data.imgList.push(pictureInfo);
   	selectImgCount++;
   	/*if(img_data.imgList.length == 5) {
   		document.getElementById("place6").style.display = "none";
   	}*/
}
/*添加图片开始*/
var callBack = function(files) {
	$.each(files, function (index, file) {
		var fileReader = new FileReader();
		var obj_callback=new Object();
		//读取文件加载Load 事件
		fileReader.onload = (function (file) {
			return function (e) {
				obj_callback.file=file;
				obj_callback.e=e;
				file_upload(obj_callback,file);
			};
		})(file);
		//读取图像文件
		fileReader.readAsDataURL(file);
	});
};
var carera=new $.Pgater($("#files_upload1"),callBack);
/*start*/
var oPage = document.getElementById('page');
var oBg = $('#bg');
function start(){
	oPage.style.display = 'none';
	oBg.css('display','block');
}
/*换图*/
var oDiv = document.getElementById("addImg");
var oImgCon = document.getElementById('place1');
var oLayer = document.getElementById('layer');
var oPicture = document.getElementById('place1-img');
var base64=[];
var count = 0;
function addImg(){
	count = count + 1;
    if( count == 9 ){
		oDiv.classList.remove('img'+(count-1));
        count = 0;
		oDiv.classList.add('img0');
		return;
    }
    oDiv.classList.remove('img'+(count-1));
    oDiv.classList.add('img'+count);
}
function reduceImg(){
	count = count - 1;
	if( count == -1){
		oDiv.classList.remove('img'+(count+1));
		count = 8;
		oDiv.classList.add('img8');
		return;
	}
	oDiv.classList.remove('img'+(count+1));
	oDiv.classList.add('img'+count);
}
document.addEventListener('DOMContentLoaded',function(){
	drag(oDiv);
	/*drag(nodes);*/
},false);
/*合成图片*/
function hecheng(){
	var oP = $('<p class="info">正在合成中，请稍后...</p>');
	oBg.append(oP);
	draw(function(){
		oP.css('display','none');
		oLayer.style.display = 'none';
		$('.imageShow').css('display','none');
		$('.icon').css('display','none');
		/*var oImg = '<img style="width: 100%;" src="'+base64[0]+'">';*/
		var oImg = new Image;
		oImg.style.width = '100%';
		oImg.style.height = '100%';
		oImg.onload = function(){
            $('#imgBox').css({width: '375px',height:'604px',position:'absolute',left:0,top:0}).html(oImg);
            alert('长按保存');
		};
        oImg.src = base64[0];
	})
}
var u = navigator.userAgent;
var  v= navigator.userAgent,app = navigator.appVersion;
var isMobile = !!v.match(/AppleWebKit.*Mobile.*/) || !! v.match(/AppleWebKit/); //移动端
var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 			//ios终端
var a_oLayer;
var a_oDiv;

/*console.log($("#layer").css("background").split('(')[2].split('"')[1].split('"')[0]);*/

function draw(fn){
    if(isWin){
        /*a_oLayer = $("#layer").css("background").split('(')[2].split('"')[1];*/
        a_oDiv = $("#addImg").css("background").split('(')[2].split('"')[1];
    }else if(isiOS){
        /*a_oLayer = $("#layer").css("background").toString().split('(')[2].split(')')[0];*/
        a_oDiv = $("#addImg").css("background").toString().split('(')[2].split(')')[0];
    }else{
        /*a_oLayer = $("#layer").css("background").split('(')[2].split('"')[1].split('"')[0];*/
        a_oDiv = $("#addImg").css("background").split('(')[2].split('"')[1].split('"')[0];
    }
    var mask = document.createElement('img');
    mask.src = oLayer.getAttribute('data-mask');
    var data= [oPicture.src,mask.src,a_oDiv];
    if(oPicture.src.indexOf(window.location.hostname) == -1){
        data= [oPicture.src,mask.src,a_oDiv];
    }else{
        data= [mask.src,a_oDiv]
    }
	var c=document.createElement('canvas'),
		ctx=c.getContext('2d'),
		len=data.length;
	c.width=oLayer.clientWidth;
	c.height=oLayer.clientHeight;
	ctx.rect(0,0,c.width,c.height);
	ctx.fillStyle='#fff';
	ctx.fill();
	function drawing(n){
		if(n<len){
			var img= new Image();
            /*img.src = data[n];*/
			img.crossOrigin="anonymous";
			img.onload =function(){
                if(len == 3){
                    if(n == 0){
                        ctx.drawImage(img,oPicture.offsetLeft,oPicture.offsetTop,oPicture.clientWidth,oPicture.clientHeight);
                    }else if(n == 1){
                        ctx.drawImage(img,0,0,oLayer.clientWidth,oLayer.clientHeight);
                    }else if(n == 2){
                        ctx.drawImage(img,oDiv.offsetLeft,oDiv.offsetTop,oDiv.clientWidth,oDiv.clientHeight);
                    }
                }else{
                    if(n == 0){
                        ctx.drawImage(img,0,0,oLayer.clientWidth,oLayer.clientHeight);
                    }else if(n == 1){
                        ctx.drawImage(img,oDiv.offsetLeft,oDiv.offsetTop,oDiv.clientWidth,oDiv.clientHeight);
                    }
                }
                drawing(n+1);
			};
            img.src = data[n];
		}else{
			//保存生成作品图片
			base64.push(c.toDataURL("image/png",0.7));
			//alert(JSON.stringify(base64));
			fn();
		}
	}
	drawing(0);
}