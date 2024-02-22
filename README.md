# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scsss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Архитектура проекта 
  Проект реализует архитектурных подход MVP (Model-View-Presenter)
  * В роли моделей (Model - бизнес-логика) выступают классы : `Product`, `Basket`, `Catalog` и `Order`. Они находятся в файле AppData;
  * В роли представления (View) выступают классы `CardUI`, `CardPreviewUI`, `BasketUI`, `PageUI`, `OrderDeliveryUI`, `OrderContactFormUI`, `SuccessUI`
  * В роли же презентера (Presenter - посредника между Model и View) выступает файл index, связь создается через событийно-ориентированный подход.


## Базовый код 

# 1. Класс EventEmmiter
  Представляет собой реализацию брокера событий для обработки и передачи событий. В проекте он используется для связи между модулем (`Modul`) и представлением (`View`).
  Класс находится в файле events.ts.
  Он реализует следующий интерфейс:

  ```
  interface IEvents {
      on<T extends object>(event: EventName, callback: (data: T) => void): void;
      emit<T extends object>(event: string, data?: T): void;
      trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
    }
  ```
  Внутри себя класс инициализирует структуру данных `_events`, которая представляет собой коллекцию ключ/значение (`Map`), где в качестве ключей выступают имена событий (`EventName`), а в качестве значений - множество подписчиков (`Set<Subscriber>`).

  Класс имеет следующие методы:

  * Метод `on` устанавливает обработчик для указанного события. Принимает имя события (`eventName`) и коллбэк-функцию (`callback`), которая будет вызвана при возникновении события.
  Метод `off` удаляет обработчик для события. Также принимает имя события (`eventName`) и коллбэк-функцию, которая была установлена с помощью метода `on`.
  Метод `emit` создает событие с указанным именем (`eventName`) и опциональными данными (`data`). Вызывает все установленные обработчики на событие. 
  Метод `onAll` позволяет установить обработчик на все события. В качестве аргумента принимает коллбэк-функцию, которая будет срабатывать при возникновении любого события.
  Метод `offAll` удаляет все установленные обработчики событий.
  Метод `trigger` возвращает функцию-триггер, которая при вызове генерирует указанное событие с заданным контекстом (`context`).

# 2. Класс Api
  Обеспечивает работу с внешними `API`. С его помощью можно отправлять HTTP-запросы: `GET`, `POST`, `PUT` и `DELETE`. 
  Класс находится в файле api.ts. 
  Конструктор при инициализации принимает два параметра: базовый `URL` для запросов (`baseUrl`) и объект с опциями запроса типа `RequestInit` (`options`). 

  Имеет следующие методы:
  * Метод `handleResponse` отвечает за обработку ответов сервера. Он может либо отклонить ответ и выбросить ошибку, либо вернуть данные сервера в виде промиса (`Promise`).
  * Метод `get` принимает аргументом (`uri`) (относительный путь) и отправляет по указанному URL-адресу `GET` запрос. Конструкция запроса формируется путем конкатенации базового `URL` и `URI` (`baseUrl + uri`). Возвращает JSON-данные в виде ответа и отправляет их в метод `handleResponse`.
  * Метод `post` аналогично предыдущему методу принимает (`uri`), а также данные для отправки (`data`) и метод запроса (`method`), который имеет тип `ApiPostMethods` и значение по умолчанию `POST`. Затем результат запроса передается в метод `handleResponse`, который обрабатывает ответ и возвращает данные или выбрасывает ошибку.

# 3. Класс View 
  Класс является базовым для элементов отображения на странице. Дженерик внутри (`T`) представляет тип данных, который будет использоваться для отображения в интерфейсе. Принимает HTML-объект контейнера. 
  Имеет множество методов:

  * Метод `toggleClass`
  Добавляет или удаляет указанный класс CSS (`className`) для заданного элемента (`element`), а `force` позволяет явно указать нужно ли добавлять или удалять класс, но он необязательный. 

  * Метод setText
  Устанавливает текстовое содержимое (`value`) для указанного элемента (`element`).

  * Метод setDisabled
  Устанавливает или удаляет атрибут disabled для указанного элемента (`element`) в зависимости от значения `state`.

  * Метод `setHidden`
  Скрывает указанный элемент (`element`), устанавливая для него свойство `display` в значение none.

  * Метод `setVisible`
  Отображает указанный элемент (`element`), удаляя значение свойства `display`.

  * Метод `setImage`
  Устанавливает источник изображения (`src`) и необязательный атрибут `alt` для указанного элемента с типом `HTMLImageElement`.

  * Метод `render`
  Обновляет интерфейс. Аргументом принимает данные (`data`) для отображения в интерфейсе. Эти данные будут применены к экземпляру класса, обновляя его состояние.

# 4. Класс Model 
  Класс `Model` представляет собой абстрактный базовый класс для моделей в приложении. 
  В конструкторе принимает в качестве аргумента `data` данные `Partial`, что делает все свойства объекта из дженерика (`T`) необязательными. Внутри себя он копирует данные из `data` в экземпляр класса (`this`), что представляет собой начальное состояние модели. 

  Имеет один метод:
  * Метод `emitChanges` используется для уведомления о изменениях в модели. Он принимает имя события и необязательные данные (`payload`), которые будут переданы вместе с событием.


## Общие компоненты

# 1. Класс Modal 
  Расширяет базовый класс `View` и отвечает за работу модального окна. Устанавливает переданные данные в свойство `content`, а также при инициализации создает слушателей для закрытия окна. 
  Метод `open` открывает модальное окно, добавляя соответствующий класс и отправляет событие `'modal:open'`. 
  Метод `close` закрывает модальное окно и создает событие `'modal:close'`. 
  Метод render используется для отображения контента и автоматически вызывает метод open.

# 2. Класс Form
  Как и предыдущий класс, Form расширяет базовый компонент `View`. Он представляет собой форму и обеспечивает работу с её состоянием, валидацией и отправкой данных. Класс прослушивает события ввода данных и отправки. 
  С помощью метода `onInputChange` создается событие `'change'`, в котором передаются название измененного поля и его значение. 
  Свойство `valid` устанавливает состояние доступности кнопки отправки формы, а свойство `error` обеспечивает вывод ошибок. 
  Метод `render` отвечает за отрисовку формы, включая её текущее состояние.
    

## Компоненты модели данных (бизнес-логика)

# 1. Класс Product
  Расширяет класс `Model`, обеспечивает хранение и представление данных.
  Интрефейс класса
  
    ``` 
    interface IProduct {
  	  id: string;
      title: string;
    	description: string;
    	image: string;
    	category: categoryOptions;
    	price: number;
      isAddedToBasket: boolean;
    }
    ```
# 2. Класс Basket 
  Расширяет класс `Model` со следующим интерфейсом:
  
  ```
    type IProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;
  ```

  Данные о продуктах корзины представлены в виде массива: `IProductBasket[]`
  
  Сам класс отвечает за работу с данными корзины, с его помощью можно:
  * Полностью очищать корзину с помощью метода `clearBasket`.
  * Удалять и добавлять товары с использованием методов `removeProduct` и `addProduct`.
  * Получать общую сумму товаров в корзине с помощью метода `getTotalAmount`.
  
  Получение данных о всех предматах в корзине осуществщяется методом `getProductList` он создает событие `'basket:change'` и передает в него массив данных
  При оформлении заказа срабатывает метод `makeOrder`, он осуществляется проверку товаров и создает событие `'basket:order'`

# 3. Класс Catalog
  Расширяет класс `Model` со следующим интерфейсом:
  
  ```
    IProduct[]
  ```

  Отвечает за работу с каталогом сайта. Хранит данные о продуктах в виде массива. 
  Инициализация происходит методом `setCatalog`, который принимает данные, обрабатывает их и отправляет событие `'catalog:updated'`.

# 4. Класс Order
  Расширяет класс `Model` со следующим интерфейсом:
  
  ```
  interface IOrderContact {
    phone: string;
    email: string;
}

  interface IOrderDelivery{
    address: string;
    payment: paymentOptions;
}

  interface IOrder extends IOrderContact, IOrderDelivery {
    total: number;
    items: string[];
}
  ```

  Этот класс управляет данными во время оформления заказа. Хранит информацию о способе доставки и адресе (первый блок), а также об электронной почте и номере телефона (второй блок). 
  Также содержит общую сумму заказа и `id` товаров из корзины. Все данные имеют значения по умолчанию.
  Содержит следующие методы для работы:
  Метод `setDeliveryField` принимает и устанавливает соответствующие значения в свойства (способ доставки и адрес). Он также осуществляет проверку данных с помощью метода `validateDelivery`. В случае успешной проверки метод создает событие `'order.delivery:ready'` и передает в него экземпляр класса.
  Метод `setContactField` выполняет аналогичную функцию, но работает с данными телефона и электронной почты, его проверку выполняет метод `validateContact`, который создает событие `'order.contact:ready'` и также передает туда экземпляр класса


## Компоненты представления

# 1. Класс CardUI
  Расширяет класс View со следующим интерфейсом:
  
  ```
  interface IProduct {
  	id: string;
    title: string;
  	description: string;
  	image: string;
  	category: categoryOptions;
  	price: number;
    isAddedToBasket: boolean;
  }
  ```

Этот класс предназначен для отображения информации о товарах на странице сайта. При инициализации принимает название блока (контейнера), сам контейнер и необязательный аргумент `action` для настройки действий. 
В конструкторе класса инициализируются следующие элементы: заголовок (`titleElement`), цена (`priceElement`), описание (`descriptionElement`), изображение (`imageElement`), категория (`categoryElement`) и кнопка (`buttonElement`). Также происходит проверка наличия объекта `action`: в случае его наличия создается событие на кнопке, в противном случае событие присваивается блоку. 
Через методы `set` и `get` в классе осуществляется установка контента внутри блока. 

# 2. Класс CardPreviewUI
  Расширяет класс `CardUI`

  Класс предназначен для отображения товара в модальном окне
  Он наследует все свойства и методы родителя, но изменяет метод `render` добавляя в него проверку на наличие в корзине `isAddedToBasket`, если товар там отсутствует, то будет кнопка будет "В корзину", иначе "Убрать из корзины"

# 3. Класс BasketUI
  Расширяет класс View со следующим интерфейсом:
  
  ```
  interface IBasketView{
    products: HTMLElement[];
    totalAmount: number;
  }
  ```

  Класс отвечает за отображение данных корзины. При объявлении принимает контейнер класса и `EventEmmiter`.
  Внутри конструктора объявляет: Список товаров (`listElement`), Общую сумму (`totalAmountElement`) и кнопку оформления (`buttonElement`), на кнопку сразу вешается слушатель, генерирующий событие `'order:open'` - переход в модальное окно с оформлением
  С помощью методов `set` устанавливается список товаров(`set products`) и их сумма (`set totalAmount`)

# 4. Класс PageUI
  Расширяет класс `View` со следующим интерфейсом:
  
  ```
  interface IPage{
    catalog: HTMLElement[];
    basketCounter: number;
    pageLock: boolean;
  }
  ```

  Класс отвечает за отображение и управление элементами страницы. Содержит методы для установки каталога продуктов, обновления счетчика корзины и блокировки страницы.
  Констурктор принимает аргументы самого контейнера и EvemtEmmiter
  Свойства реализующиеся внутри конструктора: Счетчик элементов в корзине(`basketCounterElement`), Кнопка для перехода в корзину(`basketButtonElement`), Каталог или же галерея товаров (`catalogElement`), Обертка страницы (`pageWrapperElement`)
  Кнопке сразу присваивается слушатель гененрирующий событие `'basket:open'` - открытие корзины с товарами
  Методы класса через `set` инициализируют каталог товаров (`set catalog`), и их число на корзине (`set busketNumber`), а через (`set pageLock`) происходит блокировка или разблокировка страницы.

# 5. Класс OrderDeliveryUI 
  Расширяет класс `Form`
  При создании экземпляра принимает в аргументы контейнер и `EvenEmmiter`, все это он передает в родителя `Form`. Через наследование свойств и методов родителя создается кнопка для отправки (`_submit`) и блок для вывода ошибок (`_errors`). На контейнер вешается событие, которое будет срабатывать при изменении любого поля формы. 
  Через метод `set address` устанавливает значение адреса в поле формы. Принимает строку `value` и устанавливает ее в качестве значения поля.
  То же самое делает метод `set payment`, но устанавливает значение для способа оплаты

# 6. Класс OrderContactFormUI
  Расширяет класс `Form`
  Прицип устройства такой же, что и у класса `OrderDeliveryUI`, но отвечает за заполнение номера телефона (`set phone`) и адреса электронной почты (`set email`)

# 7. Класс SuccessUI
  Расширяет класс `View` со следующим интерфейсом:
  
  ```
  interface ISuccess {
    totalAmount: number;
  }
  ```

  Его задача после оформления вывести окно об успешно пройденном заказе.
  При создании экземпляра принимает конструктор и действие `action` в качестве аргументов
  Внутри себя инициализирует одну кнопку `closeButton`, которая отвечает за закрытие модального окна и возврат обратно к каталогу товаров. 
  Имеет один метод `set totalAmount` для установки значения списанной суммы 
