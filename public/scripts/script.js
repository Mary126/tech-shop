//при открытии сайта
let xhr = new XMLHttpRequest();
    xhr.open("GET", "/main", true);
    xhr.onreadystatechange = function() { 
        if (xhr.readyState != 4) return;
        main.innerHTML = xhr.responseText;
        slideshow();
    }
    xhr.send();
//при прокрутке страницы убрать заголовок
let check = false;
addEventListener("scroll", function(){
    if (window.pageYOffset > 100) {
        head.style.display = "none";
        check = true;
        
    }
    else {
        head.style.display = "block";
    }
})

// ассинхр. запросы
let catalog = document.getElementById("catalog");
let about = document.getElementById("about");
let main_page = document.getElementById("man");
let cart_page = document.getElementById("cart");
let main = document.getElementById("main");

// about
function submit_form() {
    document.getElementById('submit').addEventListener("click", function() {
        alert("Отзыв отсправлен")
    })
}
about.addEventListener("click", function() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/about", true);
    xhr.onreadystatechange = function() { 
        if (xhr.readyState != 4) return;
        main.innerHTML = xhr.responseText;
        submit_form()
    }
    xhr.send();
})
// main 
function slideshow() {
    let picture = document.getElementById("pres")
    let s = document.getElementById("adv")
    let a = 1
    function NumbersInterval() {
        if (a == 1) {
            picture.classList.remove("pr1")
            picture.classList.add("pr2")
            a = 2;
        }
        else if (a == 2){
            picture.classList.remove("pr2")
            picture.classList.add("pr3")
            a = 3;
        }
        else if (a == 3) {
            picture.classList.remove("pr3")
            picture.classList.add("pr1")
            a = 1
        }
        
    }
    let g = setInterval(NumbersInterval, 4000);
}
main_page.addEventListener("click", function() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/main", true);
    xhr.onreadystatechange = function() { 
        if (xhr.readyState != 4) return;
        main.innerHTML = xhr.responseText;
        slideshow();
    }
    xhr.send();
})
//каталог
let cart = {}
let localCart = localStorage.getItem("cart")
function add_to_cart() {
    let buyBtns = document.querySelectorAll(".prodbutton");
    for (let i = 0; i < buyBtns.length; i++) {
        buyBtns[i].addEventListener("click", function () {
            alert("Товар добавлен в корзину")
            let item = buyBtns[i].getAttribute("data-item")
            let name = buyBtns[i].getAttribute("data-id")
            if(!cart[name]) {
                cart[name] = JSON.parse(item)
            }
            else {
                if (isFinite(cart[name]["colvo"])) {
                    cart[name]["colvo"] = cart[name]["colvo"] + 1
                }
                else {
                    cart[name]["colvo"] = 1
                }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
        })
    }
}

catalog.addEventListener("click", function(){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/galery", true);
    xhr.onreadystatechange = function() { 
        if (xhr.readyState != 4) return;
        main.innerHTML = xhr.responseText;
        add_to_cart();
    }
    xhr.send(); 
})

//корзина
let sum = 0
let ch = true
function displaycartitems(){
    let tot = document.getElementById("tot")
    let w = document.getElementById("wrapb")
    let localCart = localStorage.getItem("cart")
    function non() {
        let obj = document.createElement("tr")
        obj.id = "None"
        obj.innerHTML = "В корзине нет товаров"
        obj.style = "font-size: 13px; color: #666; margin: 10px;"
        w.insertBefore(obj, w.children[1])
    }
    if (localCart) cart = JSON.parse(localCart)
    if(JSON.stringify(cart) == "{}") {
        non()
        ch = false
    }
    else {
        ch = true
        for (var i in cart) {
            // сам обьект
            let obj = document.createElement("tr")
            obj.id = i
            // image
            let tr = document.createElement("th")
            let image = new Image()
            image.src = "../products/" + cart[i]["image"] + ".jpg"
            image.style.height = "200px"
            image.style.width = "200px"
            tr.appendChild(image)
            obj.appendChild(tr)
            //заголовок
            let name = document.createElement("th")
            name.innerHTML = i
            obj.appendChild(name)
            //количество
            let info = document.createElement("th")
            info.id = "info" + i
            info.classList.add("center")
            info.innerHTML = cart[i]["colvo"] + " шт"
            obj.appendChild(info)
            // цена
            let price = document.createElement("th")
            price.classList.add("right")
            price.id = "price" + i
            price.innerHTML = cart[i]["price"] + ' руб'
            obj.appendChild(price)
            //total 
            let summ = document.createElement("th")
            summ.classList.add("right")
            summ.id = "summ" + i
            summ.innerHTML = cart[i]["price"] * cart[i]["colvo"] + ' руб'
            sum += cart[i]["price"] * cart[i]["colvo"]
            obj.appendChild(summ)
            //кнопка удалить из корзины
            let button = document.createElement("th")
            button.classList.add("item-delete")
            button.classList.add("right")
            button.innerHTML = "<a href='#'><img src='style/images/remove_x.gif' alt='remove' /><br />Удалить из корзины</a>"
            button.id = i
            obj.appendChild(button)
            w.insertBefore(obj, w.children[1])
        }
    }  
    tot.innerHTML = sum + " руб"
    let delBtns = document.querySelectorAll(".item-delete");
    for (let i = 0; i < delBtns.length; i++) {
        delBtns[i].addEventListener("click", function () {
            let item = delBtns[i].getAttribute("id")
            if (cart[item]["colvo"] > 1) {
                cart[item]["colvo"] = cart[item]["colvo"] - 1
                let info = document.getElementById("info" + item)
                let price = document.getElementById("price" + item)
                info.innerHTML = cart[item]["colvo"] + ' шт'
                price.innerHTML = cart[item]["price"] * cart[item]["colvo"] + ' руб'
                sum -= cart[item]["price"]
                tot.innerHTML = sum + " руб"
            }
            else {
                sum -= cart[item]["price"]
                tot.innerHTML = sum + " руб"
                delete cart[item]
                let obj = document.getElementById(item)
                obj.remove()
                if(JSON.stringify(cart) == "{}") {
                    non()
                    ch = false;
                    tot.innerHTML = "0 руб"
                }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
        })
    }
    let ret = document.getElementById("return")
    ret.addEventListener("click", function(){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/galery", true);
        xhr.onreadystatechange = function() { 
            if (xhr.readyState != 4) return;
            main.innerHTML = xhr.responseText;
            add_to_cart();
        }
        xhr.send(); 
    })
    
    let checkout = document.getElementById("checkout")
    checkout.addEventListener("click", function(){
        if (ch) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "/checkout", true);
            xhr.onreadystatechange = function() { 
                if (xhr.readyState != 4) return;
                main.innerHTML = xhr.responseText;
                checkou()
            }
            xhr.send();
        }
        else {
            alert("В корзине нет товаров")
        }
    })
}
cart_page.addEventListener("click", function() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/cart", true);
    xhr.onreadystatechange = function() { 
        if (xhr.readyState != 4) return;
        main.innerHTML = xhr.responseText;
        displaycartitems()
    }
    xhr.send();
})
// checkout
function checkou() {
    let tot2 = document.getElementById("summa")
    tot2.innerHTML = sum + "руб"
    let finish = document.getElementById("finish")
    let checkbox = document.getElementById("checkbox")
    finish.addEventListener("click", function(){
        if (checkbox.checked) {
            alert("Заказ оформлен!")
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "/main", true);
            xhr.onreadystatechange = function() { 
                if (xhr.readyState != 4) return;
                main.innerHTML = xhr.responseText;
                slideshow();
            }
            xhr.send();
        }
        else {
            alert("Согласитесь с Termes of Use")
        }
    })
}


