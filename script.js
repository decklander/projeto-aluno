//comportamento do botão menu
const botaoMobile = document.getElementById('botao-mobile')

function toggleMenu(event) {
    if(event.type === 'touchstart') event.preventDefault()
    const nav = document.getElementById('navegacao')
    nav.classList.toggle('active')
    console.log(nav.classList)
    const active = nav.classList.contains('active')
    event.currentTarget.setAttribute('aria-expended', active)
    if(active){
        event.currentTarget.setAttribute('aria-label', 'Fechar Menu')
    } else {
        event.currentTarget.setAttribute('aria-label', 'Abrir Menu')
    }
}

botaoMobile.addEventListener('click', toggleMenu)
botaoMobile.addEventListener('touchstart', toggleMenu)

//comportamento da logo
