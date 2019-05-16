import { client, settings, on, stopMonitoring, setStatus, startMonitoring, list } from './app';

client.on('message', msg => {
  const splitted = msg.content.split(' ');

  if (msg.channel.type != 'dm' && splitted[0].replace(/[\\<>@#&!]/g, '') != client.user.id) return;

  if (!settings.owners.includes(msg.author.id)) msg.reply('Sorry, you\'re not allowed to use this bot. If you believe this is an error, please contect the bot owner.');

  let command: string;
  const args = [...splitted];

  command = args.shift() || '';
  if (msg.channel.type != 'dm') command = args.shift() || '';
  command = command.toLowerCase();

  const available = getCommands();
 
  if (!Object.keys(settings.commands).includes(command)) return msg.reply(`Unknown command. The available commands are: \`${available.join(' ')}\``);
  if (!available.includes(command)) return msg.reply(`This command has been disabled in the settings. The available commands are: \`${available.join(' ')}\``);

  switch (command) {
    case 'on':
      if (on) return msg.channel.send('The bot is already on.');
      startMonitoring();
      setStatus(true);
      break;

    case 'off':
      if (!on) return msg.channel.send('The bot is already off.');
      stopMonitoring();
      setStatus(false);
      break;

    case 'list':
      (()=>{
        let str = 'These are the currently tracked targets:';
        for (const target of list) str += `\n- ${target.longName() || `\`${target.name} (${target.id})\``}`;
        msg.channel.send(str);
      })();
      break;

    case 'help':
      msg.channel.send('These are the currently available commands:'+
        (settings.commands.on ? '\n- `on` -> Sets the bot in online mode.' : '') +
        (settings.commands.off ? '\n- `off` -> Sets the bot in offline mode.' : '') +
        (settings.commands.list ? '\n- `list` -> Shows you the currently tracked targets.' : '') +
        (settings.commands.help ? '\n- `help` -> Shows you this message.': '')
      );
      break;

    default:
      break;
  }
});


/**
 * Returns an array with the available commands.
 */
function getCommands() {
  const result = [];
  for (const command in settings.commands) {
    //@ts-ignore
    if (settings.commands[command]) result.push(command);
  }
  return result;
}