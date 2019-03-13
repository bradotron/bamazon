// load the inquirer library
var inquirer = require(`inquirer`);
// load the mysql library
var mysql = require(`mysql`);

function userOptions() {
  // * View Products for Sale

  // * View Low Inventory

  // * Add to Inventory

  // * Add New Product
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View the Products",
        "View low inventory items",
        "Add inventory",
        "Add a new product",
        "Quit"
      ]
    })
    .then(function(answer) {
      console.log(`\n`);
      switch (answer.action) {
        case "View the Products":
          viewProducts();
          break;
        case "View low inventory items":
          viewLowInventory();
          break;
        case "Add inventory":
          addInventory();
          break;
        case "Add a new product":
          addProduct();
          break;
        case "Quit":
          quit();
          break;
      }
    });
}

let viewProducts = function() {
  // this function will list all products in the database
  connection.query(`SELECT * FROM products`, function(err, res) {
    if (err) throw err;
    logProductTable(res);
    userOptions();
  });
};

let logProductTable = function(products) {
  console.log(`\n`);
  // display a table header
  //           1         2         3         4         5         5         6
  // 0123456789012345678901234567890123456789012345678901234567890123456789012345
  // | Product ID |   Product Name   |   Department   | Unit Price |  Stock  |
  console.log(
    `|-----------------------------------------------------------------------|`
  );

  console.log(
    `| Product ID |   Product Name   |   Department   | Unit Price |  Stock  |`
  );
  console.log(
    `|------------|------------------|----------------|------------|---------|`
  );
  //           | 12 chars   | 18 chars         | 16 chars       | 12 chars   | 9 chars |

  for (let i = 0; i < products.length; i++) {
    let myString = `|`;
    // create the product ID string
    let myId = `${products[i].item_id}`;
    for (let i = 0; i < 11 - myId.length; i++) {
      myString += ` `;
    }
    myString += `${myId} |`;

    // create the product name string
    myString += ` `;
    let myName = products[i].product_name;
    if (myName.length > 16) {
      for (let i = 0; i < 16; i++) {
        myString += myName[i];
      }
    } else {
      for (let i = 0; i < 16 - myName.length; i++) {
        myString += ` `;
      }
      myString += myName;
    }

    // create the department string
    myString += ` | `;
    let myDept = products[i].department_name;

    if (myDept.length > 14) {
      for (let i = 0; i < 14; i++) {
        myString += myDept[i];
      }
    } else {
      for (let i = 0; i < 14 - myDept.length; i++) {
        myString += ` `;
      }
      myString += myDept;
    }

    // create the unit price string
    myString += ` | `;
    let myPrice = `${products[i].price}`;
    for (let i = 0; i < 10 - myPrice.length; i++) {
      myString += ` `;
    }
    myString += `${myPrice} |`;

    // create the stock amount string
    let myStock = `${products[i].stock_quantity}`;
    for (let i = 0; i < 8 - myStock.length; i++) {
      myString += ` `;
    }
    myString += `${myStock} |`;

    // log the product
    console.log(myString);
  }

  // print a seperator
  console.log(
    `|-----------------------------------------------------------------------|\n`
  );
};

let viewLowInventory = function() {
  // this function will display any products that have a stock quantity less than 5
  connection.query(`SELECT * FROM products WHERE stock_quantity<5`, function(
    err,
    res
  ) {
    if (err) throw err;
    if (res.length > 0) {
      logProductTable(res);
    } else {
      console.log(`No items with low inventory found.\n`);
    }
    userOptions();
  });
};

let addInventory = function() {
  // this function will ask the user for a product id and a quantity - it will add the quantity to the stock_quantity for the given productId
  connection.query(`SELECT * FROM products`, function(err, res) {
    if (err) throw err;
    // create an array of id's and a second array of quantities
    let productIds = [];
    let quantities = [];
    for (let i = 0; i < res.length; i++) {
      productIds.push(res[i].item_id);
      quantities.push(res[i].stock_quantity);
    }

    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "Enter a Product ID",
          validate: function(value) {
            if (productIds.indexOf(parseInt(value)) >= 0) {
              return true;
            } else {
              return "Please enter a valid Product ID";
            }
          }
        },
        {
          name: "quantity",
          type: "input",
          message: "Enter the quantity of inventory to add",
          validate: function(value) {
            if (parseInt(value) > 0) {
              return true;
            } else {
              return "Enter a value that is greater than 0";
            }
          }
        }
      ])
      .then(function(answer) {
        let productIndex = productIds.indexOf(parseInt(answer.id));
        let currentStock = res[productIndex].stock_quantity;

        connection.query(
          `UPDATE products SET stock_quantity = ${currentStock +
            parseInt(answer.quantity)} WHERE item_id = ${answer.id}`,
          function(err, res) {
            if (err) throw err;
            console.log(
              `Inventory of ${answer.id} has been increased by ${
                answer.quantity
              }`
            );
            userOptions();
          }
        );
      });
  });
};

let addProduct = function() {
  // this function will prompt the user for all of the information required to add a new item to the database
  console.log(`addProduct()`);
  userOptions();
};

// Quit function - close the connection
let quit = function() {
  connection.end();
};

// ------------ CODE EXECUTION BELOW THIS POINT ------------- //

// create the database connection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "m!ksE56lo",
  database: "bamazon"
});

// connect to the database, then if successful execute the userOptions function
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  userOptions();
});
