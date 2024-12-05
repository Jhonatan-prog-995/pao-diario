const devocionalContainer = document.getElementById('devocional');

 fetch('dados.json')
.then(response => {
    if(!response.ok) throw new error('erro ao carregar');
    return response.json();
})
.then(data => {

    const devocional = data.devocional;

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

// ______________________________________________________


const buttonPath = '../botaoToppo/botao.html'; // Caminho correto para o arquivo botao.html

async function loadButton() {
    try {
        const response = await fetch(buttonPath);  // Carrega o conteúdo de botao.html
        if (!response.ok) throw new Error('Erro ao carregar a página');

        const buttonHtml = await response.text();  // Converte o conteúdo para texto

        // Coloca o conteúdo do botão na div #voltarAoTopo sem apagar o restante
        document.getElementById('voltarAoTopo').innerHTML = buttonHtml;
    } catch (error) {
        console.error('Erro:', error);  // Exibe erro se ocorrer
    }
}

loadButton();  // Chama a função ao carregar a página


// ______________________________________________________


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('bible-form');
    const resultDiv = document.getElementById('result');

    // Botões de navegação
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    // Valores padrão
    const defaultBook = "genesis";
    const defaultChapter = "1";
    const defaultVerse = "";

    // Recupera do localStorage ou usa valores padrão
    const savedBook = localStorage.getItem('book') || defaultBook;
    const savedChapter = localStorage.getItem('chapter') || defaultChapter;
    const savedVerse = localStorage.getItem('verse') || defaultVerse;

    // Variáveis para estado atual
    let currentBook = savedBook;
    let currentChapter = parseInt(savedChapter, 10);

    // Preenche os campos do formulário
    document.getElementById('book').value = savedBook;
    document.getElementById('chapter').value = savedChapter;
    document.getElementById('verse').value = savedVerse;

    // Busca inicial
    searchVerse(currentBook, currentChapter, savedVerse);

    // Evento de envio do formulário
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Atualiza as variáveis com os valores do formulário
        currentBook = document.getElementById('book').value.toLowerCase();
        currentChapter = parseInt(document.getElementById('chapter').value, 10);
        const currentVerse = document.getElementById('verse').value;

        // Salva no localStorage
        localStorage.setItem('book', currentBook);
        localStorage.setItem('chapter', currentChapter);
        localStorage.setItem('verse', currentVerse);

        // Busca os versículos
        await searchVerse(currentBook, currentChapter, currentVerse);
    });

    // Função para verificar se o livro tem apenas um capítulo
    async function isSingleChapterBook(book) {
        const url = `https://bible-api.com/${book}?translation=almeida`; // A API para buscar o livro completo
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return data.verses.length > 0 && data.verses[0].chapter === 1; // Se o livro tem apenas 1 capítulo
            }
            return false;
        } catch {
            return false;
        }
    }

    // Evento para botão de capítulo anterior
    prevButton.addEventListener("click", async function () {
        if (!(await isSingleChapterBook(currentBook))) {
            if (await validateChapter(currentBook, currentChapter - 1)) {
                currentChapter--;
                document.getElementById('chapter').value = currentChapter; // Atualiza o campo de entrada
                await searchVerse(currentBook, currentChapter);
            }
        }
    });

    // Evento para botão de próximo capítulo
    nextButton.addEventListener("click", async function () {
        if (!(await isSingleChapterBook(currentBook))) {
            if (await validateChapter(currentBook, currentChapter + 1)) {
                currentChapter++;
                document.getElementById('chapter').value = currentChapter; // Atualiza o campo de entrada
                await searchVerse(currentBook, currentChapter);
            }
        }
    });

    // Função para buscar e exibir todos os versículos de um capítulo
    async function searchVerse(book, chapter, verse) {
        const url = `https://bible-api.com/${book}+${chapter}${verse ? `:${verse}` : ''}?translation=almeida`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar os versículos');
            const data = await response.json();

            if (data.error) {
                resultDiv.innerHTML = `<p>Erro: ${data.error}</p>`;
            } else {
                resultDiv.innerHTML = '';
                if (await isSingleChapterBook(book)) {
                    // Se o livro tem apenas um capítulo, exibe todos os versículos
                    data.verses.forEach((verseData) => {
                        const verseElement = document.createElement('p');
                        const verseNumber = document.createElement('span');
                        verseNumber.textContent = `${verseData.verse} `;
                        verseNumber.style.color = '#492420';
                        verseNumber.style.fontSize = '35px';

                        const verseText = document.createElement('span');
                        verseText.textContent = verseData.text;
                        verseText.style.color = '#0e0000';
                        verseText.style.fontSize = '40px';

                        verseElement.appendChild(verseNumber);
                        verseElement.appendChild(verseText);
                        resultDiv.appendChild(verseElement);
                    });

                    // Desabilitar navegação para livros com apenas um capítulo
                    prevButton.disabled = true;
                    nextButton.disabled = true;
                } else {
                    // Se o livro tem mais de um capítulo, exibe apenas o versículo
                    data.verses.forEach((verseData) => {
                        const verseElement = document.createElement('p');
                        const verseNumber = document.createElement('span');
                        verseNumber.textContent = `${verseData.verse} `;
                        verseNumber.style.color = '#492420';
                        verseNumber.style.fontSize = '35px';

                        const verseText = document.createElement('span');
                        verseText.textContent = verseData.text;
                        verseText.style.color = '#0e0000';
                        verseText.style.fontSize = '40px';

                        verseElement.appendChild(verseNumber);
                        verseElement.appendChild(verseText);
                        resultDiv.appendChild(verseElement);
                    });

                    // Se o livro tem mais de um capítulo, habilite a navegação
                    prevButton.disabled = false;
                    nextButton.disabled = false;
                }
            }
        } catch (error) {
            resultDiv.innerHTML = `<p>Erro....recarregar a pagina</p>`;
        }
    }

    // Função para validar se o capítulo existe
    async function validateChapter(book, chapter) {
        const url = `https://bible-api.com/${book}+${chapter}?translation=almeida`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return !data.error;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    }
});


// _________________________________________________________


const missaoContainer = document.getElementById('missao');

fetch('dados.json')
    .then(response => {
        if(!response.ok) throw new Error('Error...')
        return response.json();
    })

    .then(data => {
        const missao = data.missao;
        missaoContainer.innerHTML = ' '

        missao.forEach(missao => {
            missaoContainer.innerHTML += ` 

            <div class="devocional-item">
            <div class="img-container">

                <img src="${missao.imagem}"

            </div>
                <h2>${missao.titulo}</h2>
                <p>${missao.body}</p>
                
            </dive>
            
            `
        })
})



document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão
    const botaoTopo = document.getElementById('voltarAoTopo');

    if (botaoTopo) {
        // Evento para mostrar o botão ao rolar
        window.addEventListener('scroll', () => {
            if(window.innerWidth <= 701){

                // Esconde o botão se a largura da tela for menor ou igual a 700px
                botaoTopo.style.display = 'none';

            } else if (window.scrollY > 200) { // Quando o scroll passa de 200px
                botaoTopo.style.display = 'block';
            } else {
                botaoTopo.style.display = 'none';
            }
        });

        // Evento para voltar ao topo ao clicar no botão
        botaoTopo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // Animação suave
            });
        });
    } else {
        console.error('O botão #voltarAoTopo não foi encontrado no DOM.');
    }
});


function clickMenu(){
    if(itens.style.display == 'block'){
        itens.style.display = 'none'
    } else {
        itens.style.display = 'block'
    }
}



// função para carregar os elementos no body


  // Carregar header dinamicamente
  fetch('./header/header.html')
  .then(response => response.text())
  .then(data => {
      document.getElementById('header').innerHTML = data;
  });

// Carregar footer dinamicamente
fetch('./footer/footer.html')
  .then(response => response.text())
  .then(data => {
      document.getElementById('footer').innerHTML = data;
  });

// Botão de voltar ao topo
fetch('./botaoToppo/botao.html')
  .then(response => response.text())
  .then(data => {
      document.getElementById('voltarAoTopo').innerHTML = data;
  });