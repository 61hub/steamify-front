const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch')
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.fetchGames = functions.https.onRequest(async (req, response) => {
  const res = await fetch("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=1AD897533C698E617B4F351C640EC53E&format=json&input_json=%7B%22steamId%22%3A%2276561198080321262%22%2C%22include_appinfo%22%3Atrue%2C%22include_played_free_games%22%3Atrue%7D");

  // TODO try catch
  const json = await res.json();
  let {games} = json.response;

  await Promise.all(games.map(async item => {
    delete item.playtime_mac_forever
    delete item.playtime_linux_forever
    delete item.playtime_windows_forever
    delete item.has_community_visible_stats
    item.store = 'steam'

    await admin.firestore().collection('games').doc(item.appid.toString()).set(item, {merge: true});
  }));

  response.status(200).end()
});