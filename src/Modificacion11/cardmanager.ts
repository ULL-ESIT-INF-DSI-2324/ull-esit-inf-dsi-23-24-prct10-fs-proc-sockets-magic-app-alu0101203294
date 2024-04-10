import * as fs from 'fs';
import chalk from 'chalk';
import { Card } from '../Modificacion11/interfaces/card.js';
import { FileManager } from '../Modificacion11/files.js';
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
        this.file.load((error, collection) => {
            if (error) {
                console.error(`Error loading card collection: ${error}`);
            } else {
                this.collection = Array.from(collection.values());
            }
        });
    }

    /**
     * Método que añade una carta
     * @param newCard 
     * @returns
     */
    public addCard(newCard: Card, callback: (error: Error | null) => void): void {
        if (!newCard.color) {
            callback(new Error('The card color is missing.'));
            return;
        }

        if (this.collection.some(card => card.id === newCard.id)) {
            callback(new Error('The card with this ID already exists in the collection.'));
            return;
        }

        this.collection.push(newCard);

        this.file.save(new Map(this.collection.map(card => [card.id, card])), (error) => {
            if (error) {
                callback(error);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Método que actualiza una carta de la colección.
     * @param updatedCard 
     * @returns  Retorna una carta actualizada.
     * 
     */
    public updateCard(updatedCard: Card, callback: (error: Error | null) => void): void {
        const index = this.collection.findIndex(card => card.id === updatedCard.id);
        console.log('Updated card ID:', updatedCard.id);
        console.log('Collection:', this.collection.map(card => card.id));
        if (index !== -1) {
            this.collection[index] = updatedCard;
            this.file.save(new Map(this.collection.map(card => [card.id, card])), (error) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null);
                }
            });
        } else {
            console.log('Card not found in the collection.');
            callback(new Error('Card not found in the collection.'));
        }
    }
     
    /**
     * Método que elimina una carta de la colección.
     * @param cardId 
     * @returns Retorna una carta eliminada.
     * 
     */
    public removeCard(cardId: number, callback: (success: boolean) => void): void {
        const filePath = this.file.getFilePath(cardId);
    
        fs.unlink(filePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log(`The card file with ID ${cardId} was not found.`);
                } else {
                    console.error(`Error removing card file with ID ${cardId}: ${err}`);
                }
                callback(false);
                return;
            }
    
            //console.log(`The card file with ID ${cardId} has been deleted.`);
    
            const initialLength = this.collection.length;
            this.collection = this.collection.filter(card => card.id !== cardId);
    
            if (this.collection.length < initialLength) {
                this.file.save(new Map(this.collection.map(card => [card.id, card])), (error) => {
                    if (error) {
                        console.error(`Error saving card collection: ${error}`);
                        callback(false);
                    } else {
                        console.log(chalk.green('Card removed successfully.'));
                        callback(true);
                    }
                });
            } else {
                console.log('Card not found in the collection.');
                callback(false);
            }
        });
    }

    /**
     * Método que lista las cartas de la colección.
     * @returns Retorna una lista de cartas.
     * 
     */
    public listCards(): Card[] {
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
        return this.collection;
    }
    
    /**
     * Método que lee una carta de la colección.
     * @param cardId  
     * @returns Retorna una carta leida.
     * 
     */
    public readCard(cardId: number): Card | undefined {
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
            
            return card;
        } else {
            console.log(chalk.yellow('Card not found in the collection.'));
            return undefined;
        }
    }

    public findCardById(cardId: number): Card | undefined {
        return this.collection.find(card => card.id === cardId);
    }

    
}
