/**
 * Interfaz que define el comportamiento de un procesador de mochila.
 */
interface Elemento {
    numero: number;
    peso: number;
    beneficio: number;
  }
  
  /**
   * Clase abstracta que define el comportamiento de la mochila.
   * Esta clase define el algoritmo general para procesar los datos de la mochila.
   */
  abstract class ProcesadorMochila {
    abstract leerArchivo(): string;
    abstract parsearDatos(datos: string): { capacidad: number; elementos: Elemento[] };
    abstract extraerBeneficiosYPesos(elementos: Elemento[]): { beneficios: number[]; pesos: number[] };
  
    /**
     * 
     * Metodo que procesa los datos de la mochila.
     * @returns Un objeto con los beneficios y pesos de los elementos de la mochila.
     */
    procesar(): { beneficios: number[]; pesos: number[] } {
      const datos = this.leerArchivo();
      const { capacidad, elementos } = this.parsearDatos(datos);
      const { beneficios, pesos } = this.extraerBeneficiosYPesos(elementos);
      return { beneficios, pesos };
    }
  }
  
  /**
   * Clase que implementa el procesamiento de un archivo CSV.
   * Esta clase implementa los métodos abstractos de la clase ProcesadorMochila.
   */
  export class CSVProcesador extends ProcesadorMochila {
    leerArchivo(): string {
      // LECTURA SIMULADA CSV
      return "10\n3\n1,2,5\n2,3,7\n3,4,10";
    }
  
    /**
     * Metodo que parsea los datos de la mochila.
     * @param datos // Datos en formato CSV
     * @return // Un objeto con la capacidad y los elementos de la mochila.
     */
    parsearDatos(datos: string): { capacidad: number; elementos: Elemento[] } {
      const lineas = datos.split("\n");
      const capacidad = parseInt(lineas[0]);
      const elementos: Elemento[] = [];
  
      for (let i = 2; i < lineas.length; i++) {
        const [numero, peso, beneficio] = lineas[i].split(",").map(Number);
        elementos.push({ numero, peso, beneficio });
      }
  
      return { capacidad, elementos };
    }
  
    /**
     * Metodo que extrae los beneficios y pesos de los elementos de la mochila.
     * @param elementos // Elementos de la mochila
     * @returns // Un objeto con los beneficios y pesos de los elementos de la mochila.
     */
    extraerBeneficiosYPesos(elementos: Elemento[]): { beneficios: number[]; pesos: number[] } {
      const beneficios = elementos.map(elemento => elemento.beneficio);
      const pesos = elementos.map(elemento => elemento.peso);
      return { beneficios, pesos };
    }
  }
  

  /**
   * Clase que implementa el procesamiento de un archivo JSON.
   * @param datos // Datos en formato JSON
   * @return // Un objeto con la capacidad y los elementos de la mochila.
   */
  export class JSONProcesador extends ProcesadorMochila {
    leerArchivo(): string {
      // LECTURA SIMULADA JSON
      return '{"capacidad": 10, "numElementos": 3, "elementos": [{"numero": 1, "peso": 2, "beneficio": 5}, {"numero": 2, "peso": 3, "beneficio": 7}, {"numero": 3, "peso": 4, "beneficio": 10}]}';
    }
  
    /**
     * Método que parsea los datos de la mochila.
     * 
     * @param datos // Datos en formato JSON
     * @returns // Un objeto con la capacidad y los elementos de la mochila.
     */
    parsearDatos(datos: string): { capacidad: number; elementos: Elemento[] } {
      const objeto = JSON.parse(datos);
      const capacidad = objeto.capacidad;
      const elementos = objeto.elementos;
      return { capacidad, elementos };
    }
  
    /**
     * Método que extrae los beneficios y pesos de los elementos de la mochila.
     * @param elementos // Elementos de la mochila
     * @returns // Un objeto con los beneficios y pesos de los elementos de la mochila.
     */
    extraerBeneficiosYPesos(elementos: Elemento[]): { beneficios: number[]; pesos: number[] } {
      const beneficios = elementos.map(elemento => elemento.beneficio);
      const pesos = elementos.map(elemento => elemento.peso);
      return { beneficios, pesos };
    }
  }
  
  // EJEMPLOS DE USO
  const csvProcesador = new CSVProcesador();
  const csvResultados = csvProcesador.procesar();
  console.log("Resultados del procesador CSV:");
  console.log("Beneficios:", csvResultados.beneficios);     // [5, 7, 10]
  console.log("Pesos:", csvResultados.pesos);               // [2, 3, 4]
  
  const jsonProcesador = new JSONProcesador();              
  const jsonResultados = jsonProcesador.procesar();
  console.log("\nResultados del procesador JSON:");
  console.log("Beneficios:", jsonResultados.beneficios);    // [5, 7, 10]
  console.log("Pesos:", jsonResultados.pesos);              // [2, 3, 4]
  