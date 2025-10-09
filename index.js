// Aunque en general trato de trabajar en inglés, dado el carácter de estas anotaciones, voy a usar mi idioma preferido

//Importaciones necesarias para que funcione este programa

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

//Esto es simplemente un mensaje formateado de explicación

console.log(chalk.blue.bold('\n Bienvenido al Analizador de Recursos Gráficos(ARG) de Daemon Studios \n'));
console.log('Este proyecto ha sido diseñado para ayudarte a analizar carpetas llenas de recursos gráficos.');
console.log('Simplemente ' + chalk.cyan('introduce una ruta a una carpeta') + ', y el sistema hará el resto.\n');
console.log('Detectaremos imágenes, íconos u otros elementos que pueden necesitar optimización.\n ');
console.log('Los recursos que ya están optimizados' + chalk.green.bold(' se mostrarán en verde.'));
console.log('Los recursos que recomendamos que sean optimizados' + chalk.red.yellow(' se mostrarán de color amarillo.'));
console.log('Los recursos que necesitan ser optimizados' + chalk.red.bold(' se mostrarán claramente en rojo.\n'));
console.log(chalk.blue.bold('RECUERDA mantener tus recursos optimizados para mejorar el rendimiento de tu proyecto.\n'));
console.log('¡Listo para comenzar! \n');

//Declaramos una función asíncrona encargada de pedir la ruta a analizar por terminal
const askDirectory = async() => {

//Con el paquete inquirer podemos lanzar texto por terminal y recibir respuestas. 
//Usamos await ya que es una operación asíncrona
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'directoryPath',
            message: chalk.cyan.bold('¿Cuál es la ruta que quieres analizar?'),
            default: './fotosDePrueba',
        }
    ]);
// Devolvemos la ruta introducida, o la ruta por defecto si no se ha escrito nada.
    return answer.directoryPath;
};
//Con un bloque try, lanzamos otra o. asíncrona que analice el directorio
const analyzeDirectory = async() => {

try {
// Llamamos a askdirectory y guardamos la ruta
        const directoryPath = await askDirectory();

// Verificamos si el directorio existe, y si no es así, mensajito formateado
        if (!fs.existsSync(directoryPath)) {
            console.log(chalk.red('El directorio no existe'));
            return;
        }
//Aquí leemos el directorio usando fs
        const files = await fs.promises.readdir(directoryPath);

// Procesamos archivos secuencialmente con un bucle for
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
//Otro try para obtener las stats (tamaño, formato, etc...)         
            try {
                const stats = await fs.promises.stat(filePath);
//Verificamos que sea un archivo (no un directorio)       
                if (stats.isFile()) {
//Coloreamos, pasamos de bytes a kb y declaramos nuestra flechita
                    let colorFunc;
                    const sizeKB = stats.size / 1024;
                    let arrow = '';
// Bucle de instrucciones if para separar en 3 categorias                    
                    if (sizeKB < 100) {
                        colorFunc = chalk.green;
                    } else if (sizeKB <= 250) {
                        colorFunc = chalk.yellow;
                    } else {
                        colorFunc = chalk.red;
                        arrow = chalk.red.bold('<---OPTIMIZAR---');
                    }
//Pintamos la lista por colores                    
                    console.log(colorFunc(`${file}\t${stats.size} bytes`) + ('  ')+(arrow ? '' + arrow : ''));
                }
//Cerramos el bucle try con catch de errores, y ya que estoy, los he pintado de rojo tb
            } catch (err) {
                console.error(chalk.red(`Error al leer: ${file}`), err);
            }
        }
//Los de antes eran errores de archivos concreto, y ahora manejamos errores generales
    } catch (err) {
        console.error(chalk.red('Error al leer archivos:'), err);
    }
};

//Ejecutamos el análisis
analyzeDirectory();
