const confImg = document.getElementById('conf-img');
const configDiv = document.getElementById('extra-div');
const containerPrincipal = document.getElementById('container-principal');
const btnEncurtar = document.getElementById('btn-encurtar');
const mensagem = document.getElementById("msg-inicio");
const loading = document.getElementById('loading');
const listaLinks = document.getElementById("lista-de-links");
const msgInicio = document.getElementById('msg-inicio');
const apiKey = 'sk_qiYiSepi1LRZRj8n';
const domainId = '716308';
const domainUrl = '96xu.short.gy';
const QrCont = document.getElementById('QrCont');
const form = document.getElementById('form');
const urlInput = document.getElementById('url');
const urlFeedback = document.getElementById('url-feedback');
const shortLink = document.getElementById('short-link');
const resultDiv = document.getElementById('result');
const aLink = document.querySelector('.return a');
const smallData = document.querySelector('.return small');
const btnCopiar = document.createElement('button');
const dominio = document.querySelector('.dominio');
const btnSalvarEdit = document.querySelector('.salvar-edit');
const fecharModal = document.querySelector('.fechar-modal');
const divModais = document.querySelector('.modais');
const divModalEditar = document.querySelector('.modal');
const divModalEditarP = document.querySelector('.modal p');
const divModalBoo = document.querySelector('.modal-boolean');
const divModalBooP = document.querySelector('.modal-boolean');

confImg.addEventListener('click', () => {
  const shouldHideContainer = containerPrincipal.style.display !== 'none';
  const transitionDuration = 0.3; 

  containerPrincipal.style.opacity = shouldHideContainer ? 0 : 1;
  containerPrincipal.style.transition = `opacity ${transitionDuration}s`;

  containerPrincipal.style.opacity = shouldHideContainer ? 0 : 1;
  containerPrincipal.style.transition = `opacity ${transitionDuration}s`;

  setTimeout(() => {
    containerPrincipal.style.display = shouldHideContainer ? 'none' : 'block';
    aLink.style.display = shouldHideContainer ? 'none' : 'block';
    configDiv.style.display = shouldHideContainer ? 'block' : 'none';
  }, transitionDuration * 1000);
});



btnEncurtar.onclick = validarURL;

function hideElements(...elements) {
  elements.forEach(element => {
    element.style.display = 'none';
  });
}

hideElements();


function mostrarDominio() {
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', Authorization: 'sk_qiYiSepi1LRZRj8n' }
  };

  fetch('https://api.short.io/api/domains', options)
    .then(response => response.json())
    .then(response => {
      const dominio = response[0].hostname;
      const linkDominio = document.querySelector('.dominio a');
      linkDominio.href = `https://${dominio}`;
      linkDominio.textContent = dominio;
    })
    .catch(err => console.error(err));
}

mostrarDominio();

function validarURL() {
  const urlInput = document.getElementById('url');
  const url = urlInput.value;
  const urlFeedback = document.getElementById('url-feedback');

  const urlRegExp = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
  const isUrlValid = urlRegExp.test(url);

  urlInput.classList.toggle('is-invalid', !isUrlValid);
  urlFeedback.innerHTML = isUrlValid ? '' : '<div class="feedback error-feedback">Por favor, digite uma URL válida.</div>';

  setTimeout(() => {
    urlFeedback.innerHTML = '';
    urlInput.classList.remove('is-invalid');
  }, 5000); 

  return isUrlValid;
}

async function solicitarAcesso() {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: apiKey
    },
    body: JSON.stringify({
      domain: domainUrl,
      plan: 'free'
    })
  };

  try {
    const response = await fetch('https://api.short.io/access-requests', options);

    if (response.ok && response.status === 200) {
      const responseData = await response.json();
    } else {
      throw new Error(`Resposta do servidor: ${response.status}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}



function exibirMensagensInicio(status, mensagem) {
  msgInicio.innerText = mensagem;
  msgInicio.style.display = 'flex';
  msgInicio.classList.toggle('msg-inicio--erro', !status);
}


function limparMensagens() {
  msgInicio.classList.remove('resultDiv', 'msg-inicio--sucesso', 'msg-inicio--erro');
  msgInicio.innerText = '';
}

function salconstLinkEncurtado(linkCurto, data, linkId) {
  const linkData = {
    linkCurto: linkCurto,
    data: data,
    linkId: linkId
  };

  let linksSalvos = JSON.parse(localStorage.getItem('linksSalvos')) || [];
  linksSalvos.push(linkData);
  localStorage.setItem('linksSalvos', JSON.stringify(linksSalvos));
}

async function encurtarURL(url) {
  const apiKey = "sk_qiYiSepi1LRZRj8n";
  const domainUrl = "96xu.short.gy";

  const options = {
    method: "POST",
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: apiKey
    },
    body: JSON.stringify({ originalURL: url, domain: domainUrl })
  };

  try {
    const response = await fetch('https://api.short.io/links', options);

    if (response.ok && response.status === 200) {
      const responseData = await response.json();
      if (responseData.duplicate) {
        exibirMensagensInicio(false, 'Link informado já existe!');
      } else {
        exibirMensagensInicio(true, 'Link Criado Com Sucesso!');
        shareLinks(responseData.shortURL, responseData.createdAt, responseData.idString);
        salconstLinkEncurtado(responseData.shortURL, responseData.createdAt, responseData.idString);
      }
    } else {
      throw new Error(`Resposta do servidor: ${response.status}`);
    }
  } catch (err) {
    console.error(err.message);
    exibirMensagensInicio(false, 'Ocorreu um erro, tente novamente!');
  } finally {
    setTimeout(limparMensagens, 3500);
    btnEncurtar.style.display = 'block';
  }
}


function shareLinks(linkCurto, data, linkId) {
  const criacao = formataData(data);
  btnEncurtar.style.display = 'none';

  aLink.innerText = linkCurto;
  aLink.href = linkCurto;
  smallData.innerHTML = `Link criado em: ${criacao.date} às ${criacao.time}`;

  const btnCopiar = document.createElement('button');
  btnCopiar.innerText = 'Copiar Link';
  btnCopiar.classList.add('btn', 'btn-copy');
  btnCopiar.addEventListener('click', function () {
    const inputLink = document.createElement('input');
    inputLink.value = linkCurto;
    document.body.appendChild(inputLink);
    inputLink.select();
    document.execCommand('copy');
    document.body.removeChild(inputLink);
    exibirMensagensInicio(true, 'Link copiado para a área de transferência!');
  });

  const shareList = document.createElement('ul');
  shareList.style.display = 'none';

  const socialMediaLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(linkCurto),
      iconClass: 'btn-facebook'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(linkCurto) + '&text=' + encodeURIComponent('Confira este link'),
      iconClass: 'btn-twitter'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(linkCurto),
      iconClass: 'btn-linkedin'
    },
    {
      name: 'WhatsApp',
      href: 'whatsapp://send?text=' + encodeURIComponent('Confira este link: ' + linkCurto),
      iconClass: 'btn-whatsapp'
    }
  ];

  socialMediaLinks.forEach((socialMedia) => {
    const link = document.createElement('a');
    link.href = socialMedia.href;
    link.target = '_blank';
    link.innerText = `Compartilhar no ${socialMedia.name}`;
    link.classList.add(socialMedia.iconClass);
    const listItem = document.createElement('li');
    listItem.appendChild(link);
    shareList.appendChild(listItem);
  });

  const btnCompartilhar = document.createElement('button');
  btnCompartilhar.innerText = 'Compartilhar';
  btnCompartilhar.classList.add('btn', 'btn-share');
  btnCompartilhar.addEventListener('click', function () {
    shareList.style.display = 'block';
    shareList.classList.add('show-transition');
  });

  const btnQRCode = document.createElement('button');
  btnQRCode.innerText = 'QR Code';
  btnQRCode.classList.add('btn', 'btn-qrcode');
  const qrCodeContainer = document.createElement('div');
  qrCodeContainer.id = 'qr-code-container';

  btnQRCode.addEventListener('click', function () {
    solicitaAcessoQR(linkId)
    QrCont.style.display = "block";
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');
  buttonContainer.appendChild(btnCopiar);
  buttonContainer.appendChild(btnCompartilhar);
  document.body.appendChild(shareList);
  buttonContainer.appendChild(btnQRCode);
  document.body.appendChild(buttonContainer);
  buttonContainer.insertBefore(qrCodeContainer, btnQRCode);

  document.addEventListener('click', function (event) {
    const targetElement = event.target;
    if (!shareList.contains(targetElement) && targetElement !== btnCompartilhar) {
      shareList.style.display = 'none';
    }
    if (!QrCont.contains(targetElement) && targetElement !== btnQRCode) {
      QrCont.style.display = 'none';
    }
  });
}


function solicitaAcessoQR(linkId) {
  const options = {
    method: 'POST',
    headers: {
      accept: 'image/png',
      'content-type': 'application/json',
      Authorization: apiKey
    },
    body: JSON.stringify({ type: 'png' })
  };

  fetch('https://api.short.io/links/qr/' + linkId, options)
    .then(response => {
      if (response.status === 201) {
        console.log("Verificação de Resposta Positiva");
      } else {
        console.log("Verificação Negada");
      }
      return response.blob()
    })
    .then(blob => {
      const imageURL = URL.createObjectURL(blob);
      const QRCode = document.createElement("img");
      QRCode.src = imageURL;
      const container = document.getElementById("QrCont");
      container.appendChild(QRCode);
    })
    .catch(err => console.error(err));
}



function copiaLink() {
  navigator.clipboard.writeText(aLink.href)
    .then(() => {
      exibirMensagensInicio(true, 'Link copiado com sucesso!');
      setTimeout(limparMensagens, 3500);
    })
    .catch((error) => {
      console.error('Erro ao copiar o link:', error);
      exibirMensagensInicio(false, 'Erro ao copiar o link. Por favor, tente novamente.');
      setTimeout(limparMensagens, 3500);
    });
}

function formataData(dateTime) {
  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const formattedDate = new Date(dateTime).toLocaleDateString('pt-BR', optionsDate);
  const formattedTime = new Date(dateTime).toLocaleTimeString('pt-BR', optionsTime);
  return { date: formattedDate, time: formattedTime };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (url === '') {
    urlFeedback.textContent = 'Por favor, insira um URL válido.';
    return;
  }
  urlFeedback.textContent = '';
  encurtarURL(url);
});


async function getShortLinks() {
  const apiKey = "sk_qiYiSepi1LRZRj8n";
  const domainId = "716308";

  const options = {
    headers: {
      Authorization: apiKey
    }
  };

  try {
    const response = await fetch(`https://api.short.io/api/links?domain_id=${domainId}&limit=30&dateSortOrder=desc`, options);

    if (response.ok && response.status === 200) {
      const data = await response.json();

      const listaLinks = document.getElementById("lista-de-links");

      if (data.links.length > 0) {
        listaLinks.innerHTML = "";

        data.links.forEach(link => {
          const row = listaLinks.insertRow();
          const linkEncurtadoCell = row.insertCell(0);
          const linkOriginalCell = row.insertCell(1);
          const dataHoraCell = row.insertCell(2);
          const acaoCell = row.insertCell(3);

          linkEncurtadoCell.innerHTML = `<a href="${link.secureShortURL}" target="_blank">${link.secureShortURL}</a>`;
          linkOriginalCell.textContent = link.originalURL;
          dataHoraCell.textContent = formatarData(link.createdAt);
          acaoCell.innerHTML = `<button class="button edit" onclick="editarLink('${link.id}')">Editar</button>
          <button class="button delete" onclick="deletarLink('${link.id}')">Excluir</button>`;
        });
      } else {
        listaLinks.innerHTML = '<tr><td colspan="4">Nenhum link disponível</td></tr>';
      }
    } else {
      throw new Error(`Resposta do servidor: ${response.status}`);
    }
  } catch (error) {
    console.error("Ocorreu um erro ao obter os links encurtados:", error);
  }
}


function formatarData(dataString) {
  const data = new Date(dataString);
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');

  return dia + '/' + mes + '/' + ano + ' ' + horas + ':' + minutos + ':' + segundos;
}




function deletarLink(linkId) {
  const apiKey = "sk_qiYiSepi1LRZRj8n";

  fetch(`https://api.short.io/links/${linkId}`, {
    method: "DELETE",
    headers: {
      Authorization: apiKey
    }
  })
    .then(response => {
      if (response.ok) {

        exibirMensagensInicio(true, 'Link Deletado Com Sucesso!');
        getShortLinks();
      } else {
        throw new Error('Ocorreu um erro ao deletar o link. Status: ' + response.status);
      }
    })
    .catch(error => {
      console.error("Ocorreu um erro ao deletar o link:", error);
      setTimeout(limparMensagens, 3500);
    });
}

getShortLinks();

var buttons = document.getElementsByClassName("button edit");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    var linkIdString = this.dataset.linkId;
    editarLink(linkIdString);
  });
}

async function editarLink(linkIdString) {
  try {
    console.log('Editar link:', linkIdString);

    const response = await fetch(`https://api.short.io/links/${linkIdString}`, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter o link');
    }

    const link = await response.json();
    const { path, originalURL } = link;
    exibirModal(path, originalURL, linkIdString);
  } catch (err) {
    console.error(err);
  }
}

function exibirModal(path, originalUrl, linkIdString) {
  const modal = document.getElementById('modalEditarLink');
  modal.style.display = 'block';

  const slugInput = document.getElementById('slug');
  const urlInput = document.getElementById('url');

  slugInput.value = path;
  urlInput.value = originalUrl;

  const salvarButton = document.querySelector('.salvar-edit');
  salvarButton.addEventListener('click', async () => {
    const novoSlug = slugInput.value;

    try {
      const response = await fetch(`https://api.short.io/links/${linkIdString}`, {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: apiKey
        },
        body: JSON.stringify({ path: novoSlug })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o slug do link');
      }

      console.log('Slug atualizado:', novoSlug);
      modal.style.display = 'none';
    } catch (err) {
      console.error(err);
    }
  });
}

function cancelarEdicao() {
  var modal = document.getElementById('modalEditarLink');
  modal.style.display = 'none';
}

var cancelarBtn = document.getElementsByClassName('cancelar-edit')[0];
cancelarBtn.addEventListener('click', function () {
  cancelarEdicao();
});
