import express, { Request, Response } from 'npm:express@4.18.2';

//Definimos una interfaz para los resultados de ubicación
interface LocationResults {
  id: string | null;
  name: string | null;
  type: string | null;
  dimension: string | null;
  created: string | null;
}

//Definimos una interfaz para los resultados de personajes
interface CharacterResults {
  id: string | null;
  name: string | null;
  status: string | null;
  species: string | null;
  gender: string | null;
  origin: { name: string; url: string } | null;
  location: { name: string; url: string } | null;
  created: string | null;
}

//Definimos dos arrays para guardar los resultados de ubicaciones y personajes
let locationMemory: LocationResults[] = [];
let characterMemory: CharacterResults[] = [];

//Inciamos la app express
const app = express();

//Distintas rutas para la API
app
  .get("/personajes/pagina/:pagina", async (req: Request, res: Response) => {
    const pagina = parseInt(req.params.pagina);
    const personajes = await listaCharacter(pagina);
    res.json(personajes); 
  })
//Ruta para obtener un personaje por su id
  .get("/personajes/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const personaje = await getCharacter(id);
    res.json(personaje);
  })
//Ruta para filtrar personajes por estado
  .get("/personajes/estado/:estado", (req: Request, res: Response) => {
    const estado = req.params.estado;
    const personajes = filtrarStatusCharacter(estado);
    res.json(personajes);
  })
//Ruta para filtrar personajes por género
  .get("/personajes/genero/:genero", (req: Request, res: Response) => {
    const genero = req.params.genero;
    const personajes = filtrarGenderCharacter(genero);
    res.json(personajes);
  })
//Ruta para eliminar un personaje por su id
  .delete("/personajes/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const personajesRestantes = deleteCharacter(id);
    res.json(personajesRestantes);
  })

//Rutas para Ubicaciones
  .get("/ubicaciones/pagina/:pagina", async (req: Request, res: Response) => {
    const pagina = parseInt(req.params.pagina);
    const ubicaciones = await listaLocation(pagina);
    res.json(ubicaciones);
  })
//Ruta para obtener una ubicación por su id
  .get("/ubicaciones/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const ubicacion = await getLocation(id);
    res.json(ubicacion);
  })
//Ruta para filtrar ubicaciones por tipo
  .get("/ubicaciones/tipo/:tipo", (req: Request, res: Response) => {
    const tipo = req.params.tipo;
    const ubicaciones = filtrarTypeLocation(tipo);
    res.json(ubicaciones);
  })
//Ruta para filtrar ubicaciones por dimensión
  .get("/ubicaciones/dimension/:dimension", (req: Request, res: Response) => {
    const dimension = req.params.dimension;
    const ubicaciones = filtrarDimensionLocation(dimension);
    res.json(ubicaciones);
  })
//Ruta para eliminar una ubicación por su id
  .delete("/ubicaciones/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const ubicacionesRestantes = deleteLocation(id);
    res.json(ubicacionesRestantes);
  })
//Iniciamos el servidor en el puerto 3000
  .listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000");
  });

  
// FUNCIONES PARA INTERACTUAR CON LA API
// Funciones para personajes
const listaCharacter = async (pagina: number): Promise<string[]> => {
  const BASE_URL = "https://rickandmortyapi.com/api/character/?page=";
  const url = `${BASE_URL}${pagina}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results.map((character: CharacterResults) => character.name);
};
//Función para obtener un personaje por su id
const getCharacter = async (characterID: string): Promise<CharacterResults> => {
  const cachedCharacter = characterMemory.find((character) => character.id === characterID);
  if (cachedCharacter) return cachedCharacter;
//Si no está en la memoria, lo obtenemos de la API
  const BASE_URL = "https://rickandmortyapi.com/api/character/";
  const url = `${BASE_URL}${characterID}`;
  const response = await fetch(url);
  const character: CharacterResults = await response.json();
  characterMemory.push(character);
  return character;
};
//Función para filtrar personajes por estado
const filtrarStatusCharacter = (status: string): CharacterResults[] => {
  return characterMemory.filter((character) => character.status === status);
};
//Función para filtrar personajes por género
const filtrarGenderCharacter = (gender: string): CharacterResults[] => {
  return characterMemory.filter((character) => character.gender === gender);
};
//Función para eliminar un personaje por su id
const deleteCharacter = (characterID: string): CharacterResults[] => {
  const index = characterMemory.findIndex((character) => character.id === characterID);
  if (index > -1) characterMemory.splice(index, 1);
  return characterMemory;
};
//Funciones para ubicaciones
const listaLocation = async (pagina: number): Promise<string[]> => {
  const BASE_URL = "https://rickandmortyapi.com/api/location/?page=";
  const url = `${BASE_URL}${pagina}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results.map((location: LocationResults) => location.name);
};
//Función para obtener una ubicación por su id
const getLocation = async (locationID: string): Promise<LocationResults> => {
  const cachedLocation = locationMemory.find((location) => location.id === locationID);
  if (cachedLocation) return cachedLocation;
//Si no está en la memoria, lo obtenemos de la API
  const BASE_URL = "https://rickandmortyapi.com/api/location/";
  const url = `${BASE_URL}${locationID}`;
  const response = await fetch(url);
  const location: LocationResults = await response.json();
  locationMemory.push(location);
  return location;
};
//Función para filtrar ubicaciones por tipo
const filtrarTypeLocation = (type: string): LocationResults[] => {
  return locationMemory.filter((location) => location.type === type);
};
//Función para filtrar ubicaciones por dimensión
const filtrarDimensionLocation = (dimension: string): LocationResults[] => {
  return locationMemory.filter((location) => location.dimension === dimension);
};
//Función para eliminar una ubicación por su id
const deleteLocation = (locationID: string): LocationResults[] => {
  const index = locationMemory.findIndex((location) => location.id === locationID);
  if (index > -1) locationMemory.splice(index, 1);
  return locationMemory;
};
