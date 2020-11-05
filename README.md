# vue-airbnb-admin-calendar
a calendar (single, or range selection) made with vuejs that can render custom content on cells
## Installation
`npm install @chifi49/vue-airbnb-admin-calendar`

or

`<script src="vue-airbnb-admin-calendar.umd.min.js"></script>`

## Usage
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