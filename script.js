const devocionalContainer = document.getElementById('devocional');


fetch('dados.json')
.then(response => response.json())
.then(devocional => {

    devocionalContainer.innerhtml = ' ';

    devocional.forEach(devocional => {
        devocionalContainer.innerHTML += `
            <div class="devocional-item">
                <h2>${devocional.titulo}</h2>
                <p>${devocional.body} <br/><br/> ${devocional.cap}</p>
                ${devocional.img ? `<img src="${devocional.img}" alt="Imagem Devocional">` : ''}
            </div>    
        
        
        `
    })
})

.catch(error => console.error('Erro ao carregar o JSON:', error));




// ____________________________________________

const headerPath = '../header/header.html';

async function loadHeader(){
    try{
        const response = await fetch(headerPath);
        if(!response.ok) throw new Error('Error ao carregar a pagina');


        const headerHtml = await response.text();

        document.getElementById('header').innerHTML = headerHtml;
    } catch (error) {
        console.error('Erro:', error);
      }
}

loadHeader();




// ______________________________________________


const footerPath = '../footer/footer.html';


async function loadFoot() {

    try{
        const response = await fetch(footerPath);
        if(!response.ok) throw new Error('Error ao carregar a pagina');

        const footerHtml = await response.text();

        document.getElementById('footer').innerHTML = footerHtml;
    } catch (error) {
        console.error('Erro:' , error);
    }
    
}


loadFoot()



document.getElementById('bible-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const book = document.getElementById('book').value;
    const chapter = document.getElementById('chapter').value;
    const verse = document.getElementById('verse').value;

    const url = `https://bible-api.com/${book}+${chapter}:${verse}?translation=almeida`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar o versículo');
        }

        const data = await response.json();

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h2>${data.reference}</h2>
            <p>${data.text}</p>
            <small>Tradução: ${data.translation_name}</small>
        `;
    } catch (error) {
        alert('Erro: ' + error.message);
    }

    
});

