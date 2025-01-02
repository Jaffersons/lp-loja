const globals = {
	'horarioResizer': false,
	'hoursCompared': []
}

const IDList = {
	'pes_fantas': {
		classes: [],
		fill: (e, c) => { 
			m = c.match(/^(CVC)\s(.*)$/);
			e.innerHTML = `${m[1]} ${m[2].toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())}`; 
		},
	},
	'fil_lndpag': {
		classes: ['full', 'yellow'],
		fill: (e, c) => { e.href = c },
	},
	'google': {
		classes: ['full', 'yellow'],
		fill: (e, c) => { 
			if ( c == "" ) e.style.display = 'none';
			e.href = c 
		},
	},
	'pix': {
		classes: ['full', 'yellow'],
		fill: (e, c) => { 
			if ( c == "" ) e.style.display = 'none';
			e.style.cursor = 'pointer';
			e.addEventListener('click', () => { copyText(c) }) 
		}
	},
	'contato': {
		classes: ['half', 'yellow'],
		fill: (e, c) => { e.href = c ?? '#' },
	},
	'fone': {
		classes: ['half', 'yellow'],
		fill: (e, c) => { e.href = `tel:${c}` },
	},
	'facebook': {
		classes: ['quarter', 'hollow'],
		fill: (e, c) => { e.href = c },
	},
	'instagram': {
		classes: ['quarter', 'hollow'],
		fill: (e, c) => { e.href = c },
	},
	'whatsapp': {
		classes: ['quarter', 'hollow'],
		fill: (e, c) => { e.href = c },
	},
	'youtube': {
		classes: ['quarter', 'hollow'],
		fill: (e, c) => { e.href = c ?? "https://www.youtube.com/cvcviagens" },
	},
	'endereco': {
		classes: [],
		fill: (e, c) => { e.innerHTML = `${c.rua}<br>${c.bairro} - ${c.cidade} - ${c.cep}` },
	}
};

async function delay(delay = 1000, callback = () => {} ) {
	const delayPromise = ms => new Promise(res => setTimeout(res, ms));
	await delayPromise(delay);

	callback();
}

function showModal(){
		let modal = document.querySelector('#modal');
		// Torna a div visível instantaneamente, sem animação
  	modal.style.visibility = 'visible';
		modal.classList.add('show');
  
		setTimeout(() => {
			modal.classList.remove('show');
		}, 3000);
		
		setTimeout(() => {
			modal.style.visibility = 'hidden'
		}, 5000);
	}

async function copyText(textToCopy) {
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(textToCopy);
		showModal();
	} else {
		// Use the 'out of viewport hidden text area' trick
		const textArea = document.createElement('textarea');
		textArea.value = textToCopy;
				
		// Move textarea out of the viewport so it's not visible
		textArea.style.position = 'absolute';
		textArea.style.left = '-999999px';
				
		document.body.prepend(textArea);
		textArea.select();

		try {
			document.execCommand('copy');
			showModal();
		} catch (error) {
			console.error(error);
		} finally {
			textArea.remove();
		}
	}
};

function makeMapUrl(lat = 0, lon = 0) {
	lat = parseFloat(lat);
	lon = parseFloat(lon);
	const latdif = lat * 0.0001;
	const londif = lon * 0.0001;
	const bbox = [ 
		lon - londif, lat - latdif,
		lon + londif, lat + latdif
	];
	let src = "bbox=-48.61769378185273%2C-27.603179848634635%2C-48.60873520374299%2C-27.598901319447833";

	return src.replace(/(bbox=).*/, "$1" + bbox.join("%2C"));
}

function resizePin(pin, imapa) {
	pin.style.height = `${imapa.clientHeight}px`;
}

function prepareHourToCompare(hora) {
	hora = parseFloat((hora.split(':', 2)).join('.'));

	return hora;
}

function compareHour(now, hourToCompare) {
	now = prepareHourToCompare(now)
	hourToCompare = prepareHourToCompare(hourToCompare)

	isBefore =  now < hourToCompare ? true : false;
	isAfter =  now > hourToCompare ? true : false;
	isNear = (Math.abs((now * 60) - (hourToCompare * 60))) > 0 && (Math.abs((now * 60) - (hourToCompare * 60))) < 31 ? true : false;

	return { isBefore, isAfter, isNear };
}

window.onload = async () => {
	let elements = document.querySelectorAll('.skeleton');

	let horario = document.querySelector('#horario');
	let mainHorario = document.querySelector('#main');
	let subHorario = document.querySelector('#sub');
	let subs = subHorario.querySelectorAll('div');
	
	let mapa = document.querySelector('#divMapa');
	let imapa = document.querySelector('#imapa');
	let pin = document.querySelector('#pin')

	let today = '';

	await delay(2000, () => {
		const res = {
			"pes_fantas": "CVC VILLA ROMANA SHOPPING",
			"fil_lndpag": "https://cvcvillaromanashopping.ofertascvcpravc.com.br/",
			"pix": "loja.9250@cvc.com.br",
			"fone": "554837338199",
			"whatsapp": "https://wa.me/5548988393197",
			"facebook": "https://facebook.com/CVC.SC.VillaRomanaShopping",
			"instagram": "https://instagram.com/CVC.SC.VillaRomanaShopping",
			"google": "https://g.page/r/CQKEV-dRGLmrEBM/review",
			"cep": "88.035-000",
			"endereco": "Avenida Madre Benvenuta, 687 Loja 345",
			"bairro": "Santa Mônica",
			"cidade": "Florianópolis/SC",
			"pes_geolat": "-27,589714",
			"pes_geolon": "-48,515266",
			"horarios": [
        { "dia": "Domingo", "horafunc": { "pausa": false, "horario": [{ "horaini": "14:00", "horafim": "20:00" }] }},
				{ "dia": "Segunda-feira", "horafunc": { "pausa": false, "horario": [{ "horaini": "10:00", "horafim": "22:00" }] }},
        { "dia": "Terça-feira", "horafunc": { "pausa": false, "horario": [{ "horaini": "10:00", "horafim": "22:00" }] }},
        { "dia": "Quarta-feira", "horafunc": { "pausa": false, "horario": [{ "horaini": "10:00", "horafim": "22:00" }] }},
        { "dia": "Quinta-feira", "horafunc": { "pausa": false, "horario": [{ "horaini": "10:00", "horafim": "22:00" }] }},
        { "dia": "Sexta-feira", "horafunc": { "pausa": false, "horario": [{ "horaini": "10:00", "horafim": "22:00" }] }},
        { "dia": "Sábado", "horafunc": { "pausa": false, "horario": [{ "horaini": "10:00", "horafim": "22:00" }] }},
			]
		}

		res.endereco = {
			'rua': res.endereco,
			'bairro': res.bairro,
			'cidade': res.cidade,
			'cep': res.cep,
		}

		res.pes_geolat  =  res.pes_geolat.replace(',', '.');
		res.pes_geolon  =  res.pes_geolon.replace(',', '.');

		for (const element of elements ) {
			if(IDList.hasOwnProperty(element.id)) {
				element.classList.remove(...element.classList);
				if (IDList[element.id].classes.length > 0) element.classList.add(...IDList[element.id].classes);

				IDList[element.id].fill(element, res[element.id]);
			}
		}

		mapa.remove();
		imapa.style.display = '';
		imapa.setAttribute('data-src', `https://www.openstreetmap.org/export/embed.html?layer=mapnik&${makeMapUrl(res.pes_geolat, res.pes_geolon)}`);
		imapa.setAttribute('src', `https://www.openstreetmap.org/export/embed.html?layer=mapnik&${makeMapUrl(res.pes_geolat, res.pes_geolon)}`);
		pin.style.display = '';
		pin.href = `geo:${res.pes_geolat},${res.pes_geolon}?z=16&q=${res.pes_geolat},${res.pes_geolon}`;
		resizePin(pin, imapa);

		let now = new Date();
		let dayOfWeek = now.getDay();
		let hourNow = now.toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'});
		let otherDays = [];
		today = res.horarios[dayOfWeek];

		//Define a ordem de listagem do dia a partir de hoje
		if (dayOfWeek == 0) otherDays = res.horarios.slice(dayOfWeek + 1);
			else if (dayOfWeek == 6) otherDays = res.horarios.slice(0, dayOfWeek);
				else otherDays = (res.horarios.slice(dayOfWeek + 1)).concat(res.horarios.slice(0, dayOfWeek));

		/**
		 * É preciso fazer alteração para suportar pausa para almoço
		 * Também é preciso dar um upgrade no texto para "Fecha em breve às ..."
		 */
		if(!today.horafunc.pausa) {
			openHourCompare = compareHour(hourNow, today.horafunc.horario[0].horaini);
			closeHourCompare = compareHour(hourNow, today.horafunc.horario[0].horafim);

			//Define o texto do dia de hoje
			if (openHourCompare.isBefore) mainHorario.innerHTML = `<p class='closed'>Fechado</p><p>Abre às ${today.horafunc.horario[0].horaini}</p>`;
				else if (closeHourCompare.isAfter) mainHorario.innerHTML = `<p class='closed'>Fechado</p><p>Fechado</p>`;
					else mainHorario.innerHTML = `<p class='open'>Aberto agora</p><p>${today.horafunc.horario[0].horaini}-${today.horafunc.horario[0].horafim}</p>`

			//Define o texto para os demais dias
			for(let i = 0; i < otherDays.length; i++){
				let firstP = `<p>${otherDays[i].dia}</p>`
				let secondP = '<p>' + (otherDays[i].horafunc.horario.length !== 0  ? `${otherDays[i].horafunc.horario[0].horaini}-${otherDays[i].horafunc.horario[0].horafim}` : 'Fechado') + '</p>'
				subs[i].innerHTML = firstP + secondP;
			}
		} else {
			today.horafunc.horario.forEach(horario => {
				for(const hour in horario) {
					globals.hoursCompared.push(compareHour(hourNow, horario[hour]));
				}
			});

			if (globals.hoursCompared[1].isAfter && globals.hoursCompared[3].isAfter) {
				mainHorario.innerHTML = `<p class='closed'>Fechado</p><p>Fechado</p>`;
			} else if (globals.hoursCompared[0].isBefore) {
				mainHorario.innerHTML = `<p class='closed'>Fechado</p><p>Abre às ${today.horafunc.horario[0].horaini}</p>`;
			} else if (globals.hoursCompared[1].isAfter && globals.hoursCompared[2].isBefore) {
				mainHorario.innerHTML = `<p class='closed'>Fechado</p><p>Abre às ${today.horafunc.horario[1].horaini}</p>`;
			} else if ((globals.hoursCompared[0].isAfter && globals.hoursCompared[1].isBefore) || (globals.hoursCompared[2].isAfter && globals.hoursCompared[3].isBefore)) {
				if (globals.hoursCompared[1].isNear) mainHorario.innerHTML = `<p class='almostClose'>Fecha em breve</p><p>${today.horafunc.horario[0].horafim} - Reabre às ${today.horafunc.horario[1].horaini}</p>`
					else mainHorario.innerHTML = `<p class='open'>Aberto agora</p><p style='font-size: 0.85rem'>Fecha às ${today.horafunc.horario[0].horafim} - Reabre às ${today.horafunc.horario[1].horaini}</p>`
			}

			//Define o texto para os demais dias
			for(let i = 0; i < otherDays.length; i++){
				let firstP = `<p>${otherDays[i].dia}</p>`
				let secondP = ''
				if (otherDays[i].horafunc.horario.length === 0) secondP = '<p>Fechado</p>';
					else if (otherDays[i].horafunc.horario.length === 1) secondP = `<p>${otherDays[i].horafunc.horario[0].horaini}-${otherDays[i].horafunc.horario[0].horafim}</p>`
						else secondP = `<p>${otherDays[i].horafunc.horario[0].horaini}-${otherDays[i].horafunc.horario[0].horafim}<br>${otherDays[i].horafunc.horario[1].horaini}-${otherDays[i].horafunc.horario[1].horafim}</p>`;
				subs[i].innerHTML = firstP + secondP;
			}
		}

		mainHorario.classList.remove(...mainHorario.classList);
		subHorario.classList.remove(...subHorario.classList);
	});

	const mainHorarioTextChanger = status => {
		let mainHorarioText = mainHorario.querySelector('p:first-child');
		let mainHorarioSecondText = mainHorario.querySelector('p:last-child');

		if (status == 'boxOpened') {
			mainHorarioText.innerHTML = today.dia;
			
			if (today.horafunc.pausa) {
				mainHorarioSecondText.innerHTML = `${today.horafunc.horario[0].horaini}-${today.horafunc.horario[0].horafim}<br>${today.horafunc.horario[1].horaini}-${today.horafunc.horario[1].horafim}`;
			}
		} else {
			if (mainHorarioText.className == 'open') {
				mainHorarioText.innerHTML = 'Aberto';

				if (today.horafunc.pausa) {
					mainHorarioSecondText.innerHTML =`Fecha às ${today.horafunc.horario[0].horafim} - Reabre às ${today.horafunc.horario[1].horaini}`;
				}
			} else if (mainHorarioText.className == 'almostClose') {
				mainHorarioText.innerHTML = 'Fecha em breve';
				mainHorarioSecondText.innerHTML = `${today.horafunc.horario[0].horafim} - Reabre às ${today.horafunc.horario[1].horaini}`;
			} else {
				mainHorarioText.innerHTML = 'Fechado';
				if(today.horafunc.pausa) {
					if (globals.hoursCompared[0].isBefore) {
						mainHorarioSecondText.innerHTML = `Abre às ${today.horafunc.horario[0].horaini}`;
					} else if (globals.hoursCompared[1].isAfter && globals.hoursCompared[2].isBefore) {
						mainHorarioSecondText.innerHTML = `Abre às ${today.horafunc.horario[1].horaini}`;
					}
				}
			}
		}
	}

	const horarioResizer = () => {
		if (subHorario.style.maxHeight === '0px' || subHorario.style.maxHeight === '') {
			subHorario.style.display = 'flex';
			mainHorarioTextChanger('boxOpened');
		
			setTimeout(() => {
				subHorario.style.maxHeight = '300px';
			}, 10);

		} else {
			subHorario.style.maxHeight = '0';
			
			setTimeout(() => {
				subHorario.style.display = 'none';
				mainHorarioTextChanger('boxClosed');
			}, 500);
		}

		setTimeout(() => {
			resizePin(pin, imapa);
		}, 600);
	}

	if( window.innerWidth >= 821 ) mainHorarioTextChanger('boxOpened');

	if( window.innerWidth < 821 ) {
		horario.addEventListener('click', horarioResizer);
		globals.horarioResizer = true;
	}

	window.onresize = () => {
		resizePin(pin, imapa);

		if ( window.innerWidth >= 821 && globals.horarioResizer === true ) {
			horario.removeEventListener('click', horarioResizer);
			globals.horarioResizer = false;

			mainHorarioTextChanger('boxOpened');
		} else if (window.innerWidth < 821 && globals.horarioResizer === false) {
			horario.addEventListener('click', horarioResizer);
			globals.horarioResizer = true;
			mainHorarioTextChanger('boxClosed');
		}
	}
}
