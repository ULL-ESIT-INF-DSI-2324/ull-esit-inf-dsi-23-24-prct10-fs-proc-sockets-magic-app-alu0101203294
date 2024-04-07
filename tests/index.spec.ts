import 'mocha';
import {expect} from 'chai';
import { Color } from "../src/Magic/Enums/color.js";
import { LineType } from "../src/Magic/Enums/linetype.js";
import { Rarity } from "../src/Magic/Enums/rarity.js";
import { Card } from "../src/Magic/interfaces/card.js";
import { CardCollection } from "../src/Magic/cardmanager.js";
import { FileManager } from "../src/Magic/files.js";
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import sinon from 'sinon';


// ---------------------------------------FILEMANAGER---------------------------------------
context('FileManager', () => {
    describe('FileManager', () => {
        let fileManager: FileManager;
        const testUser = 'testUser';
        const testDir = `./src/Magic/users/${testUser}`;

        beforeEach(() => {
            fileManager = new FileManager(testUser);

            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }
        });

        afterEach(() => {
            fs.readdirSync(testDir).forEach(file => {
                fs.unlinkSync(path.join(testDir, file));
            });

            if (fs.existsSync(testDir) && fs.readdirSync(testDir).length === 0) {
                fs.rmdirSync(testDir);
            }
        });

        it('getUserDir should return correct user directory', () => {
            expect(fileManager.getUserDir()).to.equal(testDir);
        });

        it('load should load the collection correctly from existing files', () => {
            fs.writeFileSync(path.join(testDir, 'card_1.json'), JSON.stringify({ id: 1, name: 'Test Card 1' }));
            fs.writeFileSync(path.join(testDir, 'card_2.json'), JSON.stringify({ id: 2, name: 'Test Card 2' }));

            const loadedCollection = fileManager.load();
            expect(loadedCollection.size).to.equal(2);
            expect(loadedCollection.get(1)?.name).to.equal('Test Card 1');
            expect(loadedCollection.get(2)?.name).to.equal('Test Card 2');
        });

        it('save should save the collection correctly to files', () => {
            const collection = new Map<number, Card>();
            collection.set(1, { id: 1, name: 'Test Card 1' } as Card);
            collection.set(2, { id: 2, name: 'Test Card 2' } as Card);
            fs.rmdirSync(testDir, { recursive: true });
            fileManager.save(collection);

            expect(fs.existsSync(path.join(testDir, 'card_1.json'))).to.be.true;
            expect(fs.existsSync(path.join(testDir, 'card_2.json'))).to.be.true;
            expect(fs.existsSync(testDir)).to.be.true;
        });
    });
});


// ---------------------------------------CARDMANAGER---------------------------------------

context('CardManager', () => {
    describe('CardCollection', () => {
        let cardCollection: CardCollection;
        beforeEach(() => {
            cardCollection = new CardCollection('testUser');
        });

        it('should add a new card correctly', () => {
            const newCard: Card = {
                id: 1,
                name: 'Test Card',
                manaCost: 2,
                color: Color.Azul,
                cardType: LineType.Encantamiento,
                rarity: Rarity.Rara,
                rulesText: 'Test rules',
                marketPrice: 10
            };
            cardCollection.addCard(newCard);
            expect(cardCollection['collection'].length).to.equal(1);
            expect(cardCollection['collection'][0]).to.deep.equal(newCard);
        });

        it('should remove a card correctly', () => {
            const cardToAdd = {
                id: 1,
                name: 'Test Card',
                manaCost: 2,
                color: Color.Azul,
                cardType: LineType.Encantamiento,
                rarity: Rarity.Rara,
                rulesText: 'Test rules',
                marketPrice: 10
            };
            cardCollection.addCard(cardToAdd);

            expect(cardCollection['collection']).to.have.lengthOf(1);

            cardCollection.removeCard(1);

            expect(cardCollection['collection']).to.have.lengthOf(0);
        });

        it('should read a specific card correctly', () => {
            const cardToRead: Card = {
                id: 1,
                name: 'Test Card',
                manaCost: 2,
                color: Color.Azul,
                cardType: LineType.Encantamiento,
                rarity: Rarity.Rara,
                rulesText: 'Test rules',
                marketPrice: 10
            };
            cardCollection['collection'].push(cardToRead);

            const logSpy = console.log = () => {};
            cardCollection.readCard(1);
            expect(logSpy).to.not.throw;
        });

        it('should list cards correctly', () => {
            const cardCollection = new CardCollection('testUser');
            const card1: Card = {
                id: 1,
                name: 'Test Card 1',
                manaCost: 2,
                color: Color.Azul,
                cardType: LineType.Encantamiento,
                rarity: Rarity.Rara,
                rulesText: 'Test rules 1',
                marketPrice: 10
            };
            const card2: Card = {
                id: 2,
                name: 'Test Card 2',
                manaCost: 3,
                color: Color.Rojo,
                cardType: LineType.Criatura,
                rarity: Rarity.Mítica,
                rulesText: 'Test rules 2',
                marketPrice: 15,
                strength: 4,
                resistance: 3
            };

            cardCollection.addCard(card1);
            cardCollection.addCard(card2);
    
            const consoleOutput = captureConsoleOutput(() => {
                cardCollection.listCards();
            });
    
            const cleanedOutput = consoleOutput.replace(/\x1b\[[0-9;]*m/g, '');

            expect(cleanedOutput).to.include('Listing cards in the collection:');
            expect(cleanedOutput).to.include('ID: 1');
            expect(cleanedOutput).to.include('Name: Test Card 1');
            expect(cleanedOutput).to.include('Mana Cost: 2');
            expect(cleanedOutput).to.include('Color: Azul');
            expect(cleanedOutput).to.include('Card Type: Encantamiento');
            expect(cleanedOutput).to.include('Rarity: Rara');
            expect(cleanedOutput).to.include('Rules Text: Test rules 1');
            expect(cleanedOutput).to.include('Market Price: 10');
            expect(cleanedOutput).to.include('ID: 2');
            expect(cleanedOutput).to.include('Name: Test Card 2');
            expect(cleanedOutput).to.include('Mana Cost: 3');
            expect(cleanedOutput).to.include('Color: Rojo');
            expect(cleanedOutput).to.include('Card Type: Criatura');
            expect(cleanedOutput).to.include('Rarity: Mítica');
            expect(cleanedOutput).to.include('Rules Text: Test rules 2');
            expect(cleanedOutput).to.include('Market Price: 15');
            expect(cleanedOutput).to.include('Strength: 4');
            expect(cleanedOutput).to.include('Resistance: 3');
        });
    });

    it('should update a card correctly', () => {
        const cardCollection = new CardCollection('testUser');
        const newCard: Card = {
            id: 99,
            name: 'New Test Card',
            manaCost: 2,
            color: Color.Azul,
            cardType: LineType.Encantamiento,
            rarity: Rarity.Rara,
            rulesText: 'Test rules',
            marketPrice: 10
        };
        cardCollection.addCard(newCard);
        
        expect(cardCollection['collection'].find(card => card.id === newCard.id)).to.deep.equal(newCard);

        const updatedDescription = 'Updated description';
        const updatedCard: Card = {
            id: 99,
            name: 'New Test Card',
            manaCost: 2,
            color: Color.Azul,
            cardType: LineType.Encantamiento,
            rarity: Rarity.Rara,
            rulesText: updatedDescription,
            marketPrice: 10
        };
        cardCollection.updateCard(updatedCard);
        
        const updatedCardInCollection = cardCollection['collection'].find(card => card.id === updatedCard.id);
        expect(updatedCardInCollection?.rulesText).to.equal(updatedDescription);
        
        cardCollection.removeCard(99);
        
        expect(cardCollection['collection'].find(card => card.id === newCard.id)).to.be.undefined;
    });


});

// Función para capturar salida de consola
function captureConsoleOutput(callback: () => void): string {
    const log = console.log;
    const buffer: string[] = [];
    console.log = (message: any) => {
        buffer.push(message);
    };
    callback();
    console.log = log;
    return buffer.join('\n');
}