import 'mocha';
import {expect} from 'chai';
import { CSVProcesador, JSONProcesador } from "../src/Modificacion/mod.js";

describe('CSVProcesador', () => {
  it('debería procesar correctamente un archivo CSV', () => {
    const csvProcesador = new CSVProcesador();
    const csvResultados = csvProcesador.procesar();
    expect(csvResultados.beneficios).to.deep.equal([5, 7, 10]);
    expect(csvResultados.pesos).to.deep.equal([2, 3, 4]);
  });
});

describe('JSONProcesador', () => {
  it('debería procesar correctamente un archivo JSON', () => {
    const jsonProcesador = new JSONProcesador();
    const jsonResultados = jsonProcesador.procesar();
    expect(jsonResultados.beneficios).to.deep.equal([5, 7, 10]);
    expect(jsonResultados.pesos).to.deep.equal([2, 3, 4]);
  });
});