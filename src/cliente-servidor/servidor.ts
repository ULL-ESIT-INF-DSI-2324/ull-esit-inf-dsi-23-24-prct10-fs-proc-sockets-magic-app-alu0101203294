/* eslint-disable @typescript-eslint/no-explicit-any */
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { CardCollection } from '../Magic/cardmanager.js';

// Puerto en el que el servidor escuchará las conexiones
const PORT = 3000;

/**
 * Crea y configura un servidor para manejar las solicitudes de clientes.
 * @param {net.Socket} socket - El socket conectado al cliente.
 */
const server = net.createServer(socket => {
    console.log('Cliente conectado.');

    // Manejo de eventos de datos del socket
    socket.on('data', data => {
        const requestData = JSON.parse(data.toString());
        console.log('Mensaje recibido:', requestData);

        // Eliminar el campo 'user' del JSON de la carta
        const cardData = { ...requestData.card }; // Copiar los datos de la carta
        delete cardData.user; // Eliminar el campo 'user' del JSON de la carta

        // Crear una instancia de CardCollection con el nombre de usuario adecuado
        const cardCollection = new CardCollection(requestData.user);

        // Lógica para manejar las diferentes operaciones solicitadas por el cliente
        let responseData: any;

        switch (requestData.operation) {
            case 'add':{
        // Verificar si el directorio del usuario existe, si no, crearlo
        if (!fs.existsSync(path.join('./src/Magic/users/', requestData.user))) {
            fs.mkdirSync(path.join('./src/Magic/users/', requestData.user), { recursive: true });
        }
        const existingCard = cardCollection.findCardById(cardData.id);
        if (existingCard) {
            responseData = { message: chalk.red('The card with this ID already exists in the collection.') };
        } else {
            cardCollection.addCard(cardData);
            responseData = { message: chalk.green('The card has been added successfully') };
        }}
        break;
    case 'update':{
        // Verificar si el usuario existe
        if (!fs.existsSync(path.join('./src/Magic/users/', requestData.user))) {
            responseData = { message: chalk.red('The user does not exist or cannot be found') };
            break;
        }
        const updated = cardCollection.updateCard(requestData.card);
        if (updated) {
            responseData = { message: chalk.bold.green('The card has been successfully updated!') };
        } else {
            responseData = { message: chalk.bold.red('Card not found in the collection.') };
        }}
        break;
    case 'remove':{
        // Verificar si el usuario existe
        if (!fs.existsSync(path.join('./src/Magic/users/', requestData.user))) {
            responseData = { message: chalk.red('The user does not exist or cannot be found') };
            break;
        }
        const removed = cardCollection.removeCard(requestData.card.id);
        if (removed) {
            responseData = { message: chalk.bold.green('The card has been successfully removed') };
        } else {
            responseData = { message: chalk.bold.red('The card you want to delete has not been found') };
        }}
        break;
    case 'list':{
        // Verificar si el usuario existe
        if (!fs.existsSync(path.join('./src/Magic/users/', requestData.user))) {
            responseData = { message: chalk.red('The user does not exist or cannot be found') };
            break;
        }
        const cards = cardCollection.listCards();
        if (cards.length > 0) {
            // Envía los datos de las cartas al cliente
            sendResponse(socket, { cards });
        } else {
            // Si no hay cartas, envía un mensaje de error
            sendResponse(socket, { error: 'No cards found in the collection.' });
        }}
        break;
    case 'read':{
        // Verificar si el usuario existe
        if (!fs.existsSync(path.join('./src/Magic/users/', requestData.user))) {
            responseData = { message: chalk.red('The user does not exist or cannot be found') };
            break;
        }
        const foundCard = cardCollection.findCardById(requestData.card.id);
        console.log(foundCard);
        if (foundCard) {
            // Enviar la carta encontrada al cliente dentro de un objeto JSON
            sendResponse(socket, { card: foundCard });
        } else {
            // Enviar un mensaje de error al cliente
            sendResponse(socket, { message: chalk.bold.red('Card not found in the collection.') });
        }}
        break;
            default:
                responseData = { error: 'Invalid operation.' };
        }

        // Enviar respuesta al cliente
        sendResponse(socket, responseData);

        // Cerrar la conexión una vez que se haya completado la consulta
        socket.end();
    });

    // Manejo del evento de cierre de la conexión
    socket.on('close', () => {
        console.log('Cliente desconectado.');
    });

    /**
     * Envia una respuesta al cliente.
     * @param {net.Socket} socket - El socket conectado al cliente.
     * @param {any} responseData - Los datos de respuesta para enviar al cliente.
     * @returns {void}
     */
    function sendResponse(socket: net.Socket, responseData: any): void {
        if (responseData !== undefined) {
            const responseDataString = JSON.stringify(responseData);
            socket.write(responseDataString);
        } else {
            //console.error('Response data is undefined');
        }
    }
});

// Manejo de errores del servidor
server.on('error', err => {
    console.error('Error en el servidor:', err);
});

// Inicio del servidor en el puerto especificado
server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});