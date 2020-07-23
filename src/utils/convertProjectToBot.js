const mapProjectToBot = {
    'LOGIN': 'BOT 1',
    'FORNECEDOR': 'BOT 2',
    'CLIENTE': 'BOT 3',
}
const convertProjectToBotNumber = (data) => {
    return data.map((e => {
        return {
            ...e,
            bot: mapProjectToBot[e.project]
        }
    }))
}

export default convertProjectToBotNumber;