# Anteckningar
sudo service mysql restart

history | grep mysql

### Super user creation
sudo mysql -u root


CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost';
for example
CREATE USER 'marcus'@'localhost' IDENTIFIED BY 'daugbro';
GRANT ALL PRIVILEGES ON *.* TO 'marcus'@'localhost';

exit
###
mysql -u username -p

show databases;
use mysql;
show tables;

select * from ___
select * from user
describe ___

create database te19
use te19
create table users (id INT UNSIGNED AUTO_INCREMENT, PRIMARY KEY(id)) ENGINE = innodb character set 'utf8mb4';
ALTER TABLE users ADD name VARCHAR (140) NOT NULL;
INSERT INTO users (name) VALUES ('Marcus');

ALTER TABLE users ADD password VARCHAR (255) NOT NULL;
INSERT INTO users (name, password) VALUES ('Marcus', 'daugbro');

delete from tasks WHERE id=4;
update tasks SET completed = 1, updated_at=now() where id=1