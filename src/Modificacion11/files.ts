import fs from 'fs';
import { Card } from '../Modificacion11/interfaces/card.js';
import * as path from 'path';

/**
 * Clase que se encarga de manejar los archivos de las cartas.
 * @class FileManager Clase que se encarga de manejar los archivos de las cartas.
 * @param username Nombre de usuario.
 * @returns Retorna un manejador de archivos.
 * @constructor
 * @function getUserDir Retorna el directorio del usuario.
 * @function getFilePath Retorna la ruta de un archivo.
 * @function load Carga las cartas del usuario.
 * @function save Guarda las cartas del usuario.
 * 
 */
export class FileManager {
  private readonly userDir: string;

  constructor(private username: string) {
    this.userDir = `./src/Modificacion11/users/${username}`;
  }

  /**
   * Método que retorna el directorio del usuario.
   * @returns Retorna el directorio del usuario.
   */
  public getUserDir(): string {
    return this.userDir;
  }

  /**
   * Método que retorna la ruta de un archivo.
   * @param cardId Identificador de la carta.
   * @returns Retorna la ruta de un archivo.
   */
  public getFilePath(cardId: number): string {
    return path.join(this.userDir, `card_${cardId}.json`);
  }

  /**
   * Método que carga las cartas del usuario.
   * @param username Nombre de usuario.
   * @returns Retorna un mapa con las cartas del usuario.
   */
  public load(callback: (error: NodeJS.ErrnoException | null, collection: Map<number, Card>) => void): void {
    const collection = new Map<number, Card>();
    let loadedCount = 0;
  
    if (fs.existsSync(this.userDir)) {
      fs.readdir(this.userDir, (err, files) => {
        if (err) {
          callback(err, collection);
          return;
        }
  
        if (files.length === 0) {
          callback(null, collection);
          return;
        }
  
        for (const file of files) {
          fs.readFile(path.resolve(this.userDir, file), 'utf-8', (err, data) => {
            if (err) {
              callback(err, collection);
              return;
            }
            const card = JSON.parse(data) as Card;
            collection.set(card.id, card);
            loadedCount++;
  
            if (loadedCount === files.length) {
              callback(null, collection);
            }
          });
        }
      });
    } else {
      callback(null, collection);
    }
  }

  /**
   * Método que guarda las cartas del usuario.
   * @param collection 
   * @returns Retorna un mapa con las cartas del usuario.
   */
  public save(collection: Map<number, Card>, callback: (error: NodeJS.ErrnoException | null) => void): void {
    this.createDirectoryIfNotExists(() => {
      let counter = 0;
      for (const [cardId, card] of collection) {
        const filePath = this.getFilePath(cardId);
        const data = JSON.stringify(card, null, 2);
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            callback(err);
            return;
          }
          counter++;
          if (counter === collection.size) {
            callback(null);
          }
        });
      }
    });
  }

  /**
   * Método que crea un directorio si no existe.
   * @returns Retorna un directorio si no existe.
   * @private
   */
  private createDirectoryIfNotExists(callback: (error: NodeJS.ErrnoException | null) => void): void {
    fs.mkdir(this.userDir, { recursive: true }, (err) => {
      callback(err);
    });
  }
}