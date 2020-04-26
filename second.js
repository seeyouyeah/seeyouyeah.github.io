$(window).on('load', function(){
    if (!isParamsCorrect(hrefQueryParams)) {
        $('#alertWrapper').attr("class", "container-fluid mt-3 mt-md-5");
        $('#alert').attr("class", "alert alert-warning alert-dismissible fade show");
    } else {
        // createFunctionPanel();
        createTable(
            hrefQueryParams.cols,
            hrefQueryParams.rows,
        );
    }
});

var hrefQueryParams = getQueryParams(document.location.href);
console.log(hrefQueryParams);

function getQueryParams(href) {
    let queryParams = {};
    href.substring(href.indexOf('?') + 1, href.length).split('&')
        .forEach(param => {
            const paramKeyValue = param.split('=');
            queryParams[paramKeyValue[0]] = paramKeyValue[1];
        });
    return queryParams;
}

function isParamsCorrect(queryParams) {
    return queryParams.length !== 0 &&
        Object.values(queryParams).every((param) => param != '' && Number.isInteger(+param) && param > 0);
}

function createTable(cols, rows) {
    let div = document.createElement('div'),
        divWrapper = document.createElement('div'),
        caption = document.createElement('caption'),
    table = document.createElement('table');
    table.className = 'table-bordered table-sm';
    divWrapper.className = 'col-sm-12 order-sm-12 order-sm-1';
    div.className = 'table-responsive';
    caption.innerText = 'Без названия';
    table.appendChild(caption);
    // + 1 к строкам и столбцам, т.к. добавились служебные поля
    for (let i = 0; i < +rows + 1; i++) {
        let tr = document.createElement('tr');
        if (i === 0) {
            tr.className = 'table-secondary text-center';
            for (let j = 0; j < +cols + 1; j++) {
                let td = document.createElement('td');
                td.style = 'position: relative; height: 45px';
                if (j !== 0) {
                    addMouseEventsOnTableCell(td, false);
                }
                td.innerHTML += (j === 0) ? ' ' : getLetterById(j - 1);
                tr.append(td);
            }
        } else {
            for (let j = 0; j < +cols + 1; j++) {
                let td = createTableCell(i, j);
                tr.append(td);
            }
        }
        table.append(tr);
    }
    div.append(table);
    divWrapper.append(div);
    document.getElementById('wrapper').appendChild(divWrapper);
}

function createTableCell(rowIndex, columnIndex) {
    let td = document.createElement('td');
    if (columnIndex === 0) {
        addMouseEventsOnTableCell(td);
        td.style = 'position: relative; min-width: 45px';
        td.innerHTML += rowIndex;
        td.className = 'table-secondary text-center';
        td.style.paddingLeft = td.style.paddingRight = '0';

    } else {
        td.append(createTableCellContent(td));
    }
    return td;
}

function createAddButton(rows = true) {
   return (rows) ? createAddButtonUp() : createAddButtonLeft();
}

function createAddButtonUp() {
    let badge = document.createElement('span');
    badge.className = 'badge badge-primary';
    badge.innerHTML = '<span class="material-icons" style="font-size: 30px">' +
        'exposure_plus_1' +
        '</span>';
    badge.style = 'position: absolute;top: -10px;right: 0;left: 0; cursor: pointer'
    let addContainer = document.createElement('div');
    addContainer.style ='position: absolute; top: 0; width: 45px; height: 3px'
    addContainer.append(badge);
    addContainer.onclick = () => createRow(addContainer);
    return addContainer;
}

function createRow(container) {
    let currentTr = container.parentNode.parentNode;
    let table = currentTr.parentNode;
    let currentColsQuantity = currentTr.childNodes.length;
    let currentRowIndex = Array.from(table.querySelectorAll('tr')).indexOf(currentTr);
    let currentRowsQuantity = table.querySelectorAll('tr').length;
    let tr = document.createElement('tr');
    for (let j = 0; j < +currentColsQuantity; j++) {
        let td = createTableCell(currentRowIndex, j);
        tr.append(td);
    }
    currentTr.before(tr);
    for (let j = currentRowIndex + 1 ; j < currentRowsQuantity + 1; j++) {
        let numberCell = table.children[j + 1].children[0];
        numberCell.innerHTML = j;
    }

    console.log(currentRowIndex);
}

function createAddButtonLeft() {
    let badge = document.createElement('span');
    badge.className = 'badge badge-primary text-center';
    badge.innerHTML = '<span class="material-icons" style="font-size: 30px">' +
        'exposure_plus_1' +
        '</span>';
    badge.style = 'position: absolute;left: -20px; top: 0; bottom: 0; cursor: pointer; display: flex; align-items: center;'
    let addContainer = document.createElement('div');
    addContainer.style ='position: absolute; top: 0; height: 45px; width: 3px'
    addContainer.append(badge);
    addContainer.onclick = () => createColumn(addContainer);
    return addContainer;
}

function createColumn(container) {
    let currentTd = container.parentNode;
    let currentTr = currentTd.parentNode;
    let table = currentTr.parentNode;
    let currentColIndex = Array.from(currentTr.children).indexOf(currentTd);
    let currentColsQuantity = currentTr.childNodes.length;
    let currentRowsQuantity = table.querySelectorAll('tr').length;
    // получаем index столбца, перед которым мы должны добавить новый
    for (let i = 0; i < currentRowsQuantity; i++) {
        let tr = table.children[i + 1];
        // добавление системных клеток в первую строчку
        if (i === 0) {
            let td = document.createElement('td');
            td.style = 'position: relative; height: 45px';
            addMouseEventsOnTableCell(td, false);
            td.innerHTML += getLetterById(currentColIndex - 1);
            currentTd.before(td);
            /*замена букв в первой строке:
            * начинаем с клетки после текущего, так как уже вставили элемент
            * пробегаемся по всем клеткам до конца и меняем букву на следующую по алфавиту */
            for (let j = currentColIndex + 1; j < currentColsQuantity + 1 ; j++) {
                let letterTd = currentTr.children[j];
                letterTd.innerHTML = getLetterById(j - 1);
            }
            // добавление клеток с данными клеток
        } else {
            let td = createTableCell(i, currentColIndex);
            tr.children[currentColIndex].before(td);
        }
    }
}

function addMouseEventsOnTableCell(td, flagColsRows = true) {
    td.onmouseenter = () => {
        td.append(createAddButton(flagColsRows));
    };
    td.onmouseleave = () => {
        td.getElementsByTagName('div')[0].remove();
    };
}

// 3
function createTableCellContent(td, previousValue) {

    let form = document.createElement('form'),
        textarea = document.createElement('textarea'),
        button = document.createElement('button'),
        divForm = document.createElement('div');

    divForm.className = 'form-group';
    button.innerHTML = '<span class="material-icons">' +
        'check' +
        '</span>';
    button.className = 'btn btn-primary';
    textarea.className = 'form-control-sm mr-4';
    if (previousValue !== undefined) {
        textarea.value = previousValue;
    }
    td.innerHTML = '';
    // После нажатия на «сохранить», эта форма пропадает, а вместо нее появляется введенный пользователем текст.
    button.onclick = () => {
        let div = document.createElement('div');
        div.innerText = textarea.value;
        div.onclick = () => {
            td.append(createTableCellContent(td, div.innerText));
        };
        divForm.remove();
        td.append(div);
        let buttonDelete = document.createElement('button');
        buttonDelete.type = 'button';
	buttonDelete.style = 'margin-left: 90px';
        buttonDelete.innerHTML = '<span class="material-icons">' +
            'clear' +
            '</span>';
        buttonDelete.className = 'btn btn-danger';
        buttonDelete.onclick = () => td.append(createTableCellContent(td));
        td.append(buttonDelete);
    };

    form.className = 'form-inline';
    form.append(textarea, button);
    divForm.append(form);
    return divForm;
}

function getLetterById(id) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', '...'][id];

}

function changeBorders() {
    let selectElement = document.getElementById('select');
    let inputElement = selectElement.nextElementSibling;
    let tdList = document.querySelectorAll('td');
    if (Number.isInteger(+inputElement.value)) {
    tdList.forEach((td) =>
        td.style.border = `${inputElement.value}px ${selectElement.value}`
    );
    } else {
        $('#myModal').modal('show');
    }
}

function onInputChanged(inputElement) {
    let select = inputElement.previousElementSibling;
    let button = inputElement.nextElementSibling;
    if (inputElement.value.length === 0) {
        if (select.value !== '' && select.value !== 'Стиль рамки' && (typeof select.value) !== "undefined") {
            button.innerText = 'Применить' + ' ' + 'рамка ' + select.value;
        } else {
            button.innerText = 'Применить';
        }
    } else {
        button.innerText = 'Применить' + ' ' + inputElement.value + ' px ';
        if (select.value !== '' && select.value !== 'Стиль рамки' && (typeof select.value) !== "undefined") {
            button.innerText += ' и рамка ' + select.value;
        }
    }
}

function onSelectChanged(selectElement) {
    let inputElement = selectElement.nextElementSibling;
    let button = inputElement.nextElementSibling;
    if (inputElement.value.length !== 0) {
        button.innerText = 'Применить' + ' ' + inputElement.value + ' px ';
        button.innerText = button.innerText = 'Применить' + ' ' + inputElement.value + ' px ';
        if (selectElement.value !== '' && selectElement.value !== 'Стиль рамки') {
            button.innerText += ' и рамка ' + selectElement.value;
        }
    } else {
        button.innerText = 'Применить' + ' ' + 'рамка ' + selectElement.value;
    }
}


// 5. добавить элемент “Изменить границы таблицы”
createSelectElementContent();

function createSelectElementContent() {
    let selectElement = document.getElementById('select');
    getBorderOptions().forEach((option) => selectElement.append(option));
}

function getBorderOptions() {
    let borderOptions = [];
    ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].forEach(
        (borderStyle) => {
            let option = document.createElement('option');
            option.innerText = borderStyle;
            borderOptions.push(option);
        }
    );
    return borderOptions;
}

// 6. добавить элемент “Добавить заголовок”.
function changeCaption() {
    let inputElement = document.getElementById('add');
    let caption = document.getElementsByTagName('caption')[0];
    caption.innerText = inputElement.value;
    document.querySelector('table').prepend(caption);
}


// 7. добавить элемент “Удалить строку”
function deleteElement(button) {
    /*custom-control-input[0] - rows
    * custom-control-input[1] - columns*/
    (button.parentNode.querySelectorAll('.custom-control-input')[0].checked)
        ? deleteRow() : deleteColumn();
}

function deleteRow() {
    let inputElement = document.getElementById('delete');
    let tableRows = document.querySelectorAll('tr');
    if (!isInputCorrect(inputElement, tableRows.length)) {
            $('#myModal').modal('show');
    } else {
        /*После того как удаляем столбец, он не исчезает,
         поэтому нужно пробежать по всем строкам после удаленной
         и изменить буквы в 0 строке*/
        tableRows[inputElement.value].remove();
        for (let i = +inputElement.value; i < tableRows.length; i++) {
            tableRows[i].cells[0].innerText -= 1;
        }
    }
}

// Добавление - функция удаления столбца
/*нужно пробежаться по всем строкам и удалить клетки с позицией inputElement.value*/
function deleteColumn() {
    let inputElement = document.getElementById('delete');
    let tableRows = document.querySelectorAll('tr');
    if (!isInputCorrect(inputElement, tableRows[0].cells.length)) {
        $('#myModal').modal('show');
    } else {
        /*После того как удаляем строку, она не исчезает,
         поэтому нужно пробежать по всем строкам после удаленной
         и уменьшить позицию на один*/
        for (let i = 0; i < tableRows.length; i++) {
            tableRows[i].cells[inputElement.value].remove();
        }
    }
}

function isInputCorrect(inputElement, max) {
    return !(inputElement.value < 1 || inputElement.value > max
        || inputElement.value.match(/([^0-9])/g));
}


// 8. добавить элемент “Случайный выбор”
function magic() {
    let td = chooseRandomTableDataCell();
    if (randomInteger(1, 15) === 7) {
        td.appendChild(createTableCellContent(td));
    } else {
        chooseRandomBgColor(td);
        chooseRandomFontStyle(td);
    }
}

function chooseRandomTableDataCell() {
    let tableRowList = document.querySelectorAll('tr');
    let tableRowIndex = randomInteger(1, tableRowList.length - 1);
    let tableDataCellIndex = randomInteger(1, tableRowList[tableRowIndex].cells.length - 1);
    return tableRowList[tableRowIndex].cells[tableDataCellIndex];
}

function chooseRandomBgColor(td) {
    td.style.backgroundColor = setRandomColor();
}

function chooseRandomFontStyle(td) {
    let newColor = setRandomColor();
    let newFontSize = randomInteger(15, 25) + 'pt';
    td.style.color = newColor;
    td.style.fontSize = newFontSize;
    /* если форма есть, то для каждого её внутреннего
    тега задаем стиль
    */
    if (td.childNodes[0].nodeName === 'form') {
        td.childNodes[0].childNodes.forEach((elem) => {
            elem.style.color = newColor;
            elem.style.fontSize = newFontSize;
        });
    }
}

function setRandomColor() {
    let hexTable = "0123456789ABCDEF";
    let newColor = '#';
    for (let i = 0; i < 6; i++) {
        newColor += hexTable[randomInteger(0, hexTable.length - 1)];
    }
    console.log(newColor);
    return newColor;
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

// 9. добавить элемент “Удалить”
function cleanTable() {
    location.href = "index.html";
}