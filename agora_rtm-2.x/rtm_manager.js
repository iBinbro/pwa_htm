var rtm;

async function appInitRtm() {
	alert("appInitRtm");

	// 初始化客户端实例
	const {
		RTM
	} = AgoraRTM;
	// 填入你从控制台获得的 App ID
	// 正式环境
	const appId = "7ea2c143e4f948d8b36c297e6d1c3639";
	// 测试环境
	// const appId = "4e15a56312d944c9ab5841dc9064f724";
	// 填入你的用户 ID
	const userId = "208256449";

	const rtmConfig = {
		logLevel: "debug",
		token: "0067ea2c143e4f948d8b36c297e6d1c3639IAD0uB9FxRx3PHqGEwPhPMQKzQY5XLCwTI5OjP7l0iKMYCxE8coAAAAAFAAT/IieoJmxZgEA6AMAjScAAAAAAA=="
	}

	rtm = new RTM(appId, userId, rtmConfig);
	alert("Rtm 初始化成功!");

	rtm.addEventListener("message", event => {
		const channelType = event
			.channelType; // Which channel type it is, Should be "STREAM" or "MESSAGE" .
		const channelName = event.channelName; // Which channel does this message come from
		const topic = event
			.topicName; // Which Topic does this message come from, it is valid when the channelType is "STREAM".
		const messageType = event.messageType; // Which message type it is, Should be "STRING" or "BINARY" .
		const customType = event.customType; // User defined type
		const publisher = event.publisher; // Message publisher
		const message = event.message; // Message payload
		const pubTime = event.publishTime; // Message publisher timestamp
		console.log("message=" + message);


		// sendMessage(message);
	});

	try {
		const result = await rtm.login();
		alert("Rtm 登录成功 ${result.log}");
	} catch (status) {
		alert("Rtm 登录失败 ${status}");
	}
	// 10090
	// "107954896"
	// "0064e15a56312d944c9ab5841dc9064f724IACQKkclZeSErnbYN2PjS/Me+Rmz4HQJBchigxBI0C2pe/Cq8ekAAAAAFACHv5BvzJWxZgEA6AMAjScAAAAAAA=="

	// 10091
	// "107954897"
	// "0064e15a56312d944c9ab5841dc9064f724IAD/4n5Z0/6YeWEm/fRo9jadKD4HbiBRaV4eSXio+7hDNWaa9p4AAAAAFADcFqEgoZSxZgEA6AMAjScAAAAAAA=="
}

async function sendMessage(payload) {
	const publishMessage = JSON.stringify(payload);
	try {
		const result = await rtm.publish("137777092", payload);
		console.log(result);
	} catch (status) {
		console.log("失败" + status);
	}
}

async function sendMessage2() {

	// const payload = {
	// 	type: "text",
	// 	message: "message"
	// };
	// const publishMessage = JSON.stringify(payload);
	// try {
	// 	const result = await rtm.publish("208257314", publishMessage);
	// 	console.log(result);
	// } catch (status) {
	// 	console.log("失败" + status);
	// }


	// const payload = "Hello Agora!";
	// const channelName = "208257314";
	// const options = {
	// 	customType: "PlainTxt",
	// };
	// try {
	// 	const result = await rtm.publish(channelName, payload, options);
	// 	alert("Rtm 发送成功" + result);
	// } catch (status) {
	// 	alert("Rtm 发送失败" + status);
	// }

	const options = {
		"messageType": "STRING"
	};
	try {
		const result = await rtm.publish("208257314", "1", options);
		alert("Rtm 发送成功" + result);
	} catch (status) {
		alert("Rtm 发送失败" + status);
	}

}