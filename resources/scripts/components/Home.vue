<template>
    <div class="container-fluid mb-3">
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <div class="search-header">Sort By</div>
                    <select class="form-control" v-model="search.sort">
                        <option :value="1">Vehicle Class</option>
                        <option :value="2">Vehicle Name</option>
                        <option :value="3">Release Date</option>
                        <option :value="4">Purchase Price</option>
                        <option :value="5">Sell Price - Resale</option>
                        <option :value="6">Sell Price - Stolen</option>
                        <option :value="10">Overall Rating</option>
                        <option :value="11">Speed</option>
                        <option :value="12">Acceleration</option>
                        <option :value="13">Braking</option>
                        <option :value="14">Handling</option>
                    </select>
                </div>
                <div class="form-group">
                    <div class="search-header">Vehicle Name</div>
                    <input class="form-control" placeholder="Search Vehicle Name..." v-model="search.text">
                </div>
                <div class="form-group">
                    <div class="search-header">Manufacturer</div>
                    <select class="form-control" v-model="search.manufacturer">
                        <option :value="null"></option>
                        <option v-for="item in reduceMany('manufacturer')">{{ item }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <div class="search-header">Vehicle Class</div>
                    <b-form-checkbox-group v-model="search.class" :options="reduceMany('vehicle_class')" stacked></b-form-checkbox-group>
                </div>
                <div class="form-group">
                    <div class="search-header">Sell</div>
                    <b-form-checkbox-group v-model="search.sell" :options="reduceMany('sell')" stacked></b-form-checkbox-group>
                </div>
                <div class="form-group">
                    <div class="search-header">Storage Location</div>
                    <b-form-checkbox-group v-model="search.storage" :options="reduceMany('storage_location')" stacked></b-form-checkbox-group>
                </div>
                <div class="form-group">
                    <div class="search-header">Drivetrain</div>
                    <select class="form-control" v-model="search.drivetrain">
                        <option :value="null"></option>
                        <option v-for="item in reduceMany('drivetrain')">{{ item }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <div class="search-header">Max Purchase Price</div>
                    <b-form-input v-model="search.max_price" type="range" min="0" max="10000000" step="5000" v-b-tooltip :title="search.max_price"></b-form-input>
                </div>
                <div class="form-group">
                    <div class="search-header">Based On</div>
                    <input class="form-control" placeholder="Search Based On..." v-model="search.based">
                </div>
            </div>
            <div class="col-md-9">
                <div class="card mb-3 car-card" v-for="car in paginated" @click="openDetails(car)">
                    <div class="row no-gutters">
                        <div class="col-md-3">
                            <span class="manufacturer" v-if="car.manufacturer">{{ car.manufacturer }}</span>
                            <span class="seats">{{ car.seats }}</span>
                            <b-img-lazy :src="car.thumbnail" class="card-img"></b-img-lazy>
                        </div>
                        <div class="col-md-9">
                            <div class="card-body py-0">
                                <div class="price-badges">
                                    <span class="badge badge-success" v-if="car.purchase_price > 0" v-b-tooltip title="Purchase Price">{{ car.purchase_price | num_format }}</span>
                                    <span class="badge badge-danger" v-if="car.resale_sell_price > 0" v-b-tooltip title="Sell Price - Resale">{{ car.resale_sell_price | num_format }}</span>
                                    <span class="badge badge-danger" v-if="car.stolen_sell_price > 0" v-b-tooltip title="Sell Price - Stolen">{{ car.stolen_sell_price | num_format }}</span>
                                </div>
                                <div class="font-weight-bold">{{ car.name }}</div>
                                <p class="card-text">{{ car.vehicle_class.join(', ') }}</p>
                                <div class="item-stats">
                                    <ul>
                                        <li>
                                            <span class="field-label">Overall</span>
                                            <span class="field-value">{{ car.overall_rating | num_format('0.00') }}</span>
                                        </li>
                                        <li>
                                            <span class="field-label">Speed</span>
                                            <span class="field-value">{{ car.speed | num_format('0.00') }}</span>
                                        </li>
                                        <li>
                                            <span class="field-label">Acceleration</span>
                                            <span class="field-value">{{ car.acceleration | num_format('0.00') }}</span>
                                        </li>
                                        <li>
                                            <span class="field-label">Braking</span>
                                            <span class="field-value">{{ car.braking | num_format('0.00') }}</span>
                                        </li>
                                        <li>
                                            <span class="field-label">Handling</span>
                                            <span class="field-value">{{ car.handling | num_format('0.00') }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import ignoreCase from 'ignore-case';
    import {add, get, isEmpty, lte, orderBy, slice} from 'lodash';
    import Modal from './Modal';
    import CarDetails from './CarDetails';

    export default {
        data() {
            return {
                search: {
                    text: null,
                    sell: new Array,
                    class: new Array,
                    storage: new Array,
                    drivetrain: null,
                    manufacturer: null,
                    based: null,
                    max_price: 10000000,
                    sort: 1
                },
                paginate: {
                    page: 1,
                    per_page: 50
                },
                cars: new Array
            };
        },
        watch: {
            search: {
                deep: true,
                handler() {
                    this.paginate.page = 1;
                }
            }
        },
        computed: {
            paginated() {
                return slice(this.ordered, 0, this.paginate.page * this.paginate.per_page);
            },
            ordered() {
                switch (this.search.sort) {
                    case 1:
                        return orderBy(this.filtered, 'vehicle_class', 'asc');
                    case 2:
                        return orderBy(this.filtered, 'name', 'asc');
                    case 3:
                        return orderBy(this.filtered, 'release_date', 'desc');
                    case 4:
                        return orderBy(this.filtered, 'purchase_price', 'desc');
                    case 5:
                        return orderBy(this.filtered, 'resale_sell_price', 'desc');
                    case 6:
                        return orderBy(this.filtered, 'stolen_sell_price', 'desc');
                    case 10:
                        return orderBy(this.filtered, 'overall_rating', 'desc');
                    case 11:
                        return orderBy(this.filtered, 'speed', 'desc');
                    case 12:
                        return orderBy(this.filtered, 'acceleration', 'desc');
                    case 13:
                        return orderBy(this.filtered, 'braking', 'desc');
                    case 14:
                        return orderBy(this.filtered, 'handling', 'desc');
                }
            },
            filtered() {
                const sm = this;
                return sm.cars.filter(function (item) {
                    if (isEmpty(sm.search.text)) return true;
                    return ignoreCase.includes(item.name, sm.search.text);
                }).filter(function (item) {
                    if (isEmpty(sm.search.based)) return true;
                    return ignoreCase.includes(item.based_on, sm.search.based);
                }).filter(function (item) {
                    if (isEmpty(sm.search.class)) return true;
                    return item.vehicle_class.hasAny(sm.search.class);
                }).filter(function (item) {
                    if (isEmpty(sm.search.sell)) return true;
                    return item.sell.hasAny(sm.search.sell);
                }).filter(function (item) {
                    if (isEmpty(sm.search.storage)) return true;
                    return item.storage_location.hasAny(sm.search.storage);
                }).filter(function (item) {
                    if (isEmpty(sm.search.drivetrain)) return true;
                    return item.drivetrain == sm.search.drivetrain;
                }).filter(function (item) {
                    if (isEmpty(sm.search.manufacturer)) return true;
                    return item.manufacturer == sm.search.manufacturer;
                }).filter(function (item) {
                    return lte(item.purchase_price, sm.search.max_price);
                });
            }
        },
        methods: {
            openDetails(car) {
                new Modal(this, CarDetails, {
                    car: car
                }).show();
            },
            reduceMany(name) {
                return this.cars.reduce(function (accumulator, current) {
                    const value = get(current, name);
                    return value == null ? accumulator : accumulator.concat(value);
                }, new Array).uniq().sortBy();
            },
            load() {
                axios.get('data.json').then(resp => this.cars = resp.data);
            },
            registerEvents() {
                const sm = this;
                $(window).on('scroll', function () {
                    const current = window.innerHeight + window.scrollY;
                    const height = document.body.scrollHeight * 0.9;
                    if (current > height) sm.paginate.page = add(sm.paginate.page, 1);
                });
            }
        },
        mounted() {
            this.load();
            this.registerEvents();
        }
    };
</script>