// Terra Agraria — server-side welcome script
PlayerEvents.loggedIn(event => {
    if (!event.player.persistentData.contains('terra_welcomed')) {
        event.player.persistentData.putBoolean('terra_welcomed', true)
        event.player.tell('Welcome to Terra Agraria: From Soil to Stars!')
        event.player.tell('Open your Field Guide (key I) and the FTB Quests book to begin.')
        event.player.tell('564 quests, 4 seasons, 100+ crops, deep cooking. Take your time!')
    }
})
