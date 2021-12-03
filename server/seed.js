require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
        DROP TABLE IF EXISTS film_brands CASCADE;
        DROP TABLE IF EXISTS film_speeds CASCADE;
        DROP TABLE IF EXISTS clients CASCADE;
        DROP TABLE IF EXISTS film CASCADE;
        DROP TABLE IF EXISTS orders CASCADE;

        CREATE TABLE clients (
            client_id serial primary key,
            client_name varchar(100),
            email varchar(50)
        );
        
        CREATE TABLE film_brands (
            brand_id serial primary key,
            brand_name varchar(50)
        );
        
        CREATE TABLE film_speeds (
            speed_id serial primary key,
            speed_rating integer
        );
        
        CREATE TABLE film (
            film_id serial primary key,
            film_name varchar(100),
            film_brand integer references film_brands(brand_id),
            film_speed integer references film_speeds(speed_id)
        );
        
        CREATE TABLE orders (
            order_id serial primary key,
            client_id integer references clients(client_id),
            film_id integer references film(film_id),
            notes text,
            date timestamp with time zone,
            paid boolean
        );

        INSERT INTO clients (client_name, email)
        VALUES ('Bella', 'bellsnwhisles@gmail.com'), ('Scotty', 'oldogonthebayou@hotmail.com'), ('Nana', 'legendsneverdie@att.net'), ('Katie', 'katie@bluebayouofficial.com'), ('Ansel', 'natlparkangel@yellastone.com');

        INSERT INTO film_brands (brand_name)
        VALUES ('Kodak'), ('Ilford'), ('Rollei'), ('Arista'), ('Foma'), ('Japancamerahunter');

        INSERT INTO film_speeds (speed_rating) 
        VALUES (50), (80), (100), (200), (400), (3200);

        INSERT INTO film (film_name, film_brand, film_speed)
        VALUES ('Tri-X', 1, 5), 
        ('T-Max', 1, 5),
        ('HP5', 2, 5),
        ('Delta', 2, 6),
        ('PanF', 2, 1), 
        ('Fomapan', 5, 3),
        ('EDU Ultra', 4, 5),
        ('Retro80S', 3, 2),
        ('StreetPan', 6, 5);

        INSERT INTO orders (client_id, film_id, notes, date, paid)
        VALUES (1, 1, 'Pushed 2 stops.', '2021-06-16T12:30:00.000Z', true),
        (2, 2, 'Film was expired 4 years', '2021-06-16T12:30:00.000Z', true),
        (3, 3, 'N/A', '2021-06-16T12:30:00.000Z', true),
        (4, 4, 'Roll shot on Canon AE-1', '2021-06-16T12:30:00.000Z', true);
            `).then(() => {
                console.log('DB seeded!')
                res.sendStatus(200)
            }).catch(err => console.log('error seeding DB', err))
        }
    }