const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const loadYML = name => {
    return yaml.load(fs.readFileSync(`./config/${name}.yml`, 'utf-8'));
};

exports.loadYML = loadYML;

exports.loadPlugins = () => {
    let plugins = {};
    const pluginsPath = fs.readdirSync(path.resolve(__dirname, '..', 'plugins'));

    for (let plugin of pluginsPath) {
        plugins[plugin] = require("../plugins/" + plugin + "/index.js");
        bot.logger.info("插件 " + plugin + " 加载完成");
    }

    return plugins;
};

exports.processed = (qqData, plugins, type) => {
    if (qqData.message[0].type === 'text') {
        const command = getCommand(qqData.raw_message);
        if (command) {
            plugins[command]({ ...qqData, type });
            return true;
        }
    }

    return false;
};

const getCommand = msgData => {
    const commandConfig = loadYML('command');

    for (let command in commandConfig) {
        if (commandConfig.hasOwnProperty(command)) {
            for (let setting of commandConfig[command]) {
                let reg = new RegExp(setting);
                if (reg.test(msgData)) {
                    return command;
                }
            }
        }
    }

    return null;
}
