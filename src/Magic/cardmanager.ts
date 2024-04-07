import * as fs from 'fs';
import chalk from 'chalk';
import { Card } from '../Magic/interfaces/card.js';
import { FileManager } from '../Magic/files.js';
/**
 * Clase que se encarga de manejar las colecciones de cartas.
 * @class CardCollection Clase que se encarga de manejar las colecciones de cartas.
 * @param user Nombre de usuario.
 * @returns Retorna una colección de cartas.
 * @constructor
 * @function getColor Retorna el color de la carta.
 * @function loadc Carga las cartas del usuario.
 * @function addCard Agrega una carta a la colección.
 * @function updateCard Actualiza una carta de la colección.
 * @function removeCard Elimina una carta de la colección.
 * @function listCards Lista las cartas de la colección.
 * @function readCard Lee una carta de la colección.
 * 
 */
export class CardCollection {

    private collection: Card[] = [];
    private user: string;
    private file: FileManager;

    constructor(user: string) {
        this.user = user;
        this.file = new FileManager(user);
        this.loadc();
    }

    /**
     * Método que retorna el color de la carta.
     * @param color Color de la carta.
     * @returns Retorna el color de la carta.
     * 
     */
    getColor(color: string): string {
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

    /**
     * Método que carga una coleccion de cartas
     */
    private loadc(): void {
        this.collection = Array.from(this.file.load().values());
    }

    /**
     * Método que añade una carta
     * @param newCard 
     * @returns
     */
    public addCard(newCard: Card): void {
        if (!newCard.color) {
            console.log(chalk.yellow('The card color is missing.'));
            return;
        }

        if (this.collection.some(card => card.id === newCard.id)) {
            console.log(chalk.yellow('The card with this ID already exists in the collection.'));
            return;
        }
        this.collection.push(newCard);
    
        this.file.save(new Map(this.collection.map(card => [card.id, card])));
    
        console.log(chalk.green('Card added successfully.'));
    }

    /**
     * Método que actualiza una carta de la colección.
     * @param updatedCard 
     * @returns  Retorna una carta actualizada.
     * 
     */
    public updateCard(updatedCard: Card): void {
        const index = this.collection.findIndex(card => card.id === updatedCard.id);
        if (index !== -1) {
            this.collection[index] = updatedCard;
            this.file.save(new Map(this.collection.map(card => [card.id, card])));
            console.log(chalk.green('Card updated successfully.'));
        } else {
            console.log(chalk.yellow('Card not found in the collection.'));
        }
    }
     
    /**
     * Método que elimina una carta de la colección.
     * @param cardId 
     * @returns Retorna una carta eliminada.
     * 
     */
    public removeCard(cardId: number): void {
        const filePath = this.file.getFilePath(cardId);
        try {
            fs.unlinkSync(filePath);
            console.log(`The card file with ID ${cardId} has been deleted.`);
        } catch (err) {
            console.error(`Error deleting card file with ID ${cardId}: ${err}`);
        }

        this.collection = this.collection.filter(card => card.id !== cardId);
    
        this.file.save(new Map(this.collection.map(card => [card.id, card])));
    }

    /**
     * Método que lista las cartas de la colección.
     * @returns Retorna una lista de cartas.
     * 
     */
    public listCards(): void {
        console.log(chalk.blue('Listing cards in the collection:'));
    
        this.collection.forEach(card => {
            const colorCode = this.getColor(card.color);
            console.log(chalk.yellow.bold(`ID: ${chalk.white(card.id)}`));
            console.log(chalk.green.bold(`Name: ${chalk.white(card.name)}`));
            console.log(chalk.green.bold(`Mana Cost: ${chalk.white(card.manaCost)}`));
            console.log(chalk.green.bold(`Color: ${chalk.hex(colorCode)(card.color)}`));
            console.log(chalk.green.bold(`Card Type: ${chalk.white(card.cardType)}`));
            console.log(chalk.green.bold(`Rarity: ${chalk.white(card.rarity)}`));
            console.log(chalk.green.bold(`Rules Text: ${chalk.white(card.rulesText)}`));
            console.log(chalk.green.bold(`Market Price: ${chalk.white(card.marketPrice)}`));
            if (card.cardType === 'Criatura') {
                console.log(chalk.green.bold(`Strength: ${chalk.white(card.strength)}`));
                console.log(chalk.green.bold(`Resistance: ${chalk.white(card.resistance)}`));
            } else if (card.cardType === 'Planeswalker') {
                console.log(chalk.green.bold(`Loyalty: ${chalk.white(card.loyalty)}`));
            }
    
            console.log('\n');
        });
    }
    
    /**
     * Método que lee una carta de la colección.
     * @param cardId  
     * @returns Retorna una carta leida.
     * 
     */
    public readCard(cardId: number): void {
        const card = this.collection.find(card => card.id === cardId);
        
        if (card) {
            const colorCode = this.getColor(card.color);
            console.log(chalk.blue('Card details:'));
            console.log(chalk.green.bold(`ID: ${chalk.white(card.id)}`));
            console.log(chalk.green.bold(`Name: ${chalk.white(card.name)}`));
            console.log(chalk.green.bold(`Mana Cost: ${chalk.white(card.manaCost)}`));
            console.log(chalk.green.bold(`Color: ${chalk.hex(colorCode)(card.color)}`));
            console.log(chalk.green.bold(`Card Type: ${chalk.white(card.cardType)}`));
            console.log(chalk.green.bold(`Rarity: ${chalk.white(card.rarity)}`));
            console.log(chalk.green.bold(`Rules Text: ${chalk.white(card.rulesText)}`));
            console.log(chalk.green.bold(`Market Price: ${chalk.white(card.marketPrice)}`));
            if (card.cardType === 'Criatura') {
                console.log(chalk.green.bold(`Strength: ${chalk.white(card.strength)}`));
                console.log(chalk.green.bold(`Resistance: ${chalk.white(card.resistance)}`));
            } else if (card.cardType === 'Planeswalker') {
                console.log(chalk.green.bold(`Loyalty: ${chalk.white(card.loyalty)}`));
            }
        } else {
            console.log(chalk.yellow('Card not found in the collection.'));
        }
    }

    
}