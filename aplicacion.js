document.addEventListener('DOMContentLoaded', function () {
    const controltexto = document.getElementById('controltexto');
    let recognition = null; // Variable global para mantener la instancia de reconocimiento
    let ventanaAbierta = null; // Variable para mantener la referencia a la ventana abierta

    // Función para iniciar el reconocimiento de voz
    function startRecognition() {
        recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.lang = 'es-ES';

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript.toLowerCase();

// Modificar tamaño del texto
if (transcript.includes('aumentar')) {
    controltexto.classList.add("fs-1"); //Agregar clase para aumentar tamaño de texto
    console.log("Si Se Encontró La Palabra 'aumentar'...");

} else if (transcript.includes('disminuir')) {
    controltexto.classList.remove("fs-1"); // Eliminar clase para aumentar tamaño de texto
    controltexto.classList.add("fs-6"); // Agregar clase para disminuir tamaño de texto a fs-6
    console.log("Si Se Encontró La Palabra 'disminuir'...");
}

// Abrir una nueva pestaña
if (transcript.includes('nueva')) {
    ventanaAbierta = window.open('');
    if (ventanaAbierta) {
        console.log("Si Se Encontro La Palabra 'nueva'...");
    }
}

// Cerrar la pestaña abierta 
if (transcript.includes('cerrar') && ventanaAbierta) {
    ventanaAbierta.close();
    console.log("Si Se Encontro La Palabra 'cerrar'...");
}

// Ir a una página específica
if (transcript.includes('itp')) {
   window.location.href = 'https://itp.itpachuca.edu.mx/';
  console.log("Si Se Encontro La Palabra 'itp'...");
}

if (transcript.includes('chat')) {
    window.open('https://chat.openai.com/', '_blank');
    console.log("Si Se Encontró La Palabra 'chat'...");
}

// Función para abrir una nueva ventana con el tamaño especificado y mostrar un mensaje
    function abrirNuevaVentanaConMensaje(ancho, alto, mensaje) {
    var nuevaVentana = window.open('', '_blank', 'width=' + ancho + ',height=' + alto);
    nuevaVentana.document.write('<h1>' + mensaje + '</h1>');
    nuevaVentana.focus();
}

// Modificar el tamaño de una ventana del navegador y abrir una nueva ventana con un mensaje
if (transcript.includes('modificar')) {
    abrirNuevaVentanaConMensaje(500, 500, '¡HOLA SOY BRAYAN PEREZ SAN JUAN DE ITIC!');
    console.log("Se encontró la palabra 'modificar'.");
}
            // Aquí definimos las palabras clave que activarán el envío al mockapi
            const palabrasClave = ['aumentar', 'disminuir', 'nueva', 'cerrar', 'itp', 'chat', 'modificar', 'cíerrame'];
            
            // Verificamos si alguna de las palabras clave está en la transcripción
            const contienePalabraClave = palabrasClave.some(palabra => transcript.includes(palabra));
            
            if (contienePalabraClave) {
                enviarFraseAFirebase(transcript); // Enviar transcripción al mockapi
            }

            // Reiniciar el reconocimiento después de cada transcripción
            startRecognition();
        };

        recognition.start();
    }

    // Iniciar el reconocimiento por primera vez
    startRecognition();

    // Mantener el reconocimiento activo continuamente
    setInterval(() => {
        if (!recognition || recognition.readyState === 'closed') {
            startRecognition();
        }
    }, 10000); // Cada 10 segundos

    // Función para enviar la transcripción al mockapi si contiene una palabra clave
    function enviarFraseAFirebase(frase) {
        const palabrasClave = ['aumentar', 'disminuir', 'nueva', 'cerrar', 'itp', 'chat', 'modificar', 'cíerrame'];
        const contienePalabraClave = palabrasClave.some(palabra => frase.includes(palabra));

        if (contienePalabraClave) {
            const data = { frase: frase };

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };

            const url = 'https://660c51203a0766e85dbdea46.mockapi.io/Voz';

            fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al enviar los datos a la API');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Los datos se enviaron correctamente:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
});

