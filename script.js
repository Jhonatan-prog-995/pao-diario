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

    
    let url = `https://bible-api.com/${book}+${chapter}`;
    if (verse) {
        url += `:${verse}`;
    }
    url += `?translation=almeida`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar o versículo');
        }

        const data = await response.json();

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ' ';

        if (data.error) { 
            resultDiv.textContent = `Erro: ${data.error}`;
        } else {
            data.verses.forEach((verse) => {
                const verseElement = document.createElement('p');
                verseElement.textContent = `${verse.verse} ${verse.text}`; // Número do versículo + texto
                resultDiv.appendChild(verseElement);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = 'Erro ao buscar dados da API.';
    }
});





document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('bible-form');
    const resultDiv = document.getElementById('result');

    // Verificar se há dados na URL para manter as informações no formulário
    const urlParams = new URLSearchParams(window.location.search);
    const savedBook = urlParams.get('book');
    const savedChapter = urlParams.get('chapter');
    const savedVerse = urlParams.get('verse');

    if (savedBook && savedChapter) {
        document.getElementById('book').value = savedBook;
        document.getElementById('chapter').value = savedChapter;
        document.getElementById('verse').value = savedVerse || '';
        searchVerse(savedBook, savedChapter, savedVerse);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const book = document.getElementById('book').value;
        const chapter = document.getElementById('chapter').value;
        const verse = document.getElementById('verse').value;

        // Atualizar a URL com os dados inseridos
        const newUrl = `?book=${book}&chapter=${chapter}&verse=${verse}`;
        window.history.replaceState({}, '', newUrl);

        // Buscar o versículo
        searchVerse(book, chapter, verse);
    });

    function searchVerse(book, chapter, verse) {
        const url = `https://bible-api.com/${book}+${chapter}?translation=almeida`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.text) {
                    resultDiv.innerHTML = `<strong>${book} ${chapter}:${verse || 'todos'}</strong><p>${data.text}</p>`;
                } else {
                    resultDiv.innerHTML = "<p>Versículo não encontrado.</p>";
                }
            })
            .catch(error => {
                resultDiv.innerHTML = "<p>Erro ao buscar o versículo.</p>";
            });
    }
});

