window.onload = () => {
	let pixButton = document.getElementById('pix');
	let arrow = document.getElementById('arrow');
	let subHorario = document.getElementById('sub');
	let modal = document.getElementById('modal');
	let mapa = document.getElementById('imapa');
	let pin = document.getElementById('pin')

	pin.style.height = `${mapa.clientHeight}px`;

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
	});

	pixButton.addEventListener('click', async () => {
		textToCopy = 'loja.9250@cvc.com.br'
		
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
	})

	function showModal(){
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
}