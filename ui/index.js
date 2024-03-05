import Wgge from "wgge";
import MyGameModel from "./game/MyGameModel";
import MyGameController from "./game/MyGameController";
import MyGameRenderer from "./game/MyGameRenderer";

const DEBUG_ENABLED = true;

const game = new MyGameModel(DEBUG_ENABLED);

game.isInDebugMode.set(false);

const wgge = new Wgge(
	new MyGameController(game),
	new MyGameRenderer(game, window.document.body)
)

wgge.start();

