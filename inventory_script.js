
let productsData; // To store the products data
let selectedIndex = -1;

function handleFile()
{
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            productsData = JSON.parse(e.target.result);
            createTable(productsData);
        };

        reader.readAsText(file);
    }
}

function createTable(products)
{
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const priceCell = document.createElement('td');

        nameCell.innerText = product.name;
        priceCell.innerText = product.price;

        row.appendChild(nameCell);
        row.appendChild(priceCell);

        row.onclick = function ()
        {
            updateOutput(product.name, product.price, index);
        };

        tableBody.appendChild(row);
        });
}

function updateOutput(name, price, index) 
{
    selectedIndex = index;
    console.log(selectedIndex);
    document.getElementById('selectedName').value = `${name}`;
    document.getElementById('selectedPrice').value = `${price}`;
}

function updateFile()
{
    if (productsData) 
    {
        const jsonString = JSON.stringify(productsData, null, 2); // Convert to a formatted JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'productsData.json';
        a.textContent = 'Download JSON Data';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
    } 
    else 
    {
        console.log('productsData is not available yet.');
    }
}

function addProduct() 
{
    var name = document.getElementById('selectedName').value;
    var price = document.getElementById('selectedPrice').value;

    productsData.push({
        "name":   name,
        "price": price
    })
    console.log(productsData);
    updateFile();
}

function updateProduct() 
{
    var selectedName = document.getElementById('selectedName').value;
    var selectedPrice = document.getElementById('selectedPrice').value;

    productsData[selectedIndex].name = selectedName;
    productsData[selectedIndex].price = selectedPrice;
    updateFile();
}

function deleteProduct()
{
    if (selectedIndex !== -1)
    {
        // Remove the element at the found index
        productsData.splice(selectedIndex, 1);
        // After removing, recreate the table
        updateFile();
    }
    else
    {
        console.log('Product not found in productsData.');
    }
}


