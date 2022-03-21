let allBuy = [];
let inputShop = null;
let inputSum = null;
let valueInputShop = "";
let valueInputSum = "";
let sumList = 0;
const dateYesterday = new Date();
let newDate = null;
let flag = null;
let intermedateResultShop = "";
let intermedateResultSum = "";
let intermedateResultDate = "";

window.onload = async () => {
  inputShop = document.getElementById("add-shop");
  inputShop.addEventListener("change", updateValueShop);

  inputSum = document.getElementById("add-sum");
  inputSum.addEventListener("change", updateValueSum);

  const resp = await fetch("http://localhost:4000/allBuy", {
    method: "GET",
  });
  const result = await resp.json();
  allBuy = result.data;
  render();
};

const updateValueShop = (event) => {
  valueInputShop = event.target.value;
};

const updateValueSum = (event) => {
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

const onClickButton = async () => {
  if (valueInputShop !== "" && valueInputSum !== "") {
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
      inputShop.value = "";
      valueInputShop = "";
      inputSum.value = "";
      valueInputSum = "";
      render();
    } else {
      alert("Необходимо ввести число, йоу!");
      inputSum.value = "";
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
    ticket.id = "ticket";
    const name = document.createElement("div");
    name.id = "name";
    const dateSumButt = document.createElement("div");
    dateSumButt.id = "dateSumButt";
    const dateSum = document.createElement("div");
    dateSum.id = "dateSum";
    const butt = document.createElement("div");
    butt.id = "butt";

    const check = document.createElement("p");
    check.className = "numberTicket";
    const list = `${++index})`;
    check.innerText = list;

    name.appendChild(check);
    ticket.appendChild(name);

    dateSumButt.appendChild(dateSum);
    dateSumButt.appendChild(butt);
    ticket.appendChild(dateSumButt);

    if (index === flag) {
      const editInputShop = document.createElement("input");
      editInputShop.type = "text";
      editInputShop.value = item.shop;
      editInputShop.addEventListener("change", updateTaskText1);
      name.appendChild(editInputShop);

      const editInputDate = document.createElement("input");
      editInputDate.type = "date";
      editInputDate.id = "inputDate";
      const trueFormat = item.date.split(".").reverse().join("-");
      editInputDate.value = trueFormat;
      editInputDate.min = "2022-01-01";
      editInputDate.max = "2022-12-31";
      editInputDate.addEventListener("change", updateTaskText3);
      dateSum.appendChild(editInputDate);

      const editInputSum = document.createElement("input");
      editInputSum.type = "text";
      editInputSum.id = "inputSum";
      editInputSum.value = item.sum;
      editInputSum.addEventListener("change", updateTaskText2);
      dateSum.appendChild(editInputSum);

      const imageOk = document.createElement("img");
      imageOk.src = "img/ok.png";
      imageOk.type = "button";
      imageOk.className = "buttonClick";
      imageOk.onclick = () => {
        checkResult(index);
        saveResult(index);
        doneEditTask();
      };
      butt.appendChild(imageOk);

      const imageCancel = document.createElement("img");
      imageCancel.src = "img/otmena.jpg";
      imageCancel.type = "button";
      imageCancel.className = "buttonClick";
      imageCancel.onclick = () => doneEditTask();
      butt.appendChild(imageCancel);
    } else {
      const shop = document.createElement("p");
      shop.className = "shop";
      const shopVal = `Магазин "${item.shop}"`;
      shop.innerText = shopVal;
      shop.addEventListener(
        "dblclick",
        (updateElementShop = () => {
          const editInputShop = document.createElement("input");
          editInputShop.type = "text";
          editInputShop.value = item.shop;
          editInputShop.addEventListener("change", updateTaskText1);
          editInputShop.addEventListener(
            "blur",
            (reverseUpdateShop = () => {
              checkResult(index);
              saveResult(index);
              doneEditTask();
            })
          );
          name.replaceChild(editInputShop, shop);
          editInputShop.focus();
        })
      );
      name.appendChild(shop);

      const date = document.createElement("p");
      date.className = "date";
      date.innerText = item.date;
      date.addEventListener(
        "dblclick",
        (updateElementDate = () => {
          const editInputDate = document.createElement("input");
          editInputDate.type = "date";
          editInputDate.id = "inputDate";
          const s = item.date.split(".").reverse().join("-");
          editInputDate.value = s;
          editInputDate.min = "2022-01-01";
          editInputDate.max = "2022-12-31";
          editInputDate.addEventListener("change", updateTaskText3);
          editInputDate.addEventListener(
            "blur",
            (reverseUpdateSum = () => {
              checkResult(index);
              saveResult(index);
              doneEditTask();
            })
          );

          dateSum.replaceChild(editInputDate, date);
          editInputDate.focus();
        })
      );
      dateSum.appendChild(date);

      const sum = document.createElement("p");
      sum.className = "sum";
      const rub = `${item.sum} р.`;
      sum.innerText = rub;
      sum.addEventListener(
        "dblclick",
        (updateElementSum = () => {
          const editInputSum = document.createElement("input");
          editInputSum.type = "text";
          editInputSum.id = "inputSum";
          editInputSum.value = item.sum;
          editInputSum.addEventListener("change", updateTaskText2);
          editInputSum.addEventListener(
            "blur",
            (reverseUpdateSum = () => {
              checkResult(index);
              saveResult(index);
              doneEditTask();
            })
          );
          dateSum.replaceChild(editInputSum, sum);
          editInputSum.focus();
        })
      );
      dateSum.appendChild(sum);

      const imageEdit = document.createElement("img");
      imageEdit.src = "img/change.png";
      imageEdit.type = "button";
      imageEdit.className = "buttonClick";
      imageEdit.onclick = () => {
        flag = index;
        render();
      };
      butt.appendChild(imageEdit);

      const imageDel = document.createElement("img");
      imageDel.src = "img/krest.png";
      imageDel.type = "button";
      imageDel.className = "buttonClick";
      imageDel.onclick = () => deleteTask(index);
      butt.appendChild(imageDel);
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
  intermedateResultShop = event.target.value;
};

const updateTaskText2 = (event) => {
  intermedateResultSum = +event.target.value;
};

const updateTaskText3 = (event) => {
  intermedateResultDate = event.target.value;
  newDate = intermedateResultDate.split("-").reverse().join(".");
  return newDate;
};

const checkResult = (index) => {
  if (intermedateResultShop === "") {
    intermedateResultShop = allBuy[index - 1].shop;
  }

  if (intermedateResultSum === "") {
    intermedateResultSum = allBuy[index - 1].sum;
  }

  if (intermedateResultDate === "") {
    newDate = newDateFormate;
  }
};

const deleteTask = async (index) => {
  let id = allBuy[index - 1]._id;
  const resp = await fetch(`http://localhost:4000/deleteTicket?_id=${id}`, {
    method: "DELETE",
  });
  const result = await resp.json();
  allBuy = result.data;
  render();
};

const saveResult = async (index) => {
  if (
    intermedateResultShop !== "" &&
    intermedateResultSum !== "" &&
    newDate !== ""
  ) {
    allBuy[index - 1].shop = intermedateResultShop;
    allBuy[index - 1].date = newDate;
    allBuy[index - 1].sum = intermedateResultSum;
    let _id = allBuy[index - 1]._id;
    const resp = await fetch(`http://localhost:4000/updateTicket`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id,
        shop: intermedateResultShop,
        date: newDate,
        sum: intermedateResultSum,
      }),
    });
    const result = await resp.json();
    allBuy = result.data;
    intermedateResultShop = "";
    intermedateResultSum = "";
    newDate = "";
  } else {
    alert("есть путсые параметры");
  }
};

const doneEditTask = () => {
  flag = null;
  render();
};
