# BeerCrackerz

[![License](https://img.shields.io/github/license/MesseBasseProduction/BeerCrackerz.svg)](https://github.com/MesseBasseProduction/BeerCrackerz/blob/master/LICENSE.md)
![](https://badgen.net/badge/version/0.1.0/blue)

Welcome, fellow beer lovers. BeerCrackerz is a community web app to list the best spots to drink a fresh one while you're outside. It provides a well-known map interface so it is really easy to browse, find or add unique spots!

You want to try it ? We are currently running an instance just so you can try (and add your personnal best places) :

[https://beercrackerz.org](https://beercrackerz.org)

## Get Started

To run your instance, your need to install `docker`, `docker-compose` and `npm` on your system :

- clone the repository on your system ;
- set the `conf.env` values for ports, database users and pass and API keys
- run `docker-compose build`
- run `docker-compose up -d`
- create super user with `docker exec -it beer_crackerz_back python manage.py createsuperuser`
- configure your system web server (or reverse proxy) according to `conf.env` parameters

## About

BeerCrackerz is an open-source software edited and hosted by [Messe Basse Production](https://messe-basse-production.com/), developper by [Arthur Beaulieu]() and [Raphaël Beekmann]()

#### Technologies

[OpenStreetMap](https://www.openstreetmap.org/), [ESRI](https://www.esri.com), [LeafletJs](https://leafletjs.com/), [Leaflet-MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster), [Leaflet-Color-Markers](https://github.com/pointhi/leaflet-color-markers), [SVGRepo](https://www.svgrepo.com/)
