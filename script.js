let allBuy = [];
let input1 = null;
let input2 = null;
let valueInput1 = "";
let valueInput2 = "";
let sumList = 0;
const d = new Date();

window.onload = async () => {
  input1 = document.getElementById("add-shop");
  input1.addEventListener("change", updateValue1);

  input2 = document.getElementById("add-sum");
  input2.addEventListener("change", updateValue2);

  const resp = await fetch("http://localhost:4000/allBuy", {
    method: "GET",
  });
  const result = await resp.json();
  allBuy = result.data;
  console.log(allBuy);
  render();
};

const updateValue1 = (event) => {
  valueInput1 = event.target.value;
};

const updateValue2 = (event) => {
  valueInput2 = event.target.value;
};

// time
const formatDate = (date) => {
  var dd = date.getDate();
  if (dd < 10) dd = "0" + dd;
  var mm = date.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;
  var yy = date.getFullYear() % 100;
  if (yy < 10) yy = "0" + yy;
  return dd + "." + mm + "." + yy;
};
const newD = formatDate(d);

//add buy
const onClickButton = async () => {
  const resp = await fetch("http://localhost:4000/createTicket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      shop: valueInput1,
      date: newD,
      sum: valueInput2,
    }),
  });
  const result = await resp.json();
  console.log(result.data);
  allBuy = result.data;
  input1.value = "";
  valueInput1 = "";
  input2.value = "";
  valueInput2 = "";
  render();
};

const render = () => {
  const allSum = document.getElementById("summ");
  const content = document.getElementById("expenses");
  console.log(content);

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  console.log(allBuy);
  allBuy.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;

    const check = document.createElement("p");
    const list = `${++index})`;
    check.innerText = list;
    container.appendChild(check);

    const shop = document.createElement("p");
    const shopVal = `Магазин "${item.shop}"`;
    shop.innerText = shopVal;
    container.appendChild(shop);

    const date = document.createElement("p");
    date.innerText = item.date;
    container.appendChild(date);

    const sum = document.createElement("p");
    const rub = `${item.sum} р.`;
    sum.innerText = rub;
    container.appendChild(sum);

    sumList += +item.sum;

    const imageEdit = document.createElement("img");
    imageEdit.src = "img/change.png";
    imageEdit.type = "button";
    imageEdit.className = "buttonClick";
    // imageEdit.onclick = () => {
    //   flag = index;
    //   render();
    // };
    container.appendChild(imageEdit);

    const imageDel = document.createElement("img");
    imageDel.src = "img/krest.png";
    imageDel.type = "button";
    imageDel.className = "buttonClick";
    // imageDel.onclick = () => deleteTask(index);
    container.appendChild(imageDel);

    content.appendChild(container);
  });

  const summa = document.createElement("p");
  summa.innerText = `Итого: ${sumList} р.`;
  allSum.appendChild(summa);
};
