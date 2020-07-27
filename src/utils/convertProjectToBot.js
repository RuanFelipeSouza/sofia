const _mapProjectToBot = {
    'LOGIN': 'BOT 1',
    'FORNECEDOR': 'BOT 2',
    'CLIENTE': 'BOT 3',
}
const mapBotToProject = (bot) => {
    const botMap = {
        'BOT 1': 'LOGIN',
        'BOT 2': 'FORNECEDOR',
        'BOT 3': 'CLIENTE',
    }
    return botMap[bot]
}
const convertProjectToBotNumber = (data) => {
    return data.map((e => {
        return {
            ...e,
            bot: _mapProjectToBot[e.project]
        }
    }))
}

export {
    convertProjectToBotNumber,
    mapBotToProject
};