<template>
    <div class="v-modal-container">
        <div class="v-modal-header">Vehicle Information</div>
        <table class="table table-striped table-borderless car-details">
            <tbody>
                <tr>
                    <td>Vehicle Name</td>
                    <td>{{ car.name }}</td>
                </tr>
                <tr>
                    <td>Vehicle Class</td>
                    <td>{{ car.vehicle_class.join(', ') }}</td>
                </tr>
                <tr v-if="car.manufacturer">
                    <td>Manufacturer</td>
                    <td>{{ car.manufacturer }}</td>
                </tr>
                <tr>
                    <td>Available From</td>
                    <td>{{ car.available_from.join(', ') }}</td>
                </tr>
                <tr>
                    <td>Purchase Price</td>
                    <td>{{ car.purchase_price | num_format }}</td>
                </tr>
                <tr v-if="car.storage_location">
                    <td>Storage Location</td>
                    <td>{{ car.storage_location.join(', ') }}</td>
                </tr>
                <tr v-if="car.modifications">
                    <td>Modifications</td>
                    <td>{{ car.modifications.join(', ') }}</td>
                </tr>
                <tr>
                    <td>Sell</td>
                    <td>{{ car.sell.join(', ') }}</td>
                </tr>
                <tr v-if="car.resale_sell_price > 0">
                    <td>Sell Price - Resale</td>
                    <td>{{ car.resale_sell_price | num_format }}</td>
                </tr>
                <tr v-if="car.stolen_sell_price > 0">
                    <td>Sell Price - Stolen</td>
                    <td>{{ car.stolen_sell_price | num_format }}</td>
                </tr>
                <tr v-if="car.top_speed_game_files > 0">
                    <td>Top Speed</td>
                    <td>{{ car.top_speed_game_files }} KMH</td>
                </tr>
                <tr v-if="car.based_on">
                    <td>Based On</td>
                    <td>{{ car.based_on }}</td>
                </tr>
                <tr>
                    <td>Title Update</td>
                    <td>{{ car.title_update }}</td>
                </tr>
                <tr>
                    <td>Seats</td>
                    <td>{{ car.seats }}</td>
                </tr>
                <tr>
                    <td>Weight</td>
                    <td>{{ car.weight | num_format }} KG</td>
                </tr>
                <tr>
                    <td>Drivetrain</td>
                    <td>{{ car.drivetrain }}</td>
                </tr>
                <tr>
                    <td>Gears</td>
                    <td>{{ car.gears }}</td>
                </tr>
            </tbody>
        </table>
        <div class="v-modal-header">Vehicle Statistics</div>
        <table class="table table-striped table-borderless car-details">
            <tbody>
                <tr>
                    <td width="20%">Speed</td>
                    <td width="50%">
                        <b-progress :value="car.speed" :max="100" variant="success"></b-progress>
                    </td>
                    <td width="30%">{{ car.speed | num_format('0.00') }}</td>
                </tr>
                <tr>
                    <td>Acceleration</td>
                    <td>
                        <b-progress :value="car.acceleration" :max="100" variant="info"></b-progress>
                    </td>
                    <td>{{ car.acceleration | num_format('0.00') }}</td>
                </tr>
                <tr>
                    <td>Braking</td>
                    <td>
                        <b-progress :value="car.braking" :max="100" variant="danger"></b-progress>
                    </td>
                    <td>{{ car.braking | num_format('0.00') }}</td>
                </tr>
                <tr>
                    <td>Handling</td>
                    <td>
                        <b-progress :value="car.handling" :max="100" variant="warning"></b-progress>
                    </td>
                    <td>{{ car.handling | num_format('0.00') }}</td>
                </tr>
                <tr>
                    <td>Overall</td>
                    <td></td>
                    <td>{{ car.overall_rating | num_format('0.00') }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props: ['car']
    };
</script>