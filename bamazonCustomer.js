// load the inquirer library
var inquirer = require(`inquirer`);
// load the mysql library
var mysql = require(`mysql`);

function userOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Purchase a product", "Quit"]
    })
    .then(function(answer) {
      console.log(`\n`);
      switch (answer.action) {
        case "Purchase a product":
          purchaseProduct();
          break;

        case "Quit":
          quit();
          break;
      }
    });
}

let displayProducts = function() {
  connection.query(`SELECT * FROM products`, function(err, res) {
    if (err) throw err;
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

    for (let i = 0; i < res.length; i++) {
      let myString = `|`;
      // create the product ID string
      let myId = `${res[i].item_id}`;
      for (let i = 0; i < 11 - myId.length; i++) {
        myString += ` `;
      }
      myString += `${myId} |`;

      // create the product name string
      myString += ` `;
      let myName = res[i].product_name;
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
      let myDept = res[i].department_name;

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
      let myPrice = `${res[i].price}`;
      for (let i = 0; i < 10 - myPrice.length; i++) {
        myString += ` `;
      }
      myString += `${myPrice} |`;

      // create the stock amount string
      let myStock = `${res[i].stock_quantity}`;
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
    userOptions();
  });
};

// function to purchase a product
let purchaseProduct = function() {
  // execute a query to create the values for input validation
  connection.query(`SELECT * FROM products`, function(err, res) {
    if (err) throw err;
    // create an array of id's and a second array of quantities
    let productIds = [];
    let quantities = [];
    for (let i = 0; i < res.length; i++) {
      productIds.push(res[i].item_id);
      quantities.push(res[i].stock_quantity);
    }
    // now ask the user for the product id and quantity to purchase
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "Enter the Product ID you would like to purchase.",
          validate: function(value) {
            if (productIds.indexOf(parseInt(value)) >= 0) {
              return true;
            } else {
              return "Please enter a number greater than 0.";
            }
          }
        }
      ])
      .then(function(answer) {
        let productId = parseInt(answer.id);
        inquirer
          .prompt([
            {
              name: "quantity",
              type: "input",
              message: "Enter the quantity to purchase",
              validate: function(value) {
                if (
                  quantities[productIds.indexOf(productId)] >= parseInt(value) && parseInt(value) >= 0
                ) {
                  return true;
                } else {
                  return "Enter a value that is greater than 0 and less then the available quantity.";
                }
              }
            }
          ])
          .then(function(answer) {
            let quantity = parseInt(answer.quantity);

            connection.query(
              `SELECT * FROM products WHERE item_id=${productId}`,
              function(err, res) {
                if (err) throw err;
                let myItem = res[0];
                // tell the user how much of whatever they bought
                console.log(
                  `You purchased ${quantity} of ${
                    myItem.product_name
                  } for $${quantity * myItem.price}`
                );

                // update the quantity for the product id
                connection.query(
                  `UPDATE products SET stock_quantity = ${myItem.stock_quantity -
                    quantity} WHERE item_id = ${productId}`,
                  function(err, res) {
                    if (err) throw err;
                    console.log(`Thank you for shopping at bamazon.`);
                    displayProducts();
                  }
                );
              }
            );
          });
      });
  });
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
  //console.log("connected as id " + connection.threadId);
  displayProducts();
});
