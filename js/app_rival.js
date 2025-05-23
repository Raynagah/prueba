async function buscarAleatorio_rival() {
    try {
        document.getElementById('nombrePokemon_rival').textContent = 'Nombre: Cargando...';
        document.getElementById('numeroPokedex_rival').textContent = 'N. Pokédex: Cargando...';
        document.getElementById('tipoPokemon_rival').textContent = 'Tipo: Cargando...';
        document.getElementById('imgPokemon_rival').src = '';

        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
        const datos = await respuesta.json();
        const lista = datos.results;

        let pokemon = null;
        let intento = 0, maxIntentos = 10;

        while (!pokemon && intento < maxIntentos) {
            const aleatorio = lista[Math.floor(Math.random() * lista.length)];
            const respuestaPokemon = await fetch(aleatorio.url);
            const datosPokemon = await respuestaPokemon.json();

            if (datosPokemon.sprites.front_default) {
                pokemon = datosPokemon;
            }

            intento++;
        }

        if (!pokemon) throw new Error('No se pudo encontrar un Pokémon con imagen.');

        const especie = await fetch(pokemon.species.url);
        const datosEspecie = await especie.json();
        const nombreES = datosEspecie.names.find(n => n.language.name === 'es').name;

        const tipoUrl = pokemon.types[0].type.url;
        const tipoResp = await fetch(tipoUrl);
        const tipoDatos = await tipoResp.json();
        const tipoES = tipoDatos.names.find(n => n.language.name === 'es').name;

        document.getElementById('nombrePokemon_rival').textContent = `Nombre: ${nombreES}`;
        document.getElementById('numeroPokedex_rival').textContent = `N. Pokédex: #${pokemon.id}`;
        document.getElementById('tipoPokemon_rival').textContent = `Tipo: ${tipoES}`;
        document.getElementById('imgPokemon_rival').src = pokemon.sprites.front_default;

        actualizarLogoPorTipo(tipoES);

        const movimientos = pokemon.moves.map(m => m.move.url);
        const movimientosDetalles = await Promise.all(movimientos.map(url => fetch(url).then(res => res.json())));
        const movimientosES = movimientosDetalles.map(m => {
            const nombre = m.names.find(n => n.language.name === 'es');
            return nombre ? nombre.name : m.name;
        });

        movimientosES.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

        for (let i = 0; i < 4; i++) {
            const select = document.getElementById(`movimientos${i + 1}_rival`);
            select.innerHTML = '';
            movimientosES.forEach(nombreMovimiento => {
                const opcion = document.createElement('option');
                opcion.value = nombreMovimiento;
                opcion.textContent = formatearMovimiento(nombreMovimiento);
                select.appendChild(opcion);
            });
        }

    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        document.getElementById('nombrePokemon_rival').textContent = 'Error al cargar Pokémon.';
        document.getElementById('numeroPokedex_rival').textContent = '';
        document.getElementById('tipoPokemon_rival').textContent = '';
        document.getElementById('imgPokemon_rival').src = '';

        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`movimientos${i}_rival`);
            select.innerHTML = '<option>Error</option>';
        }
    }
}

function actualizarLogoPorTipo(tipo) {
    const tipoLogo = {
        'Fuego': 'img/tipoPokemon/Fuego.webp',
        'Agua': 'img/tipoPokemon/Agua.webp',
        'Planta': 'img/tipoPokemon/Planta.webp',
        'Eléctrico': 'img/tipoPokemon/Eléctrico.webp',
        'Hielo': 'img/tipoPokemon/Hielo.webp',
        'Lucha': 'img/tipoPokemon/Lucha.webp',
        'Veneno': 'img/tipoPokemon/Veneno.webp',
        'Tierra': 'img/tipoPokemon/Tierra.webp',
        'Volador': 'img/tipoPokemon/Volador.webp',
        'Psíquico': 'img/tipoPokemon/Psíquico.webp',
        'Bicho': 'img/tipoPokemon/Bicho.webp',
        'Roca': 'img/tipoPokemon/Roca.webp',
        'Fantasma': 'img/tipoPokemon/Fantasma.webp',
        'Dragón': 'img/tipoPokemon/Dragón.webp',
        'Siniestro': 'img/tipoPokemon/Siniestro.webp',
        'Acero': 'img/tipoPokemon/Acero.webp',
        'Hada': 'img/tipoPokemon/Hada.webp',
    };

    const logoPath = tipoLogo[tipo];
    const cuadro = document.querySelector('.cuadro-color_rival');
    if (cuadro) {
        if (logoPath) {
            cuadro.style.backgroundImage = `url('${logoPath}')`;
            cuadro.style.backgroundSize = 'contain';
            cuadro.style.backgroundRepeat = 'no-repeat';
        } else {
            cuadro.style.backgroundColor = '#ccc';
        }
    }
}

function formatearMovimiento(nombre) {
    return nombre
        .replace(/-/g, ' ')
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}

async function buscarPorNombreONumero_rival() {
    const input = document.getElementById('inputBusqueda_rival').value.trim().toLowerCase();
    if (!input) return;

    try {
        document.getElementById('nombrePokemon_rival').textContent = 'Nombre: Cargando...';
        document.getElementById('numeroPokedex_rival').textContent = 'N. Pokédex: Cargando...';
        document.getElementById('tipoPokemon_rival').textContent = 'Tipo: Cargando...';
        document.getElementById('imgPokemon_rival').src = '';

        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        if (!respuesta.ok) throw new Error('Pokémon no encontrado');

        const pokemon = await respuesta.json();

        const especie = await fetch(pokemon.species.url);
        const datosEspecie = await especie.json();
        const nombreES = datosEspecie.names.find(n => n.language.name === 'es')?.name || pokemon.name;

        const tipoUrl = pokemon.types[0].type.url;
        const tipoResp = await fetch(tipoUrl);
        const tipoDatos = await tipoResp.json();
        const tipoES = tipoDatos.names.find(n => n.language.name === 'es')?.name || pokemon.types[0].type.name;

        document.getElementById('nombrePokemon_rival').textContent = `Nombre: ${nombreES}`;
        document.getElementById('numeroPokedex_rival').textContent = `N. Pokédex: #${pokemon.id}`;
        document.getElementById('tipoPokemon_rival').textContent = `Tipo: ${tipoES}`;
        document.getElementById('imgPokemon_rival').src = pokemon.sprites.front_default;

        actualizarLogoPorTipo(tipoES);

        const movimientos = pokemon.moves.map(m => m.move.url);
        const movimientosDetalles = await Promise.all(movimientos.map(url => fetch(url).then(res => res.json())));
        const movimientosES = movimientosDetalles.map(m => {
            const nombre = m.names.find(n => n.language.name === 'es');
            return nombre ? nombre.name : m.name;
        }).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

        for (let i = 0; i < 4; i++) {
            const select = document.getElementById(`movimientos${i + 1}_rival`);
            select.innerHTML = '';
            movimientosES.forEach(nombreMovimiento => {
                const opcion = document.createElement('option');
                opcion.value = nombreMovimiento;
                opcion.textContent = formatearMovimiento(nombreMovimiento);
                select.appendChild(opcion);
            });
        }

    } catch (error) {
        console.error('Error en la búsqueda:', error);
        document.getElementById('nombrePokemon_rival').textContent = 'No se encontró el Pokémon.';
        document.getElementById('numeroPokedex_rival').textContent = '';
        document.getElementById('tipoPokemon_rival').textContent = '';
        document.getElementById('imgPokemon_rival').src = '';
        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`movimientos${i}_rival`);
            select.innerHTML = '<option>Error</option>';
        }
    }
}