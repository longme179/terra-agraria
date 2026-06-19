// Terra Agraria — Item ID Exporter
// This script exports ALL registered item IDs to a file for quest verification.
// Run: start the game, then check logs/kubejs/item_export.txt
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

ItemEvents.rightClicked(event => {
    // Only export when player holds a stick and sneaks (manual trigger)
    if (event.item.id === 'minecraft:stick' && event.player.crouching) {
        exportAllItems(event)
        event.player.tell('Item export complete! Check kubejs/item_export.txt')
    }
})

function exportAllItems(event) {
    const Lists = Java.loadClass('dev.architectury.registry.registries.Registries')
    // Use Forge registry access
    const registry = event.server.registryAccess()
    
    let lines = []
    lines.push('# Terra Agraria Item Export — ' + new Date().toISOString())
    lines.push('# Format: modid:item_path')
    lines.push('')
    
    // Get all items from the registry
    const itemRegistry = registry.lookupOrThrow(net.minecraft.core.registries.Registries.ITEM)
    itemRegistry.entrySet().forEach(entry => {
        const rl = entry.getKey().location()
        lines.push(rl.toString())
    })
    
    // Write to file
    const File = Java.loadClass('java.io.File')
    const FileWriter = Java.loadClass('java.io.FileWriter')
    const path = 'kubejs/item_export.txt'
    const file = new File(path)
    const writer = new FileWriter(file)
    writer.write(lines.join('\n'))
    writer.close()
    
    event.player.tell('Exported ' + (lines.length - 3) + ' items to ' + path)
}

// Also auto-export on server start
ServerEvents.loaded(event => {
    if (event.server.persistentData.contains('terra_items_exported')) return
    event.server.persistentData.putBoolean('terra_items_exported', true)
    
    // Delay export to ensure all mods are loaded
    event.server.scheduleInTicks(100, () => {
        exportAllItemsOnServer(event)
    })
})

function exportAllItemsOnServer(event) {
    const registry = event.server.registryAccess()
    let lines = []
    lines.push('# Terra Agraria Item Export — ' + new Date().toISOString())
    lines.push('# Format: modid:item_path')
    lines.push('')
    
    const itemRegistry = registry.lookupOrThrow(net.minecraft.core.registries.Registries.ITEM)
    itemRegistry.entrySet().forEach(entry => {
        const rl = entry.getKey().location()
        lines.push(rl.toString())
    })
    
    const File = Java.loadClass('java.io.File')
    const FileWriter = Java.loadClass('java.io.FileWriter')
    const path = 'kubejs/item_export.txt'
    const file = new File(path)
    const writer = new FileWriter(file)
    writer.write(lines.join('\n'))
    writer.close()
    
    console.log('[Terra Agraria] Exported ' + (lines.length - 3) + ' items to ' + path)
}
