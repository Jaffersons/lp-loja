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
		fill: (e, c) => { e.href = c },
	},
	'pix': {
		classes: ['full', 'yellow'],
		fill: (e, c) => { 
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
		fill: (e, c) => { e.innerHTML = `${c.endereco}<br>${c.bairro} - ${c.cidade} - ${c.cep}` },
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

window.onload = async () => {
	let elements = document.querySelectorAll('.skeleton');

	let arrow = document.querySelector('#arrow');
	let mainHorario = document.querySelector('#main');
	let subHorario = document.querySelector('#sub');
	let subs = subHorario.querySelectorAll('div');
	
	let mapa = document.querySelector('#divMapa');
	let imapa = document.querySelector('#imapa');
	let pin = document.querySelector('#pin')

	delay(2000, () => {
		const res = {
			"pes_fantas": "CVC VILLA ROMANA SHOPPING",
			"fil_lndpag": "https://cvcvillaromanashopping.ofertascvcpravc.com.br/",
			"pix": "loja.9250@cvc.com.br",
			"fone": "554837338199",
			"whatsapp": "https://wa.me/5548988393197",
			"facebook": "https://facebook.com/CVC.SC.VillaRomanaShopping",
			"instagram": "https://instagram.com/CVC.SC.VillaRomanaShopping",
			"messenger": "https://m.me/CVC.SC.VillaRomanaShopping",
			"google": "https://g.page/r/CQKEV-dRGLmrEBM/review",
			"geo": "geo:-27.589714,-48.515266",
			"cep": "88.035-000",
			"endereco": "Avenida Madre Benvenuta, 687 Loja 345",
			"bairro": "Santa Mônica",
			"cidade": "Florianópolis/SC",
			"pes_geolat": "-27,589714",
			"pes_geolon": "-48,515266",
			"horarios": [
        { dia: "Domingo", horini: "14:00", horfim: "20:00" },
				{ dia: "Segunda-feira", horini: "10:00", horfim: "22:00" },
        { dia: "Terça-feira", horini: "10:00", horfim: "22:00" },
        { dia: "Quarta-feira", horini: "10:00", horfim: "22:00" },
        { dia: "Quinta-feira", horini: "10:00", horfim: "22:00" },
        { dia: "Sexta-feira", horini: "10:00", horfim: "22:00" },
        { dia: "Sábado", horini: "10:00", horfim: "22:00" },
			]
		}

		res.endereco = {
			'endereco': res.endereco,
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
		pin.href = `geo:${res.pes_geolat},${res.pes_geolon}`;
		resizePin(pin, imapa);

		let now = new Date();
		let dayOfWeek = now.getDay();
		let today = res.horarios[dayOfWeek];
		let otherDays = [];

		if (dayOfWeek == 0) otherDays = res.horarios.slice(dayOfWeek + 1);
			else if (dayOfWeek == 6) otherDays = res.horarios.slice(0, dayOfWeek);
				else otherDays = (res.horarios.slice(dayOfWeek + 1)).concat(res.horarios.slice(0, dayOfWeek));

		if (now.getHours() < parseInt(today.horini.slice(':'))) mainHorario.innerHTML = `<p class='closed'>Fechado</p><p>Abre às ${today.horini}</p>`;
			else if (now.getHours() >= parseInt(today.horfim.slice(':')) ) mainHorario.innerHTML = `<p class='closed'>Fechado</p><p>Abre ${otherDays[0].dia.toLowerCase()} às ${otherDays[0].horini}</p>`;
				else mainHorario.innerHTML = `<p class='open'>Aberto</p><p>${today.horini}-${today.horfim}</p>`

		for(let i = 0; i < otherDays.length; i++){
			subs[i].innerHTML = `<p>${otherDays[i].dia}</p><p>${otherDays[i].horini}-${otherDays[i].horfim}</p>`
		}

		mainHorario.classList.remove(...mainHorario.classList);
		subHorario.classList.remove(...subHorario.classList);
	});

	arrow.addEventListener('click', () => {
		if (subHorario.style.maxHeight === '0px' || subHorario.style.maxHeight === '') {
    	subHorario.style.display = 'flex';
    
			setTimeout(() => {
      	subHorario.style.maxHeight = '300px';
    	}, 10);

  	} else {
    	subHorario.style.maxHeight = '0';
    	
			setTimeout(() => {
      	subHorario.style.display = 'none';
    	}, 500);
  	}

		setTimeout(() => {
			resizePin(pin, imapa);
		}, 600);
	});

	window.onresize = () => {
		resizePin(pin, imapa);
	}
}