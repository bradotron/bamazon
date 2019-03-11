/* Seeds for SQL table. We haven't discussed this type of file yet */
USE bamazon;

/* Insert 10 items into the product database */
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("Potatoe", "Produce", 1.50, 100), 
        ("Tomato", "Produce", 0.99, 60), 
        ("Apple", "Produce", 0.99, 80), 
        ("Orange", "Produce", 0.59, 120), 
        ("Beta Fish", "Animals", 5.99, 5), 
        ("Feeder Mouse", "Animals", 2.99, 16), 
        ("Instant Pot", "Kitchen", 79.99, 12), 
        ("Sous Vide", "Kitchen", 69.99, 16), 
        ("55 inch Flat Screen TV", "Electronics", 199.99, 8), 
        ("Nintendo Switch", "Electronics", 299.99, 10);
