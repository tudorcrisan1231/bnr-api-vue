<template>
    <div v-if="this.exist_data">
        <Line
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
        />
        <div class="page_select">
            <div class="page_select_title">Filters:</div>
            <select name="" id="" multiple v-model="selected_currencies" class="page_preference">
                <option v-for="(item, index) in this.getCurrenciesValues()" :key="index" v-bind:value="item">{{ item }}</option>
            </select>
            <div class="page_select_btns">
                <div @click="savePreference()" class="page_save">Save preferences</div>
                <div @click="resetPreference()" class="page_save" style="background-color: brown;">RESET preferences</div>
            </div>
            
        </div>

    </div>
    <div v-else>
        <p class="page_none">No data to display the chart</p>
    </div>

</template>

<script>
    // import { reactive } from "vue";
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale , PointElement, LineElement } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

    export default {
    name: 'ChartData',
    props: {
        
    },
    components: { Line },
    data() {
        return {
            chartData: {
                labels: this.getAllDates(),
                datasets: this.getAllCurrencies(),
                // backgroundColor: this.getAllCurrencies(),
                // borderColor: this.getAllCurrencies(),
                // borderWidth: 1,
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Currencies'
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 5 // Set the precision to 3 decimal places
                        }
                    }]
                }
            },
            selected_currencies: [],
            exist_data: true,
        }
    },

    methods: {
        getAllDates(){
            let dates = JSON.parse(localStorage.getItem('dates'));
            return dates;
        },
        getAllData(){
       
            let dates = JSON.parse(localStorage.getItem('dates'));
            console.log(dates);
            if(dates){

                let data = [];
                for(let i = 0; i < dates.length; i++){

                    let data_xml = localStorage.getItem(dates[i]);
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data_xml, 'text/xml');

                    let rates = xmlDoc.getElementsByTagName('Cube')[0].getElementsByTagName('Rate');

                    data.push(rates);
                }

                this.exist_data = true;
                console.log(data);
                return data;
            } else {
                this.exist_data = false;
                return [[]];
            }

        },

        getCurrenciesValues(){
            let rates = this.getAllData();
            let currencies = [];

            let selected_currencies_fromLS = JSON.parse(localStorage.getItem('prefered_currencies'));

            for(let i = 0; i < rates[0].length; i++){
                currencies.push(rates[0][i].attributes.currency.value);
            }

            if(selected_currencies_fromLS){


                for(let i = 0; i < rates[0].length; i++){
                    if(selected_currencies_fromLS){
                        if(selected_currencies_fromLS.includes(rates[0][i].attributes.currency.value)){
                            this.selected_currencies.push(rates[0][i].attributes.currency.value);
                        }
                    }
                    else {
                        this.selected_currencies.push(rates[0][i].attributes.currency.value);
                    }
                }
            }
            
            return currencies;
        },
        

        getAllCurrencies(){
            let rates = this.getAllData();
            let currencies = [], datasets = [];

            let selected_currencies = JSON.parse(localStorage.getItem('prefered_currencies'));

            if(selected_currencies){
                for(let i = 0; i < rates[0].length; i++){
                    if(selected_currencies){
                        for(let j = 0; j < selected_currencies.length; j++){
                            if(selected_currencies[j] == rates[0][i].attributes.currency.value){
                                currencies.push(rates[0][i].attributes.currency.value);
                            }
                        }
                    } else {
                        currencies.push(rates[0][i].attributes.currency.value);
                    }
                }

            } else {
                for(let i = 0; i < rates[0].length; i++){
                    currencies.push(rates[0][i].attributes.currency.value);
                }
            }


            //aici formez datele pt chart in functie de valutele selectate de user si le pun in datasets sub formatul {data: [1,2,3], label: 'RON'} pt ca asa vrea chart.js
            for(let i = 0; i<currencies.length; i++){
                let data = [];
                for(let j = 0; j < rates.length; j++){
                    
                    for(let k = 0; k < rates[j].length; k++){
                        if(rates[j][k].attributes.currency.value == currencies[i]){
                            data.push(parseFloat(rates[j][k].innerHTML));
                        }
                    }

                }
                datasets.push({data: data, label: currencies[i]});
            }

            return datasets;
        },

        generateColors(){
            let nr = this.getAllCurrencies().length;
            let colors = [];
            for(let i = 0; i < nr; i++){
                //rgb color
                let color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +  Math.floor(Math.random() * 255) + ')';
                colors.push(color);
            }
            return colors;
        },

        savePreference(){
            localStorage.setItem('prefered_currencies', JSON.stringify(this.selected_currencies));
            //refresh page
            location.reload();
        },

        resetPreference(){
            localStorage.removeItem('prefered_currencies');
            //refresh page
            location.reload();
        }

    },

    mounted() {
        this.getAllData();
    }
    
    }
</script>