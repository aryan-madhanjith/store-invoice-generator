$(document).ready(function() {
    $('.js-example-basic-single').select2(
        {
            placeholder: 'Select or type ', // Set the default text (placeholder)
            allowClear: true // Allow the user to clear the selected option
        });
});

let price_dict = {};

function handleFile()
{
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            price_dict = JSON.parse(e.target.result);
            console.log(price_dict);
            price_dict.forEach(item => {
                var option = document.createElement('option');
                option.value = item.price;
                option.text = item.name;
                dropdown.appendChild(option);
            });
        };

        reader.readAsText(file);
    }
}

var dropdown = document.getElementById('dropdown');
var quantity = document.getElementById('quantity');
var btnDecQuantity = document.getElementById('decrement');
var btnIncQuantity = document.getElementById('increment');

var btn_add_to_invoice = document.getElementById('btn-add');
var btn_undo = document.getElementById('btn-undo');
var btn_clear = document.getElementById('btn-clear');
var btn_save = document.getElementById('btn-save');

var textarea = document.getElementById('txt');

var table = document.getElementById('table');
table.del
var table_body = document.getElementById('body');
var table_foot = document.getElementById('foot');

var last_row = undefined;


function display_line(quantity, item ,price)
{
    // This is an empty <tr></tr>
    var row = table_body.insertRow(-1);

    last_row = row;

    // Now add the table data or <td></td>
    var q_cell = row.insertCell(0);
    var p_cell = row.insertCell(1);
    var up_cell = row.insertCell(2);
    var st_cell = row.insertCell(3);

    // Finally, insert the contents of each cell
    q_cell.innerHTML = quantity;
    p_cell.innerHTML = item;
    up_cell.innerHTML = price.toLocaleString(undefined, { style: 'currency', currency: 'ZAR' });
    st_cell.innerHTML = (quantity * price).toLocaleString(undefined, { style: 'currency', currency: 'ZAR' });
}

function update_total()
{

    var invoice_rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var total_value = 0;

    for (var i = 0; i < invoice_rows.length; i++) 
    {
        var priceString = invoice_rows[i].getElementsByTagName('td')[3].textContent;
        var price = parseFloat(priceString.replace(/[^\d,-]/g, ''));

        total_value += price;
    }

    var total_cell = document.getElementById('total-cell');
    total_cell.innerHTML = total_value.toLocaleString(undefined, { style: 'currency', currency: 'ZAR' });;
}

function add_to_invoice()
{
    var name = dropdown.options[dropdown.selectedIndex].text;
    var price = dropdown.value;
    display_line(quantity.textContent, name, price);
    update_total();
}
btn_add_to_invoice.addEventListener('click', add_to_invoice);

function change_quantity()
{
    var operand = event.target;
    var value = parseInt(quantity.textContent);

    if (operand.id=="decrement")
    {
        if (value==1) { console.log("Cannot order a \"zero\" amount of items."); }
        else { value -= 1; }
    }
    else
    {
        value += 1;
    }

    quantity.innerHTML = value;

}
btnDecQuantity.addEventListener('click', change_quantity);
btnIncQuantity.addEventListener('click', change_quantity);

function undo()
{
    table_body.deleteRow(-1);
    update_total();
}
btn_undo.addEventListener('click', undo);

function clear()
{
    var invoice_rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var s = invoice_rows.length.toString() + ": ";

    for (var i = invoice_rows.length - 1; i >= 0; i--) 
    {
        s += i.toString() + ", "
        table_body.deleteRow(i);
    }

    update_total();
}
btn_clear.addEventListener('click', clear);

function getCurrentDate() {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');
  
    return `${year}/${month}/${day}`;
  }

function save() 
{  
    var name = window.prompt("Name of customer?");
    var date = getCurrentDate();
    var heading = "INVOICE TABLE\nDate : " + date + "\nName : " + name;

    var doc = new jsPDF('p', 'pt', 'letter');  
    var htmlstring = '';  
    var tempVarToCheckPageHeight = 0;  
    var pageHeight = 0;  
    pageHeight = doc.internal.pageSize.height;  
    specialElementHandlers = {  
        // element with id of "bypass" - jQuery style selector  
        '#bypassme': function(element, renderer) {  
            // true = "handled elsewhere, bypass text extraction"  
            return true  
        }  
    };  
    margins = {  
        top: 150,  
        bottom: 60,  
        left: 40,  
        right: 40,  
        width: 600  
    };  
    var y = 20;  
    doc.setLineWidth(2);  
    
    doc.text(40, 30 , heading + "\n\n");  


    doc.autoTable({  
        html: '#table',  
        startY: 100,  
        theme: 'grid',  
        columnStyles: {  
            0: {  
                cellWidth: 108,  
            },  
            1: {  
                cellWidth: 162,  
            },  
            2: {  
                cellWidth: 108,  
            },
            3: 
            {  
                cellWidth: 108,  
            }  
        },  
        styles: {  
            minCellHeight: 40  
        }  
    })  
    doc.save('Invoice for ' + name + ' (' + date + ') .pdf');  
}  
btn_save.addEventListener('click', save);
