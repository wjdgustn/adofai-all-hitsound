module.exports.ADOFAIParser = level => {
    try {
        return JSON.parse(level);
    }
    catch (e) {
        return JSON.parse(String(level).trim()
            .replaceAll(', ,', ',')
            .replaceAll('}\n', '},\n')
            .replaceAll('},\n\t]', '}\n\t]')
            .replaceAll(', },', ' },')
            .replaceAll(', }', ' }')
            .replaceAll('\n', '')
            .replaceAll('}\n', '},\n'));
    }
}

module.exports.hitsoundMap = [
    'Hat',
    'Kick',
    'Shaker',
    'Sizzle',
    'Chuck',
    'Hammer',
    'KickChroma',
    'SnareAcoustic2',
    'Sidestick',
    'Stick',
    'ReverbClack',
    'Squareshot'
]