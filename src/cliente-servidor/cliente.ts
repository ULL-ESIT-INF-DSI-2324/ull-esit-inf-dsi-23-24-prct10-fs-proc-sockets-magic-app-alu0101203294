import net from 'net';
import chalk from 'chalk';
import yargs from 'yargs';
import { Card } from '../Magic/interfaces/card.js';
import { hideBin } from 'yargs/helpers';

// Dirección IP y puerto del servidor
const SERVER_HOST = 'localhost';
const SERVER_PORT = 3000;

// Conexión con el servidor
const client = net.createConnection({ host: SERVER_HOST, port: SERVER_PORT }, () => {
    console.log(chalk.green('Connected to server.\n'));
});

// Manejo de eventos de datos del cliente
client.on('data', data => {
    const responseData = JSON.parse(data.toString());
    if (responseData.message) {
        if (responseData.message.includes('error')) {
            console.log(chalk.bold.red(responseData.message));
        } else {
            console.log(chalk.bold.green(responseData.message));
        }
    } else if (responseData.cards) {
        console.log(chalk.blue.bold('List of cards:'));
        responseData.cards.forEach((card: Card) => {
            const colorCode = getColorCode(card.color);
            console.log(chalk.green.bold(`ID: ${chalk.yellow(card.id)}`));
            console.log(chalk.green.bold(`Name: ${chalk.white(card.name)}`));
            console.log(chalk.green.bold(`Mana Cost: ${chalk.white(card.manaCost)}`));
            console.log(chalk.green.bold(`Color: ${chalk.hex(colorCode)(card.color)}`));
            console.log(chalk.green.bold(`Card Type: ${chalk.white(card.cardType)}`));
            console.log(chalk.green.bold(`Rarity: ${chalk.white(card.rarity)}`));
            console.log(chalk.green.bold(`Rules Text: ${chalk.white(card.rulesText)}`));
            console.log(chalk.green.bold(`Market Price: ${chalk.white(card.marketPrice)}`));
            if (card.cardType === 'Criatura') {
                console.log(chalk.green.bold(`Strength: ${chalk.blue(card.strength)}`));
                console.log(chalk.green.bold(`Resistance: ${chalk.blue(card.resistance)}`));
            } else if (card.cardType === 'Planeswalker') {
            console.log(chalk.green.bold(`Loyalty: ${chalk.blue(card.loyalty)}`));
    }
            
            console.log('\n');
        });
    }
});

// Manejo de eventos de cierre de conexión del cliente
client.on('close', () => {
    console.log(chalk.red('\nConnection finished'));
});

// Parseo de argumentos de la línea de comandos
yargs(hideBin(process.argv))
    .command('add', 'Añade una carta', (yargs) => {
        return yargs.options({
            'user': { demandOption: true, describe: 'Nombre de usuario', type: 'string' },
            'id': { demandOption: true, describe: 'ID de la carta', type: 'number' },
            'name': { demandOption: true, describe: 'Nombre de la carta', type: 'string' },
            'manaCost': { demandOption: true, describe: 'Costo de maná', type: 'string' },
            'color': { demandOption: true, describe: 'Color de la carta', type: 'string' },
            'lineType': { demandOption: true, describe: 'Tipo de carta', type: 'string' },
            'rarity': { demandOption: true, describe: 'Rareza de la carta', type: 'string' },
            'rulesText': { demandOption: true, describe: 'Texto de las reglas', type: 'string' },
            'marketPrice': { demandOption: true, describe: 'Precio de mercado', type: 'number' },
            'strength': { describe: 'Fuerza de la criatura', type: 'number' }, // Nuevo campo para criaturas
            'resistance': { describe: 'Resistencia de la criatura', type: 'number' } // Nuevo campo para criaturas
        });
    })
    .command('update', 'Actualiza una carta', (yargs) => {
        return yargs.options({
            'user': { demandOption: true, describe: 'Nombre de usuario', type: 'string' },
            'id': { demandOption: true, describe: 'ID de la carta', type: 'number' },
            'name': { describe: 'Nuevo nombre de la carta', type: 'string' },
            'manaCost': { describe: 'Nuevo costo de maná', type: 'string' },
            'color': { describe: 'Nuevo color de la carta', type: 'string' },
            'lineType': { describe: 'Nuevo tipo de carta', type: 'string' },
            'rarity': { describe: 'Nueva rareza de la carta', type: 'string' },
            'rulesText': { describe: 'Nuevo texto de las reglas', type: 'string' },
            'marketPrice': { describe: 'Nuevo precio de mercado', type: 'number' },
            'strength': { describe: 'Nueva fuerza de la criatura', type: 'number' }, // Nuevo campo para criaturas
            'resistance': { describe: 'Nueva resistencia de la criatura', type: 'number' } // Nuevo campo para criaturas
        });
    })
    .command('remove', 'Elimina una carta', (yargs) => {
        return yargs.options({
            'user': { demandOption: true, describe: 'Nombre de usuario', type: 'string' },
            'id': { demandOption: true, describe: 'ID de la carta', type: 'number' }
        });
    })
    .command('list', 'Lista todas las cartas', (yargs) => {
        return yargs.options({
            'user': { demandOption: true, describe: 'Nombre de usuario', type: 'string' }
        });
    })
    .command('read', 'Lee una carta', (yargs) => {
        return yargs.options({
            'user': { demandOption: true, describe: 'Nombre de usuario', type: 'string' },
            'id': { demandOption: true, describe: 'ID de la carta', type: 'number' }
        });
    })
    .parseAsync() // Parsea los argumentos como una promesa
    .then(argv => {
        // Lógica para enviar solicitudes al servidor según los argumentos de la línea de comandos
        let operation = 'add'; // Por defecto, la operación es 'add'
        let cardData = {
            id: argv.id,
            name: argv.name,
            manaCost: argv.manaCost,
            color: argv.color,
            lineType: argv.lineType,
            rarity: argv.rarity,
            rulesText: argv.rulesText,
            marketPrice: argv.marketPrice,
            // Verifica si la carta es de tipo Criatura y agrega strength y resistance
            ...(argv.lineType === 'Criatura' && { strength: argv.strength, resistance: argv.resistance })
        };

        if (process.argv[2] === 'update') {
            operation = 'update';
            // Solo incluir los campos que han sido modificados
            cardData = {
                ...cardData,
                ...(argv.name ? { name: argv.name } : {}),
                ...(argv.manaCost ? { manaCost: argv.manaCost } : {}),
                ...(argv.color ? { color: argv.color } : {}),
                ...(argv.lineType ? { lineType: argv.lineType } : {}),
                ...(argv.rarity ? { rarity: argv.rarity } : {}),
                ...(argv.rulesText ? { rulesText: argv.rulesText } : {}),
                ...(argv.marketPrice ? { marketPrice: argv.marketPrice } : {}),
                // Verifica si la carta es de tipo Criatura y agrega strength y resistance
                ...(argv.lineType === 'Criatura' && {
                    ...(argv.strength ? { strength: argv.strength } : {}),
                    ...(argv.resistance ? { resistance: argv.resistance } : {})
                })
            };
        } else if (process.argv[2] === 'remove') {
            operation = 'remove';

        } else if (process.argv[2] === 'list') {
            operation = 'list';

        } else if (process.argv[2] === 'read') {
            operation = 'read';
        }

        const requestData = {
            operation: operation,
            user: argv.user,
            card: cardData
        };
        client.write(JSON.stringify(requestData));
    })
    .catch(error => {
        console.error(chalk.red('Error al parsear argumentos:'), error);
    });

    function getColorCode(color: string): string {
        switch (color.toLowerCase()) {
            case 'blanco':
                return '#FFFFFF';
            case 'azul':
                return '#0000FF';
            case 'negro':
                return '#000000';
            case 'rojo':
                return '#FF0000';
            case 'verde':
                return '#00FF00';
            case 'incoloro':
                return '#999999';
            case 'multicolor':
                return '#ee82ee';
            default:
                return '#000000';
        }
    }