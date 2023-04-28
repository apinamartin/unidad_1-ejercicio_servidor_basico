const http = require('http')
const https = require('https')

const fetchPokemonData = async () => {
    return new Promise((resolve, reject) => {
        https.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json', (res) => {
            let data = ''

            res.on('data', (chunk) => {
                // console.log(data) 
                data += chunk
            })

            res.on('end', () => {
                resolve(JSON.parse(data))
            })

        }).on('error', (err) => {
            reject(err)
        })
    })
}

const handleRequest = async (req, res) => {
    const pokemonName = decodeURI(req.url.substring(1)).toLowerCase()
    const pokedexData = await fetchPokemonData()

    const pokemonData = pokedexData.find(pokemon => pokemon.name.english.toLowerCase() === pokemonName || 
        pokemon.name.japanese === pokemonName ||
        pokemon.name.chinese === pokemonName ||
        pokemon.name.french.toLowerCase() === pokemonName ||
        pokemon.id.toString() === pokemonName)

    if (pokemonData) {
        const response = {
            'Tipo': pokemonData.type,
            'HP': pokemonData.base.HP,
            'Attack': pokemonData.base.Attack,
            'Defense': pokemonData.base.Defense,
            'Sp. Attack': pokemonData.base['Sp. Attack'],
            'Sp. Defense': pokemonData.base['Sp. Defense'],
            'Speed': pokemonData.base.Speed,
            'Base Total': pokemonData.base.HP + pokemonData.base.Attack + 
            pokemonData.base.Defense + pokemonData.base['Sp. Attack'] + 
            pokemonData.base['Sp. Defense'] + pokemonData.base.Speed
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response, null, 2))
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Pokémon no encontrado')
    }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
})
