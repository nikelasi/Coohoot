FROM php:8.1-apache

WORKDIR /var/www/html

RUN apt update
RUN apt install -y \
            libicu-dev \
            libpq-dev
RUN docker-php-ext-install \
            intl \
            opcache \
            mysqli \
            pdo \
            pdo_pgsql
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .
COPY apache.conf /etc/apache2/sites-enabled/000-default.conf

RUN chown -R $USER:www-data storage
RUN chown -R $USER:www-data bootstrap/cache
RUN chmod -R 775 storage
RUN chmod -R 755 bootstrap/cache
RUN a2enmod rewrite

EXPOSE 80