'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelectorAll('.nav__link');
const navigation = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
});

// adding copies of events in all the elemets will reduce the performance and it is not very scalable solution
// navLinks.forEach(link=>{
//     link.addEventListener('click',function(e){
//         e.preventDefault();

//         const id = link.getAttribute('href');
//         document.querySelector(id).scrollIntoView({behavior:'smooth'});
//     })
// })
// alternative solution is event deligation.
// 1. add event listener to common parent elements.
// 2. Determine which element originate the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();

    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

// implementing tabs feature

tabsContainer.addEventListener('click', function (e) {
    const button = e.target.closest('.operations__tab');
    if (!button) return;
    tabs.forEach(tab => {
        tab.classList.remove('operations__tab--active');
    });

    tabsContent.forEach(content => {
        content.classList.remove('operations__content--active');
    });
    button.classList.add('operations__tab--active');
    document
        .querySelector(`.operations__content--${button.dataset.tab}`)
        .classList.add('operations__content--active');
});

// Menu fade animation.
// mouse enter event do not bubble
const handleLinkHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const image = link.closest('.nav').querySelector('img');

        siblings.forEach(elem => {
            if (elem != link) {
                elem.style.opacity = this;
            }
        });
        image.style.opacity = this;
    }
};

// the handler function can only contain one argument.
navigation.addEventListener('mouseover', handleLinkHover.bind(0.5));
navigation.addEventListener('mouseout', handleLinkHover.bind(1));

// sticky navigation
// if root = null then the root be the entire viewport
const hObserver = new IntersectionObserver(
    entries => {
        const [entry] = entries;
        if (!entry.isIntersecting) {
            navigation.classList.add('sticky');
        } else {
            navigation.classList.remove('sticky');
        }
    },
    {
        root: null,
        threshold: 0 /* means the element is completely out of view */,
        rootMargin: `-${
            navigation.getBoundingClientRect().height
        }px` /* a box of n pixel of margin will be applied outside the target element */,
    }
);
const header = document.querySelector('.header');
hObserver.observe(header);

// reveal sectioon
const allSections = document.querySelectorAll('.section');
const observeSection = new IntersectionObserver(
    (entries, observer) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('section--hidden');
        observeSection.unobserve(entry.target);
    },
    {
        root: null,
        threshold: 0.15,
    }
);

allSections.forEach(section => {
    observeSection.observe(section);
    section.classList.add('section--hidden');
});

// Lazy loading images:
const imageTarget = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver(
    (entries, observer) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.src = entry.target.dataset.src;
        // the js will find the new image from the specified source and creates a load event. we can listen to that event.
        entry.target.addEventListener('load', () => {
            entry.target.classList.remove('lazy-img');
        });

        imageObserver.unobserve(entry.target);
    },
    { root: null, threshold: 0, rootMargin: '200px' }
);
imageTarget.forEach(image => imageObserver.observe(image));

// building slider

const slides = document.querySelectorAll('.slide');
const slibtnleft = document.querySelector('.slider__btn--left');
const slibtnright = document.querySelector('.slider__btn--right');
let currSlide = 0;
const dotContainer = document.querySelector('.dots');
const maxSlide = slides.length;

slides.forEach((s, i) => {
    s.style.transform = `translateX(${i * 100}%)`;
});

function nextSlide() {
    currSlide++;
    slides.forEach((s, i) => {
        if (currSlide >= maxSlide) currSlide = 0;
        s.style.transform = `translateX(${(i - currSlide) * 100}%)`;
    });
}

function prevSlide() {
    currSlide--;
    slides.forEach((s, i) => {
        if (currSlide <= -maxSlide) currSlide = 0;
        s.style.transform = `translateX(${(i + currSlide) * 100}%)`;
    });
}

slibtnright.addEventListener('click', nextSlide);

slibtnleft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
});

const createDots = function () {
    slides.forEach((_, i) => {
        dotContainer.insertAdjacentHTML(
            'beforeend',
            `<button class="dots__dot" data-slide="${i}"></button>`,
        );
    });
};

const activateDot = function(current){
    document.querySelectorAll(".dots__dot").forEach(dot=>dot.classList.remove("dots__dot--active"));
    document.querySelector(`.dots__dot[data-slide="${current}"]`).classList.add('dots__dot--active');
}

createDots();
activateDot(0);

dotContainer.addEventListener('click',(e)=>{
    if(e.target.classList.contains('dots__dot')){
        const {slide} = e.target.dataset;
        slides.forEach((s, i) => {
            s.style.transform = `translateX(${(i - slide) * 100}%)`;
        });
        activateDot(slide);
    }
})


// This event is fired when all the html document code is loaded and parsed and converted into the DOM tree.
// for that reason the js code for this event should be included at the top of the document and not at the end of the document in the script tag. like it is right now.
document.addEventListener('DOMContentLoaded',(e)=>{
    console.log(e);
    console.log("dom content is loaded");
})

// When the complete page is finished loading then this event is fired. including images, videos and other code files.
document.addEventListener('load',(e)=>{
    console.log(e);
    console.log("content is loaded");
})

// This event runs immediately when the user is about to leave the page.
// document.addEventListener('beforeunload',(e)=>{
//     // not necessary but it is preferred and some browser requires it
//     e.preventDefault();

//     console.log(e);

//     //disply leaving conformation, we have to set the return value
//     e.returnValue = "";
// })


// window.addEventListener('scroll',()=>{
//     const cords = section1.getBoundingClientRect();
//     if(window.scrollY > cords.top){
//         navigation.classList.add('sticky');
//     }else{
//         navigation.classList.remove('sticky');
//     }
// })

// Using interaction observer api
// applying sticky behaviour to elements

// console.log(document);
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// It will return all elements with a section class in the form of a node list. it is not actually an array but have some methods of array. It do not updated automatically like the HTML collection.
// const allSection = document.querySelectorAll('.section');

// It will return an HTMLCollections which contains all the button tag elements. it is so because an HTML collection is so called life collection. means if the DOM changes then elements in this collection also changes. even if the element got removed/deleted independently then the collection will be updated automatically.
// const allBtns = document.getElementsByTagName("button");

// It also returns a html collection and only difference is that it select the elements based on the class name.
// const classbtns = document.getElementsByClassName('btn');

// creating and inserting elements in the dom.
// .insertAdjacentHTML()

// creating element
// it will create a unique element and it has a unique id and it cannot be at two places in the DOM.
// const newElement1 = document.createElement("div");
// newElement1.classList.add('cookie-message')
// newElement1.textContent = "we use cookies for improved functionality and analytics";
// newElement1.innerHTML = '<button class="btn btn--close--cookie"> Got it! </button>';

// const header = document.querySelector('.header')

// header.append(newElement1);

// only one unique element can be inserted. it will insert after the last child of the element in the DOM.
// .cloneNode will clone the element and true parameter passed will also clone the property values and crete a clone(copy) of the element
// header.append(newElement1.cloneNode(true));

// It insert a sibling element before the header.
// header.before(newElement1.cloneNode(true));

// It insert a sibling element after the header.
// header.before(newElement1.cloneNode(true));

// deleting elements in the DOM.
// newElement1.addEventListener('click',()=>{
//   // the .remove() method will remove element from the DOM but not from the variable stored in the program memory.
//   // newElement1.remove();

//   // accessing the parent element and then removing the child element in the dom by using the .removeChild method.
//   newElement1.parentElement.removeChild(newElement1);

//   setTimeout(()=>{
//     header.append(newElement1);
//   },1000)
// })

// The styles that we specify in js code are specified as inline styles in the html dom
// newElement1.style.backgroundColor = "darkblue";
// newElement1.style.scale = 3

// Trying to read the styles property values.
// reading the styles values will only work for those style properties that we specify ourselves inline in the DOM.
// console.log(newElement1.style.height); // print nothing
// console.log(newElement1.style.backgroundColor); // print background color because it is spcified inline due to the js code.
// we cannot access the styles that are hidden in a class or are not specified inline in the DOM element.

// we can access the hidden styles by accessing the computed styles that are applied on the element in the DOM, by using the .getComputedStyles method. It returns the style property value in the form of string.
// console.log(getComputedStyle(newElement1).color)
// newElement1.style.height = Number.parseInt(getComputedStyle(newElement1).height) + 40 + 'px';

// working with css custom properties/variables.
// the variable property in css is defined in the root of the document and should be accessed from sytles of the document object which is the root.
// setProperty methods is used to change the value of the custom properties/variables. It can also be used to change other css properties of the element.
// document.documentElement.style.setProperty('--color-primary','orangered');

// Html elements have attributes. which are just like the properties of an object. so we can access the attributes of the dom elements just like we access the properties of an object.

// accessing the attributes of an html element inside the DOM.
// const logo = document.querySelector(".nav__logo");

// these attributes are already present for the image objects. if we do this for any other js object the will just create a new property in the object.
// console.log(logo.className)
// console.log(logo.src);
// console.log(logo.alt);

// Non-standard property
// this will print undefined because designer attrbute is not expected to be in an image object.
// console.log(logo.designer);

// another way to read non-standard attributes use .getAttribute() methods.
// console.log(logo.getAttribute('designer'));

// set non-standard/standard attributes in a DOM object, use .setAttribute() methods.
// logo.setAttribute('new-attr','This is a value for a new attribute which is specified with the js methods')
// console.log(logo.getAttribute('new-attr'));

// give us the absolute url of the media files.
// logo.src;

// to literally get the specified url that we specify in the DOM object use the .getAttrbute() method
// It will work for all types of url type attributes
// console.log(logo.getAttribute('src'));

// there are some special attributes.
// one of them is the "data" attributes. "data" attributes are the ones that starts with the "data" word. like "data-version-number".etc. the values of these attributes are stored in the datset object in the DOM object. The data- prefix tesll to store the value in the dataset object and the remaining property name should be written in camel case. so "data-version-number" will be accessed from the DOM object as element.dataset.versionNumber.
// console.log(logo.dataset.versionNumber);

// Classes
// can also add/remove/toggle/contain multpile class by passing multiple parameters.
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// we can also set classes with className property.
// but it is not recommended to use this.
// it overwrite the existing classes and also only one class can be specified in the classList attribute.
// logo.className = "not-present";

// btnScrollTo.addEventListener('click', function (e) {
// get rectangular coordinates of an element
// console.log(section1.getBoundingClientRect());

// gte the details for the button which is clicked.
// the get bounding cliennt rect is relative tot he visible viewport.
// console.log(e.target.getBoundingClientRect());

// get teh currently scrolled pixels on the page.
// console.log(window.pageXOffset,window.pageYOffset);

// height and width relative to the visible part(viewport) of the web site;
// console.log("Client height: " + document.documentElement.clientHeight)
// console.log("Client width: " + document.documentElement.clientWidth)

// let sect1Coords = section1.getBoundingClientRect();

// scroll to
// let scroll = {
//     left: sect1Coords.left + window.pageXOffset,
//     top: sect1Coords.top + window.pageYOffset,
//     behavior: 'smooth',
// };
// window.scrollTo(scroll);

// alternative way to scroll without  doing any calculations
// section1.scrollIntoView({ behavior: 'smooth' });

// .target returns the element where the event was happened in the hirerchy
// console.log(e.target);

// .currentTarget returns the current element where the event happened
// console.log(e.currentTarget);

// to stop event propagaion in the bubbling phase use .stopPropagation() method
// e.stopPropagation();

// The default behavior of addEventListener is to listen to events in the bubbling phase but we can also listen to events in the capturing phase by passing a third parameter in the handler.
// Then the handler will listen to to down events and not events going from bottom to top(root)
// },true);

// event types and event handling
// events always happen even if we do not liten to them or handle them.
// const heading = document.querySelector('h1');
// // there is a property for each event in the object
// // old scholl way of listening to eventsl
// // heading.onmouseenter = function(e){alert("mouse enters in the heading")};

// const alertEnter = function (e) {
//     alert('mouse enters in the heading');
//     // we can also remove functions from the event listeners;
//     heading.removeEventListener('mouseenter', alertEnter);
// };

// // modern way
// // It allows us to add multiple functions to call on a single event. by aggain creating an event listener and passing a function into that event listener.
// heading.addEventListener('mouseenter', alertEnter);

// const heading = document.querySelector('h1');

// going downwards
// console.log(heading.querySelectorAll('.highlight'));
// selecting direct child nodes. it returns all kinds of children in the element
// console.log(heading.childNodes);
// to get the children that are actually in the element.
// console.log(heading.children);
// console.log(heading.firstChild);
// console.log(heading.lastChild);
// console.log(heading.firstElementChild);
// console.log(heading.lastElementChild);

// going upwards
// console.log(heading.parentNode);
// console.log(heading.parentElement);
// .closest methods receives a string and returns the closes parent element which contains the specified element which is passed as a string in the function call.
// queryselector finds children in the DOM. But, closest finds parent in the DOM.
// console.log(heading.closest("h1"));

// going sideways(siblings)
// in js we can only select direct siblings
// console.log(heading.previousElementSibling);
// console.log(heading.previousSibling);
// console.log(heading.nextElementSibling);
// console.log(heading.nextSibling);
//     // getting all the siblings
// console.log(heading.parentElement.children);
