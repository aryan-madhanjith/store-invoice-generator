$(document).ready(function() {
    $('.js-example-basic-single').select2(
        {
            placeholder: 'Select or type ', // Set the default text (placeholder)
            allowClear: true // Allow the user to clear the selected option
        });
});

function load_into_dict(filepath)
{
    const dictionary = {}

    // Split the fileContent into lines
    const lines = filepath.trim().split('\n');

    // Process each line to extract key-value pairs
    lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
        dictionary[key.trim()] = value.trim();
        console.log(key);
    }
    });

    return dictionary;
}

var price_dict = load_into_dict('Store\price_data.txt');
console.log(Object.keys(price_dict));

var price_dict =
{
    "Lemon creams (200g)": 18,
    "Nutty krust (200g)": 20,
    "Strawberry whirls (200g)": 20,
    "Ginger nut (200g)": 20,
    "Choc ginger (200g)": 20,
    "Choc digestives (200g)": 20,
    "Jolly jammers (choc or jam) (200g)": 20,
    "Chockits (200g)": 20,
    "Zoo (200g)": 20,
    "Good morning biscuits (chocolate) (200g)": 20,
    "Salticrax (limited stock) (200g)": 20,
    "4X38g Oreos (choc or original)": 25,
    "6X29.4g Oreo (original)": 25,
    "200g Royal creams": 27,
    "750g Bakers rusks (muesli or buttermilk)": 50,
    "Jube Jubes (100g)": 12,
    "Chappies (100g)": 12,
    "Peanut brittle (100g)": 12,
    "Jelly tots (100g)": 12,
    "Cherry gums (100g)": 12,
    "Red and black gums (100g)": 12,
    "Jelly bears (100g)": 12,
    "Choc nut (100g)": 12,
    "Wine gums (100g)": 12,
    "Sugar hearts (100g)": 12,
    "Pink and White candy peanuts (100g)": 12,
    "Blue and White candy peanuts (100g)": 12,
    "Multicoloured candy peanuts (100g)": 12,
    "Mint Imperials (100g)": 12,
    "XXX mint (100g)": 12,
    "Coke bottles (100g)": 12,
    "Fireballs (100g)": 12,
    "Black sweet balls (100g)": 12,
    "Jelly stars (100g)": 12,
    "Jelly beans (100g)": 15,
    "Speckled eggs (100g)": 15,
    "Astros (100g)": 15,
    "Funny faces (100g)": 15,
    "Apricots (100g)": 15,
    "Amajoya butterscotch (100g)": 15,
    "Amajoya buttermilk (100g)": 15,
    "Wrapped nougat (100g)": 15,
    "Ziffers - 5 rolls for R10 (100g)": 15
};

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

Object.keys(price_dict).forEach(function(key)
{
    var option = document.createElement('option');
    option.value = key;
    option.text = key;
    dropdown.appendChild(option);
});


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
    var item = dropdown.value;
    var price = price_dict[item];
    display_line(quantity.textContent, item, price);
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
