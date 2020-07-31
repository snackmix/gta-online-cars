<template>
    <div class="container-fluid mb-3">
        <form>
            <div class="row">
                <div class="col">
                    <select class="form-control" v-model="search.vehicle_class">
                        <option :value="null"></option>
                        <option v-for="item in vehicleClasses" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div class="col">
                    <select class="form-control" v-model="search.stealable">
                        <option :value="null"></option>
                        <option :value="true">Stealable</option>
                        <option :value="false">Not Stealable</option>
                    </select>
                </div>
                <div class="col">
                    <select class="form-control" v-model="search.sort">
                        <option :value="1">Vehicle Class</option>
                        <option :value="2">Vehicle Name</option>
                        <option :value="3">Sell Price</option>
                        <option :value="4">Buy Price</option>
                        <option :value="5">Acceleration</option>
                        <option :value="6">Handling</option>
                    </select>
                </div>
                <div class="col">
                    <input class="form-control" placeholder="Search..." v-model="search.text">
                </div>
            </div>
        </form>
        <div class="card">
            <div class="card-header">{{ filtered.length }} Vehicles Listed</div>
            <table class="table table-dark table-striped m-0">
                <thead>
                    <tr>
                        <th>Vehicle Class</th>
                        <th>
                            Vehicle Name
                            <i class="far fa-question-circle" v-b-popover.hover.html="help.stats"></i>
                        </th>
                        <th>Buy Price</th>
                        <th>Sell Price</th>
                        <th>
                            Stealable
                            <i class="far fa-question-circle" v-b-popover.hover.html="help.stealable"></i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="car in ordered">
                        <td>{{ car.vehicle_class }}</td>
                        <td>
                            <div class="vehicle-name">{{ car.vehicle_name }}</div>
                            <span class="badge badge-dark mt-2">{{ car.capacity }} Seats</span>
                            <span class="badge badge-dark mt-2">{{ getBadgeStats(car) }}</span>
                            <span class="badge badge-info mt-2" v-if="car.free">{{ car.free }}</span>
                            <span class="badge badge-danger mt-2" v-if="car.limited_edition">Limited Edition</span>
                        </td>
                        <td>{{ car.buy_price | num_format }}</td>
                        <td>{{ car.sell_price | num_format }}</td>
                        <td>{{ booleanHuman(car.stealable) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import ignoreCase from 'ignore-case';
    import {format} from 'util';
    import {orderBy, uniq} from 'lodash';

    export default {
        data() {
            return {
                help: {
                    stats: 'The second badge below the vehicle name are the stats.<br>Speed - Acceleration - Brake - Handling',
                    stealable: 'This means you are able to store the vehicle in your garage or bring it to customs to modify.'
                },
                search: {
                    text: null,
                    stealable: null,
                    vehicle_class: null,
                    sort: 1
                },
                cars: new Array
            };
        },
        computed: {
            vehicleClasses() {
                const mapped = this.cars.map(function (item) {
                    return item.vehicle_class;
                });
                return uniq(mapped);
            },
            ordered() {
                switch (this.search.sort) {
                    case 1:
                        return orderBy(this.filtered, 'vehicle_class', 'asc');
                    case 2:
                        return orderBy(this.filtered, 'vehicle_name', 'asc');
                    case 3:
                        return orderBy(this.filtered, 'sell_price', 'desc');
                    case 4:
                        return orderBy(this.filtered, 'buy_price', 'desc');
                    case 5:
                        return orderBy(this.filtered, 'accel', 'desc');
                    case 6:
                        return orderBy(this.filtered, 'handle', 'desc');
                }
            },
            filtered() {
                const sm = this;
                return sm.cars.filter(function (item) {
                    if (sm.search.text == null) return true;
                    return ignoreCase.includes(item.vehicle_name, sm.search.text);
                }).filter(function (item) {
                    if (sm.search.stealable == null) return true;
                    return item.stealable == sm.search.stealable;
                }).filter(function (item) {
                    if (sm.search.vehicle_class == null) return true;
                    return item.vehicle_class == sm.search.vehicle_class;
                });
            }
        },
        methods: {
            getBadgeStats(car) {
                return format('%s - %s - %s - %s', car.speed, car.accel, car.brake, car.handle);
            },
            booleanHuman(value) {
                return value ? 'Yes' : 'No';
            }
        },
        mounted() {
            const sm = this;
            axios.get('data.json').then(function (resp) {
                sm.cars = resp.data;
            });
        }
    };
</script>