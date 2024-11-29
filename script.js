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

    // Ouvinte do formulário para busca do versículo
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const book = document.getElementById('book').value;
        const chapter = document.getElementById('chapter').value;
        const verse = document.getElementById('verse').value;

        // Atualizar a URL com os dados inseridos sem recarregar a página
        const newUrl = `?book=${book}&chapter=${chapter}&verse=${verse}`;
        window.history.replaceState({}, '', newUrl);

        // Chamar a função para buscar e mostrar o versículo
        await searchVerse(book, chapter, verse);
    });

    // Função para buscar o versículo
    async function searchVerse(book, chapter, verse) {
        const url = `https://bible-api.com/${book}+${chapter}${verse ? `:${verse}` : ''}?translation=almeida`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao buscar o versículo');
            }

            const data = await response.json();
            if (data.error) {
                resultDiv.innerHTML = `<p>Erro: ${data.error}</p>`;
            } else {
                resultDiv.innerHTML = '';  // Limpar conteúdo anterior

                data.verses.forEach((verseData) => {
                    const verseElement = document.createElement('p');
                    
                    // Criar o span para o número do versículo
                    const verseNumber = document.createElement('span');
                    verseNumber.textContent = `${verseData.verse} `;
                    verseNumber.style.color = 'red'; // Cor do número do versículo (por exemplo, vermelho)
                    verseNumber.style.fontSize = '24px';
                    
                    // Criar o span para o texto do versículo
                    const verseText = document.createElement('span');
                    verseText.textContent = verseData.text;
                    verseText.style.color = 'blue'; // Cor do texto do versículo (por exemplo, azul)
                    verseText.style.fontSize = '20px'
                    
                    // Adicionar os spans ao elemento p
                    verseElement.appendChild(verseNumber);
                    verseElement.appendChild(verseText);
                    
                    // Adicionar o p ao resultDiv
                    resultDiv.appendChild(verseElement);
                });
            }
        } catch (error) {
            resultDiv.innerHTML = `<p>Erro ao buscar dados da API.</p>`;
        }
    }
});
