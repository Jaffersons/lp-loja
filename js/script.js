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

window.onload = async () => {
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

	let elements = document.querySelectorAll('.skeleton');

	let arrow = document.getElementById('arrow');
	let subHorario = document.getElementById('sub');
	let mapa = document.querySelector('#divMapa');
	let imapa = document.querySelector('#imapa');
	let pin = document.querySelector('#pin')

	delay(100, () => {
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
			"pes_geolat": "-27,600822",
			"pes_geolon": "-48,597099"
		}

		res.endereco = {
			'endereco': res.endereco,
			'bairro': res.bairro,
			'cidade': res.cidade,
			'cep': res.cep,
		}

		for (const element of elements ) {
			if(IDList.hasOwnProperty(element.id)) {
				element.classList.remove(...element.classList);
				if (IDList[element.id].classes.length > 0) element.classList.add(...IDList[element.id].classes);

				IDList[element.id].fill(element, res[element.id]);
			}
		}

		mapa.remove();
		imapa.style.display = '';
		imapa.src = `https://www.openstreetmap.org/export/embed.html?bbox=${res['pes_geolat'] + '%2C' + res['pes_geolon']}&amp;layer=mapnik&amp`
	});

	function resizePin() {
		pin.style.height = `${imapa.clientHeight}px`;
	}

	resizePin();

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
			resizePin();
		}, 600);
	});

	window.onresize = () => {
		resizePin();
	}
}