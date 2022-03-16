let allBuy = [];
let input1 = null;
let input2 = null;
let valueInputShop = "";
let valueInputSum = "";
let sumList = 0;
const dateYesterday = new Date();
let newDate = null;
let flag = null;
let intermedateResult1 = "";
let intermedateResult2 = "";
let intermedateResult3 = "";

window.onload = async() => {
    input1 = document.getElementById("add-shop");
    input1.addEventListener("change", updateValue1);

    input2 = document.getElementById("add-sum");
    input2.addEventListener("change", updateValue2);

    const resp = await fetch("http://localhost:4000/allBuy", {
        method: "GET",
    });
    const result = await resp.json();
    allBuy = result.data;
    render();
};

const updateValue1 = (event) => {
    valueInputShop = event.target.value;
};

const updateValue2 = (event) => {
    valueInputSum = +event.target.value;
};

const formatDate = (date) => {
    let dd = date.getDate();
    if (dd < 10) dd = "0" + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;

    let yy = date.getFullYear();
    if (yy < 10) yy = "0" + yy;

    return dd + "." + mm + "." + yy;
};
const newDateFormate = formatDate(dateYesterday);

const onClickButton = async() => {
    if (valueInputShop !== "" || valueInputSum !== "") {
        if (Math.sign(valueInputSum) === 1) {
            const resp = await fetch("http://localhost:4000/createTicket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    shop: valueInputShop,
                    date: newDateFormate,
                    sum: valueInputSum,
                }),
            });
            const result = await resp.json();
            allBuy = result.data;
            input1.value = "";
            valueInputShop = "";
            input2.value = "";
            valueInputSum = "";
            render();
        } else {
            alert("Необходимо ввести число, йоу!");
            input2.value = "";
            valueInputSum = "";
        }
    } else {
        alert("Пустая строка ввода! Добавьте, пожалуйста, значение");
    }
};

const render = () => {
    const total = document.getElementById("summ");
    const content = document.getElementById("expenses");

    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    while (total.firstChild) {
        total.removeChild(total.firstChild);
    }

    allBuy.map((item, index) => {
        const ticket = document.createElement("div");

        const check = document.createElement("p");
        check.className = 'numberTicket'
        const list = `${++index})`;
        check.innerText = list;
        ticket.appendChild(check);

        if (index === flag) {
            const editInput1 = document.createElement("input");
            editInput1.type = "text";
            editInput1.value = item.shop;
            editInput1.addEventListener("change", updateTaskText1);
            ticket.appendChild(editInput1);

            const editInput3 = document.createElement("input");
            editInput3.type = "date";
            const s = item.date.split(".").reverse().join("-");
            editInput3.value = s;
            editInput3.min = "2022-01-01";
            editInput3.max = "2022-12-31";
            editInput3.addEventListener("change", updateTaskText3);
            ticket.appendChild(editInput3);

            const editInput2 = document.createElement("input");
            editInput2.type = "text";
            editInput2.value = item.sum;
            editInput2.addEventListener("change", updateTaskText2);
            ticket.appendChild(editInput2);

            const imageOk = document.createElement("img");
            imageOk.src = "img/ok.png";
            imageOk.type = "button";
            imageOk.className = "buttonClick";
            imageOk.onclick = () => {
                checkResult(index);
                saveResult(index);
                doneEditTask();
            };
            ticket.appendChild(imageOk);

            const imageCancel = document.createElement("img");
            imageCancel.src = "img/otmena.jpg";
            imageCancel.type = "button";
            imageCancel.className = "buttonClick";
            imageCancel.onclick = () => doneEditTask();
            ticket.appendChild(imageCancel);
        } else {
            const shop = document.createElement("p");
            shop.className = 'shop';
            const shopVal = `Магазин "${item.shop}"`;
            shop.innerText = shopVal;
            shop.addEventListener(
                "dblclick",
                (updateElementShop = () => {
                    const editInput1 = document.createElement("input");
                    editInput1.type = "text";
                    // editInput1.id = '';
                    editInput1.value = item.shop;
                    editInput1.addEventListener("change", updateTaskText1);
                    editInput1.addEventListener(
                        "blur",
                        (reverseUpdateShop = () => {
                            checkResult(index);
                            saveResult(index);
                            doneEditTask();
                        })
                    );
                    ticket.replaceChild(editInput1, shop);
                    editInput1.focus();
                })
            );
            ticket.appendChild(shop);

            const date = document.createElement("p");
            date.className = 'date';
            date.innerText = item.date;
            date.addEventListener(
                "dblclick",
                (updateElementDate = () => {
                    const editInput3 = document.createElement("input");
                    editInput3.type = "date";
                    const s = item.date.split(".").reverse().join("-");
                    editInput3.value = s;
                    editInput3.min = "2022-01-01";
                    editInput3.max = "2022-12-31";
                    editInput3.addEventListener("change", updateTaskText3);
                    editInput3.addEventListener(
                        "blur",
                        (reverseUpdateSum = () => {
                            checkResult(index);
                            saveResult(index);
                            doneEditTask();
                        })
                    );

                    ticket.replaceChild(editInput3, date);
                    editInput3.focus();
                })
            );
            ticket.appendChild(date);

            const sum = document.createElement("p");
            sum.className = 'sum';
            const rub = `${item.sum} р.`;
            sum.innerText = rub;
            sum.addEventListener(
                "dblclick",
                (updateElementSum = () => {
                    const editInput2 = document.createElement("input");
                    editInput2.type = "text";
                    editInput2.value = item.sum;
                    editInput2.addEventListener("change", updateTaskText2);
                    editInput2.addEventListener(
                        "blur",
                        (reverseUpdateSum = () => {
                            checkResult(index);
                            saveResult(index);
                            doneEditTask();
                        })
                    );
                    ticket.replaceChild(editInput2, sum);
                    editInput2.focus();
                })
            );
            ticket.appendChild(sum);

            const imageEdit = document.createElement("img");
            imageEdit.src = "img/change.png";
            imageEdit.type = "button";
            imageEdit.className = "buttonClick";
            imageEdit.onclick = () => {
                flag = index;
                render();
            };
            ticket.appendChild(imageEdit);

            const imageDel = document.createElement("img");
            imageDel.src = "img/krest.png";
            imageDel.type = "button";
            imageDel.className = "buttonClick";
            imageDel.onclick = () => deleteTask(index);
            ticket.appendChild(imageDel);
        }
        content.appendChild(ticket);
    });

    const initialValue = 0;
    const sumList = allBuy.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.sum;
    }, initialValue);
    const summa = document.createElement("p");
    summa.innerText = `Итого: ${sumList} р.`;
    total.appendChild(summa);
};

const updateTaskText1 = (event) => {
    intermedateResult1 = event.target.value;
};

const updateTaskText2 = (event) => {
    intermedateResult2 = +event.target.value;
};

const updateTaskText3 = (event) => {
    intermedateResult3 = event.target.value;
    newDate = intermedateResult3.split("-").reverse().join(".");
    return newDate;
};

const checkResult = (index) => {
    if (intermedateResult1 === "") {
        intermedateResult1 = allBuy[index - 1].shop;
    }

    if (intermedateResult2 === "") {
        intermedateResult2 = allBuy[index - 1].sum;
    }

    if (intermedateResult3 === "") {
        newDate = newDateFormate;
    }
};

const deleteTask = async(index) => {
    let id = allBuy[index - 1]._id;
    const resp = await fetch(`http://localhost:4000/deleteTicket?_id=${id}`, {
        method: "DELETE",
    });
    const result = await resp.json();
    allBuy = result.data;
    render();
};

const saveResult = async(index) => {
    if (
        intermedateResult1 !== "" &&
        intermedateResult2 !== "" &&
        newDate !== ""
    ) {
        allBuy[index - 1].shop = intermedateResult1;
        allBuy[index - 1].date = newDate;
        allBuy[index - 1].sum = intermedateResult2;
        let _id = allBuy[index - 1]._id;
        const resp = await fetch(`http://localhost:4000/updateTicket`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                _id,
                shop: intermedateResult1,
                date: newDate,
                sum: intermedateResult2,
            }),
        });
        const result = await resp.json();
        allBuy = result.data;
        intermedateResult1 = "";
        intermedateResult2 = "";
        newDate = "";
    } else {
        alert("есть путсые параметры");
    }
};

const doneEditTask = () => {
    flag = null;
    render();
};