var rtm;
var remoteInvitations = {};

async function appInitRtm(appId, uid, token) {

	// 初始化客户端实例
	rtm = AgoraRTM.createInstance(appId);
	callFlutterWebRecordLog("Rtm init success!");

	rtm.on('MessageFromPeer', (message, peerId) => {
		callFlutterWebRecordLog(`MessageFromPeer ${message} ${peerId}`);
		callFlutterWebRtmMsg(message.text);
	});

	rtm.on('RemoteInvitationReceived', (remoteInvitation) => {
		callFlutterWebRecordLog(`RemoteInvitationReceived ${remoteInvitation}`);
		remoteInvitations[remoteInvitation.callerId] = remoteInvitation;
		callFlutterWebRemoteInvitationReceived(remoteInvitation.callerId, remoteInvitation.content,
			remoteInvitation.channelId);
	});

	rtm.on("ConnectionStateChanged", async (state, reason) => {
		callFlutterWebRtmConnectionState(state, reason);
		callFlutterWebRecordLog(`state ${state} reason ${reason}`);
	})

	let options = {
		uid: uid,
		token: token,
	}

	try {
		const result = await rtm.login(options);
		callFlutterWebRecordLog("Rtm login success");
	} catch (status) {
		callFlutterWebRecordLog(`Rtm login failed ${status.message}`);
	}
}

function sendMessage(text, peerId) {
	callFlutterWebRecordLog(`sendMessage ${text} ${peerId}`);
	rtm.sendMessageToPeer({
				text: text
			},
			peerId,
		)
		.then((sendResult) => {
			if (sendResult.hasPeerReceived) {
				callFlutterWebRecordLog("Remote Received Message");
			} else {
				callFlutterWebRecordLog("Remote Not Got Message");
			}
		})
		.catch((error) => {
			callFlutterWebRecordLog(`failed ${error}`);
		});
}

function rtmLoginOut() {
	rtm.logout();
}

function sendLocalInvitation(peerId, userInfo, channelId) {
	const localInvitation = rtm.createLocalInvitation(peerId);

	localInvitation.on("LocalInvitationReceivedByPeer", () => {
		callFlutterWebRecordLog(`LocalInvitationReceivedByPeer ${peerId}`);
	});

	localInvitation.on("LocalInvitationRefused", () => {
		callFlutterWebRecordLog(`LocalInvitationRefused ${peerId}`);
	});

	localInvitation.on("LocalInvitationAccepted", () => {
		callFlutterWebRecordLog(`LocalInvitationAccepted ${peerId}`);
		callFlutterWebLocalInvitationAccepted(peerId, localInvitation.channelId);
	});

	localInvitation.content = userInfo;
	localInvitation.channelId = channelId;
	localInvitation.send();
	callFlutterWebRecordLog(`LocalInvitation had sent ${peerId}`);
}

// acceptInt "1"接受
function responseToRemoteInvitation(peerId, acceptString) {
	var remoteInvitation = remoteInvitations[peerId];
	if (acceptString == "1") {
		remoteInvitation.accept();
	} else {
		remoteInvitation.refuse();
	}
}