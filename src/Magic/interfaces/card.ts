import { Color } from "../Enums/color.js";
import { LineType } from "../Enums/linetype.js";
import { Rarity } from "../Enums/rarity.js";

/**
 * Interfaz que representa una carta en el juego.
 * @param id Identificador de la carta.
 * @param name Nombre de la carta.
 * @param manaCost Coste de maná de la carta.
 * @param color Color de la carta.
 * @param cardType Tipo de carta.
 * @param rarity Rareza de la carta.
 * @param rulesText Texto de reglas de la carta.
 * @param strength Fuerza de la carta.
 * @param resistance Resistencia de la carta.
 * @param loyalty Lealtad de la carta.
 * @param marketPrice Precio de mercado de la carta.
 * @returns Retorna una carta.
 */
export interface Card {
  id: number;
  name: string;
  manaCost: number;
  color: Color;
  cardType: LineType;
  rarity: Rarity;
  rulesText: string;
  strength?: number; //  Type Criatura
  resistance?: number; // Type Criatura
  loyalty?: number; // Type Planeswalker
  marketPrice: number;
}