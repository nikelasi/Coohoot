FROM php:8.1-apache

WORKDIR /var/www/html

RUN apt update

RUN apt install -y \
  libicu-dev \
  libpq-dev \
  git \
  supervisor

RUN docker-php-ext-install \
  intl \
  opcache \
  pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .
COPY apache.conf /etc/apache2/sites-enabled/000-default.conf

# RUN composer install (ignored) - vendor will be copied over

RUN chown -R $USER:www-data storage
RUN chown -R $USER:www-data bootstrap/cache
RUN chmod -R 775 storage
RUN chmod -R 775 bootstrap/cache
RUN a2enmod rewrite

# Expose HTTP Port
EXPOSE 80

# Start Supervisor
CMD supervisord -c /var/www/html/supervisor.conf
