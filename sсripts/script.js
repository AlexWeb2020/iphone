document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();
    console.log(request);

    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        callback(response);
        console.log(response);
      }
      else {
        console.error(new Error('Ошибка' + request.status));
      }
    });
  };

  const getBasePhone = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();

    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        callback(response);
      }
      else {
        console.error(new Error('Ошибка' + request.status));
      }
    });
  };

  const tabs = () => {
    const cardDetailChangeElems = document.querySelectorAll('.card-detail__change');
    const cardDetailsTitleElem = document.querySelector('.card-details__title');
    const cardImageItemElem = document.querySelector('.card__image_item');
    const cardDetailsPriceElem = document.querySelector('.card-details__price');
    const descriptionMemory = document.querySelector('.description__memory');

    /* вывод описания характеристик (выводит срвзу все)*/
    const renderPhoneDescription = () => {
      const cardDetailsDescriptionList = document.querySelector('.card-details__description-list');

      const createDescriptionItem = (phone) => {
        const ulItem = document.createElement('ul');
        ulItem.innerHTML =
          `
            <li class="card-details__description-item description__screen">Экран ${phone.screen} Пикс</li>
            <li class="card-details__description-item description__tech-screen">Технология экрана ${phone.tech - screen} </li>
            <li class="card-details__description-item description__processor">Тип процессора A14 Bionic</li>
            <li class="card-details__description-item description__memory">Встроенная память (ROM) ${phone.memoryROM}  ГБ</li>
            <li class="card-details__description-item description__camera">Основная камера МПикс ${phone.camera}</li>
          `;
        return ulItem;
      };

      const createPhonelList = (phones) => {
        phones.forEach(item => {
          cardDetailsDescriptionList.append(createDescriptionItem(item));
        });
      };

      getBasePhone('cross-sell-dbase/phonebase.json', createPhonelList);
    };

    const data = [
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Graphite',
        img: 'img/iPhone-graphite.png',
        price: '91990',
        memoryROM: 128,
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 256GB Silver',
        img: 'img/iPhone-silver.png',
        price: '119990',
        memoryROM: 256,
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Pacific Blue',
        img: 'img/iPhone-blue.png',
        price: '92990',
        memoryROM: 128,
      },
    ];

    cardDetailsPriceElem.textContent = data[0].price + '₽';

    const deactive = () => {
      cardDetailChangeElems.forEach(btn => btn.classList.remove('active'))
    };

    cardDetailChangeElems.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (!btn.classList.contains('active')) {
          deactive();
          btn.classList.add('active');
          cardDetailsTitleElem.textContent = data[i].name;
          cardImageItemElem.src = data[i].img;
          cardImageItemElem.alt = data[i].name;
          cardDetailsPriceElem.textContent = data[i].price + '₽';
          descriptionMemory.textContent = `Встроенная память (ROM) ${data[i].memoryROM} ГБ`;
        }
      });
    });
  };

  const accordion = () => {
    const characteristicsListElem = document.querySelector('.characteristics__list');
    const characteristicsItemElems = document.querySelectorAll('.characteristics__item');

    const open = (button, dropDown) => {
      closeAllDrops();
      dropDown.style.height = `${dropDown.scrollHeight}px`;
      button.classList.add('active');
      dropDown.classList.add('active');
    };

    const close = (button, dropDown) => {
      button.classList.remove('active');
      dropDown.classList.remove('active');
      dropDown.style.height = '';
    };

    const closeAllDrops = (btn, dropDown) => {
      characteristicsItemElems.forEach((elem) => {
        if (elem.children[0] !== btn && elem.children[1] !== dropDown) {
          close(elem.children[0], elem.children[1]);
        }
      });
    };

    characteristicsListElem.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('characteristics__title')) {
        const parent = target.closest('.characteristics__item');
        const description = parent.querySelector('.characteristics__description');
        description.classList.contains('active') ?
          close(target, description) :
          open(target, description);
      }
    });
  };

  const modal = () => {
    const modal = document.querySelector('.modal');
    const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy');
    const cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery');
    const cardDetailsTitle = document.querySelector('.card-details__title');
    const modalTitle = modal.querySelector('.modal__title');
    const modalSubtitle = modal.querySelector('.modal__subtitle');

    const openModal = (event) => {
      const target = event.target;
      modal.classList.add('open');
      document.addEventListener('keydown', escapeHandler);
      modalTitle.textContent = cardDetailsTitle.textContent;
      modalSubtitle.textContent = target.dataset.buttonBuy;
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.removeEventListener('keydown', escapeHandler);
    };

    const escapeHandler = (event) => {
      if (event.code === "Escape") {
        closeModal();
      }
    };

    modal.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('modal__close') || target === modal) {
        closeModal();
      }
    });

    cardDetailsButtonBuy.addEventListener('click', openModal);
    cardDetailsButtonDelivery.addEventListener('click', openModal);
  };

  const renderCrossSell = () => {
    const crossSellList = document.querySelector('.cross-sell__list');

    const allGoods = [];
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);

    const createCrossSellItem = (good) => {

      /* деструктур-я */
      const { photo, name, price } = good;

      const liItem = document.createElement('li');
      liItem.innerHTML =
        `
      	<article class="cross-sell__item">
					<img class="cross-sell__image" src="${photo}" alt="${name}" />
					<h3 class="cross-sell__title">${name}</h3>
					<p class="cross-sell__price">${price}</p>
					<button type="button" class="button button_buy cross-sell__button">Купить</button>
				</article>      
      `;
      return liItem;
    };


    const createCrossSellList = (goods = []) => {
      allGoods.push(...goods);
      crossSellList.textContent = '';
      const shuffleGoods = shuffle(allGoods);
      const fourItems = shuffleGoods.slice(0, 4);
      shuffleGoods.forEach(item => {
        crossSellList.append(createCrossSellItem(item));
      });
      setTimeout(createCrossSellList, 10000);
    };

    getData('cross-sell-dbase/dbase.json', createCrossSellList);
  };

  tabs();
  accordion();
  modal();
  renderCrossSell();
  amenu('.header__menu', '.header-menu__list', '.header-menu__item', '.header-menu__burger');
});