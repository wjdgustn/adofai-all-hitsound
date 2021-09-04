const fs = require('fs');
const readline = require('readline');

const utils = require('./utils');
const { inputs } = require('./cli_input.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];

process.stdout.write(inputs[0]);

rl.on('line', line => {
    input.push(line);
    if(input.length < inputs.length) process.stdout.write(inputs[input.length]);
    else rl.close();
}).on('close', () => {
    if(input.length < inputs.length) {
        console.log('\n\n변환을 취소합니다.');
        process.exit(0);
    }

    input = input.map(a => isNaN(a) ? a : Number(a));

    if(!fs.existsSync(input[0])) {
        console.log('해당 채보 파일이 없습니다.');
        process.exit(0);
    }

    const file = fs.readFileSync(input[0]);
    const adofai = utils.ADOFAIParser(file);

    if(!adofai.pathData && !adofai.angleData) {
        console.log('이 파일은 얼불춤 채보가 아닙니다.');
        process.exit(0);
    }

    const totalTile = !adofai.pathData ? adofai.angleData.length : adofai.pathData.length;
    const hitsoundVolumeMap = [ adofai.settings.hitsoundVolume ];
    for(let a of adofai.actions) {
        if(a.eventType != 'SetHitsound') continue;
        hitsoundVolumeMap[Number(a.floor)] = Number(a.hitsoundVolume);
    }

    adofai.settings.hitsound = 'Hat';
    adofai.actions = adofai.actions.filter(a => a.eventType != 'SetHitsound');

    let hitsoundCursor = 1;
    let hitsoundVolume = hitsoundVolumeMap[0];

    for(let i = 1; i <= totalTile; i++) {
        if(hitsoundVolumeMap[i] != null) hitsoundVolume = hitsoundVolumeMap[i];

        adofai.actions.push({
            "floor": i,
            "eventType": "SetHitsound",
            "hitsound": utils.hitsoundMap[hitsoundCursor],
            "hitsoundVolume": hitsoundVolume
        });

        hitsoundCursor++;
        if(hitsoundCursor > utils.hitsoundMap.length - 1) hitsoundCursor = 0;
    }

    fs.writeFileSync('export.adofai', JSON.stringify(adofai));
});