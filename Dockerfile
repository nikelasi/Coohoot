# Dockerfile - Image for Railway Deployment
FROM php:8.1-apache

# Update packages
RUN apt update

# 1: Build React App
RUN mkdir /var/www/react-client
WORKDIR /var/www/react-client

RUN apt install -y nodejs npm

COPY ./react-client .

RUN npm install
RUN npm run build

# 2: Install Laravel App
WORKDIR /var/www/html
COPY ./.env.server ./.env

RUN apt install -y \
  libicu-dev \
  libpq-dev \
  zip \
  git

RUN docker-php-ext-install \
  intl \
  opcache \
  pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./laravel-server .
COPY ./laravel-server/apache.conf /etc/apache2/sites-enabled/000-default.conf

RUN composer install

# 3: Set Permissions
RUN chown -R $USER:www-data storage
RUN chown -R $USER:www-data bootstrap/cache
RUN chmod -R 775 storage
RUN chmod -R 775 bootstrap/cache
RUN a2enmod rewrite

# 4: Copy React App to Laravel App
RUN mkdir /var/www/html/public/client
RUN cp -r /var/www/react-client/dist/* /var/www/html/public/client

# 5: Expose HTTP Port
EXPOSE 80

# 6: Entry Point
ENTRYPOINT ["/bin/bash", "entry.sh"]