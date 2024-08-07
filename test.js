///.../webapp/web/test.js

function toFlutterWeb(connectionState, connectionStateReason) {
	connectionState(connectionState, connectionStateReason);
}

function jsFunction() {
	alert("flutter web 调用 js")
	// js直接调用flutter web方法
	jsCallFlutterWeb();
}

function permission() {
	try {
		// 检查浏览器是否支持getUserMedia API
		if (navigator.mediaDevices.getUserMedia) {
			// 设置媒体类型和尺寸
			const constraints = {
				video: true, // 请求摄像头
				audio: true // 请求麦克风
			};

			// 获取视频流
			navigator.mediaDevices.getUserMedia(constraints)
				.then(function(stream) {
					alert("成功");
					const videoElement = document.getElementById('video');
					videoElement.srcObject = stream;

					const audioElement = document.getElementById('audio');
					audioElement.srcObject = stream;
				})
				.catch(function(err) {
					alert("出错了：" + err);
				});
		} else {
			alert('不幸的是，你的浏览器不支持getUserMedia');
		}
	} catch (e) {
		//TODO handle the exception
		if (err.name === 'NotAllowedError') {
			// 用户拒绝了请求
			alert('用户拒绝了请求');
		} else if (err.name === 'NotFoundError') {
			// 未找到媒体设备
			alert('未找到媒体设备');
		} else {
			alert('其它错误');
		}
	}
}