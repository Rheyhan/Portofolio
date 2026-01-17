/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')
/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))
/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
    skillsHeader = document.querySelectorAll('.skills__header')

const skillsItems = Array.from(document.querySelectorAll('.skills__content'))

function reflowSkillsColumns() {
    const openColumn = document.querySelector('.skills__column--open')
    const closeColumn = document.querySelector('.skills__column--close')

    if (!openColumn || !closeColumn) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches

    if (isMobile) {
        closeColumn.innerHTML = ''
        skillsItems.forEach((item) => openColumn.appendChild(item))
        return
    }

    skillsItems.forEach((item) => {
        if (item.classList.contains('skills__open')) {
            openColumn.appendChild(item)
        } else {
            closeColumn.appendChild(item)
        }
    })
}

function updateSkillsListHeights() {
    const items = document.querySelectorAll('.skills__content')
    items.forEach((item) => {
        const list = item.querySelector('.skills__list')
        if (!list) return

        if (item.classList.contains('skills__open')) {
            list.style.maxHeight = list.scrollHeight + 'px'
        } else {
            list.style.maxHeight = '0px'
        }
    })
}

function toggleSkills() {
    let itemClass = this.parentNode.className

    for (i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close'
    }
    if (itemClass === 'skills__content skills__close') {
        this.parentNode.className = 'skills__content skills__open'
    }

    reflowSkillsColumns()
    updateSkillsListHeights()
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills)
})

reflowSkillsColumns()
updateSkillsListHeights()
window.addEventListener('resize', reflowSkillsColumns)
window.addEventListener('resize', updateSkillsListHeights)

/*==================== QUALIFICATION TABS ====================*/


/*==================== SERVICES MODAL ====================*/
const modalViews = document.querySelectorAll('.services__modal'),
    modalBtns = document.querySelectorAll('.services__button'),
    modalCloses = document.querySelectorAll('.services__modal-close')

let modal = function (modalClick) {
    modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
        modal(i)
    })
})

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        modalViews.forEach((modalView) => {
            modalView.classList.remove('active-modal')
        })
    })
})


/*==================== PORTFOLIO SWIPER  ====================*/
let certPortfolio = new Swiper('.cert__container', {
    cssMode: true,
    loop: false,
    pagination: {
        el: '.swiper-pagination.cert__pagination',
        type: 'fraction',
    },
});


/*==================== PORTFOLIO FILTERS + PAGINATION ====================*/
const portfolioFilters = document.querySelectorAll('.portfolio__filter');
const portfolioCards = Array.from(document.querySelectorAll('.portfolio__card'));
const portfolioPrevBtn = document.querySelector('.portfolio__page-btn--prev');
const portfolioNextBtn = document.querySelector('.portfolio__page-btn--next');
const portfolioPageStatus = document.querySelector('.portfolio__page-status');

if (portfolioFilters.length && portfolioCards.length) {
    const pageSize = 6;
    let currentPage = 1;
    let activeFilter = 'all';

    const getFilteredCards = () => {
        return portfolioCards.filter((card) => {
            const category = card.dataset.category || '';
            const categories = category.split(' ').filter(Boolean);
            return activeFilter === 'all' || categories.includes(activeFilter);
        });
    };

    const renderPortfolioPage = () => {
        const filteredCards = getFilteredCards();
        const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
        currentPage = Math.min(currentPage, totalPages);

        portfolioCards.forEach((card) => {
            card.style.display = 'none';
        });

        const startIndex = (currentPage - 1) * pageSize;
        const visibleCards = filteredCards.slice(startIndex, startIndex + pageSize);
        visibleCards.forEach((card) => {
            card.style.display = 'flex';
        });

        if (portfolioPageStatus) {
            portfolioPageStatus.textContent = `${currentPage}/${totalPages}`;
        }

        if (portfolioPrevBtn) {
            portfolioPrevBtn.disabled = currentPage === 1;
        }
        if (portfolioNextBtn) {
            portfolioNextBtn.disabled = currentPage === totalPages;
        }
    };

    portfolioFilters.forEach((button) => {
        button.addEventListener('click', () => {
            portfolioFilters.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            activeFilter = button.dataset.filter || 'all';
            currentPage = 1;
            renderPortfolioPage();
        });
    });

    if (portfolioPrevBtn) {
        portfolioPrevBtn.addEventListener('click', () => {
            currentPage = Math.max(1, currentPage - 1);
            renderPortfolioPage();
        });
    }

    if (portfolioNextBtn) {
        portfolioNextBtn.addEventListener('click', () => {
            currentPage += 1;
            renderPortfolioPage();
        });
    }

    renderPortfolioPage();
}

/*==================== TESTIMONIAL ====================*/
let swiperTestimonial = new Swiper('.testimonial__container', {
    loop: true,
    grabCursor: true,
    spaceBetween: 48,


    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints:{
        568:{
            slidesPerview: 2,
        }
    }
});

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


/*==================== SHOW SCROLL UP ====================*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

let swiper = new Swiper(".experience__container", {
    cssMode: false,  // <--- IMPORTANT: Must be false for mousewheel to work horizontally
    spaceBetween: 24,
    loop: false,
    
    // Pagination
    pagination: {
        el: ".swiper-pagination.experience__pagination",
        clickable: true,
        bulletClass: 'experience__bullet',
        bulletActiveClass: 'experience__bullet-active',
    },



    // Breakpoints
    breakpoints: {
        0: {
            slidesPerView: 2,
            spaceBetween: 16,
        },
        576: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    },
    
    // Optional: smooth keyboard control
    keyboard: true,
});