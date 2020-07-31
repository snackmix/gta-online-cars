const mix = require('laravel-mix');

mix.options({
    processCssUrls: false
}).disableNotifications();

mix.js('resources/scripts/app.js', 'public/scripts');
mix.sass('resources/sass/app.scss', 'public/css');