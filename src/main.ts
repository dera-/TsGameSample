import ImageAsset = g.ImageAsset;

const TO_RIGHT_WALK = [7, 8, 7, 6];
const TO_LEFT_WALK = [4, 5, 4, 3];
const TO_DOWN_WALK = [1, 2, 1, 0];
const TO_UP_WALK = [10, 11, 10, 9];

export = (param: string) => {
	let targetX: number;
	let targetY: number;
	const scene = new g.Scene({
        game: g.game,
        assetIds: [
            "bgImg",
            "testCharaImg",
			"pointerImg",
			"walkSe",
			"battleBgm",
        ]
	});
	const bgm: g.AudioAsset = <g.AudioAsset> scene.assets["battleBgm"];
	const walkSe: g.AudioAsset = <g.AudioAsset> scene.assets["walkSe"];
	scene.loaded.add(() => {
		// 以下にゲームのロジックを記述します。
		const bgImg = new g.Sprite({
			scene: scene,
			src: scene.assets["bgImg"],
		});
		const charaSprite = new g.FrameSprite({
			scene: scene,
			src: <ImageAsset>scene.assets["testCharaImg"],
			x:0,
			y:0,
            width:32,
            height:32,
			srcWidth: 32,
			srcHeight: 32,
            frames: TO_RIGHT_WALK,
			interval: 100,
            frameNumber: 7,
		});
		const pointerSprite = new g.FrameSprite({
            scene: scene,
            src: <ImageAsset>scene.assets["pointerImg"],
            x:0,
            y:0,
            width:32,
            height:32,
            srcWidth: 192,
            srcHeight: 192,
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
            frameNumber: 0,
		});
        pointerSprite.hide();
        targetX = charaSprite.x;
        targetY = charaSprite.y;
        charaSprite.update.add(() => {
        	// 以下のコードは毎フレーム実行されます。
			if (charaSprite.x !== targetX || charaSprite.y !== targetY) {
				moveAnimation(charaSprite, targetX, targetY);
			} else if (pointerSprite.visible()) {
				walkSe.stop();
				pointerSprite.stop();
                pointerSprite.hide();
			}
		});
        scene.pointDownCapture.add((ev) => {
            targetX = ev.point.x;
            targetY = ev.point.y;
            pointerSprite.x = ev.point.x;
            pointerSprite.y = ev.point.y;
            pointerSprite.show();
            pointerSprite.start();
            pointerSprite.modified();
            walkSe.play();
		});
        scene.append(bgImg);
		scene.append(charaSprite);
		scene.append(pointerSprite);
		charaSprite.start();
		bgm.play();
	});
	g.game.pushScene(scene);
};

const moveAnimation = (sprite:g.FrameSprite, x: number, y: number): void => {
	const currentX: number = sprite.x;
	const currentY: number = sprite.y;
	let frames: number[] = sprite.frames;
	if (currentX !== x) {
		const dx = (x - currentX) / Math.abs(x - currentX);
		frames = dx > 0 ? TO_RIGHT_WALK : TO_LEFT_WALK;
        sprite.x += dx;
	} else if (currentY !== y) {
		const dy = (y - currentY) / Math.abs(y - currentY);
		frames = dy > 0 ? TO_DOWN_WALK : TO_UP_WALK;
		sprite.y += dy;
	}

	if (sprite.frames !== frames) {
        sprite.frames = frames;
	}

    sprite.modified();
};
