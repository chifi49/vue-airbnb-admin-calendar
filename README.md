# vue-airbnb-admin-calendar
a calendar (single, or range selection) made with vuejs that can render custom content on cells
## Installation
`npm install @chifi49/vue-airbnb-admin-calendar`

or

`<script src="vue-airbnb-admin-calendar.umd.min.js"></script>`

## Interactive Demo
[Click here](https://vue-airbnb-admin-calendar-demo.vercel.app/)

## Usage
Imported as vue component
```
<template>
    <vue-airbnb-admin-calendar
    ref="mycalendar"
    :month="calendar.month"
    :year="calendar.year"
    :render_template="renderMyTemplate" 
    
    @day_changed="dayChanged"
    @day_clicked="dayClicked"
    @range_selected="rangeSelected" 
    >
    </vue-airbnb-admin-calendar>

    <br />
    <h3>Programmatically change month and year</h3>
    <button @click="previous_month">Previous Month</button>&nbsp;
    <button @click="next_month">Next Month</button>


</template>
<script>
import vuecalendar from 'vue-airbnb-admin-calendar';
export default{
    components:{
        'vue-airbnb-admin-calendar':vuecalendar
    },
    data(){
        return {
            calendar:{
                month:(new Date()).getMonth(),
                year: (new Date()).getFullYear()
            },
            calendarObj:null
        }
    },
    methods:{
        dayChanged:function(params){

        },
        dayClicked:function(params){

        },
        rangeSelected:function(params){

        },
        renderMyTemplate:function(params){
            var current_day = params.current_day;
            var current_month = params.current_month;
            var current_year = params.current_year;
            var selected = params.selected;
            return "[day="+current_day+"]("+(selected?'yes':'no')+")";
        },

        previous_month:function(){
            this.calendarObj.previous_month();
        },
        next_month:function(){
            this.calendarObj.next_month();
        }
    },
    mounted(){
        this.calendarObj = this.$refs['mycalendar']
    }
}
```
as script
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
        <script src="/vue-airbnb-admin-calendar.umd.min.js?v=21"></script>
    </head>
    <body>
        <div id="app">

            <vuecalendar 
            ref="calendarObj"
            
            :loading="calendar.loading" 
            :show_other_month_days="calendar.show_other_month_days" 
            :month="calendar.month"
            :year="calendar.year"
            :day_number_padding="calendar.day_name_number_padding"
            :day_number_size="calendar.day_name_number_size"

            :render_template="renderData"
            
            @day_clicked="day_clicked"
            @range_selected="range_selected"
            @date_changed="date_changed"
            @next_month="next_month"
            @mounted="calendar_mounted"

            ></vuecalendar>
            <br />
            <button @click="toggleLoader">Toggle Loader</button>
            &nbsp;
            <button @click="showOtherMonthDays">Toggle Other Month Days</button>
            
        </div>
        
        <script type="text/javascript">
        
        new Vue({
            components:{
                vuecalendar:window['vue-airbnb-admin-calendar']
            },
            el:'#app',
            data:function(){
                return {
                    calendar:{
                        month:11,
                        year:2020,
                        loading:false,
                        show_other_month_days: false,
                        day_name_number_padding:'0px',
                        day_name_number_size: '23px'
                    },
                    data:[]
                }
            },
            methods:{
                load_data:function(month,year){
                    var me = this;
                    this.calendar.loading = true;
                    fetch('http://localhost:3000/month/'+month+'/year/'+year)
                    .then(function(response){
                        return response.json();
                    }).then(function(data){
                        var days= data.days;
                        me.data = days;
                        me.$refs['calendarObj']['update_view']();
                        me.calendar.loading = false;
                    })
                },
                calendar_mounted:function(){
                    var o = this.$refs['calendarObj'];
                    console.log(o.get_month(),o.get_year());
                    this.load_data(o.get_month(),o.get_year());
                },
                renderData:function(params){
                    var data = this.data;
                    //console.log(data);
                    //return;
                    var current_day = params.current_day;
                    var current_month = params.current_month;
                    var current_year = params.current_year;
                    var selected_month = params.selected_month;
                    var selected_year = params.selected_year;

                    if(current_month!=selected_month || current_year!=selected_year){
                        return '';
                    }
                    var dataO = data[current_day-1];
                    if(typeof dataO=='undefined'){
                        return '';
                    }
                    return "<span style='font-size:21px;'>"+dataO.price+"</span><br /><span><img src='/assets/icons/key.svg' width='21' height='21' />"+dataO.bookings+"</span>";
                },
                previous_month:function(params){
                    //delete params['instance'];
                    console.log(params);
                },
                next_month:function(params){
                    console.log(params);
                },
                day_clicked:function(params){
                    console.log(params)
                },
                range_selected:function(params){
                    console.log(params);
                },
                date_changed:function(params){
                    this.load_data(params.month,params.year);
                    console.log(params);
                },
                toggleLoader:function(){
                    //alert('in')
                    this.calendar.loading = !this.calendar.loading;
                },
                showOtherMonthDays:function(){
                    this.calendar.show_other_month_days = !this.calendar.show_other_month_days;
                }
            }
        });
        </script>
    </body>

</html>
````