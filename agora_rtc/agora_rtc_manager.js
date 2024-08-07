let rtcManager = {
	localAudioTrack: null,
	localVideoTrack: null,
	rtc: null,
};

var rtc;

function appInitRtc() {
	rtc = AgoraRTC.createClient({
		mode: 'rtc',
		codec: 'h264'
	});

	rtc.on("user-published", async (user, mediaType) => {
		await rtc.subscribe(user, mediaType);
		callFlutterWebRecordLog("subscribe success");

		if (mediaType === "video") {
			var _remoteVideoElement = document.getElementById(user.uid.toString());
			user.videoTrack.play(_remoteVideoElement);
			callFlutterWebRecordLog("remote push Video");
		}

		if (mediaType === "audio") {
			const remoteAudioTrack = user.audioTrack;
			remoteAudioTrack.play();
			callFlutterWebRecordLog("remote push audio");
		}

		rtc.on("user-unpublished", user => {
			callFlutterWebRecordLog("remote stop push video");
		});
	});

	rtc.on("user-joined", async (user) => {
		callFlutterWebRecordLog(`user-joined ${user.uid}`);
	});

	rtc.on("user-left", async (user) => {
		callFlutterWebRecordLog(`user-left ${user.uid}`);
	});

}

async function joinChannel(appId, channel, token, uid) {
	await rtc.join(appId, channel, token, uid);
	try {
		rtcManager.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
		rtcManager.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
		rtc.publish([rtcManager.localAudioTrack, rtcManager.localVideoTrack]);
		var _myVideoElement = document.getElementById(uid);
		rtcManager.localVideoTrack.play(_myVideoElement);
		callFlutterWebRecordLog("local push video");
	} catch (error) {
		callFlutterWebRecordLog(`${error.code}:${error.message}`);
	}
}

async function levelChannel() {
	try {
		rtcManager.localAudioTrack.close();
		rtcManager.localAudioTrack = null;
		rtcManager.localVideoTrack.close();;
		rtcManager.localVideoTrack = null;
	} finally {
		await rtc.leave();
		callFlutterWebRecordLog("leave channel");
	}
}