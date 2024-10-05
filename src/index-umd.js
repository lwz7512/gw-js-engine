/**
 * Game initialization with UMD way!
 */
const width = 640,
  height = 480;
const screens = [new GW.WelcomeScreen(), new GW.MainScreen()];
const game = new GW.Game(screens, { width, height });
GW.initStage('gw-playground', width, height);
GW.startGame(game);

// console.log(`## GW game started in UMD way!`);
