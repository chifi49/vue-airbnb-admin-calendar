<template>
    <div id="app">
        
        <vuecalendar 
        
        


        @dateChanged="date_changed"


        >
        
        </vuecalendar>

        <br />
        <button @click="toggleLoader">Toggle Loader</button>&nbsp;
        <button @click="clearSelection">Clear Selection</button>
        &nbsp;
        <button @click="set_month">Set 1st month</button>
        &nbsp;
        <button @click="toggleOtherMonths">Show/Hide Other Month Days</button>
        &nbsp;
        <button @click="loadData">Load Data</button>
        &nbsp;
        <button @click="toggleNavMonths">Toggle Nav Months</button>
        &nbsp;
        <button @click="toggleNavYears">Toggle Nav Years</button>
        <br />
        <button @click="update_view">Update View</button>
        <textarea :value="event_log" style="width:50%;min-width:200px;height:300px;"></textarea>
    </div>
</template>
<script>
import vuecalendar from './vue-airbnb-admin-calendar';
//import vuecalendar from './dist/vue-airbnb-admin-calendar.umd.js';
//import vuecalendarcss from './dist/vue-airbnb-admin-calendar.css';

export default{
    components:{
        
        vuecalendar
    },
    data:function(){
        return {
            event_log:'',
            calendar:{
                month: 10,
                year: 2020,
                loading:false,
                showOtherMonthDays:true,
                todayNameNumberBackgroundColor:'#888',
                otherMonthDayBackgroundColor:'#efefef',
                otherMonthDayColor:'#000',
                navMonthVisible:true,
                navYearVisible:true,

                dayShortNames:[
                    'Κυρ','Δευ','Τρι','Τετ','Πεμ','Παρ','Σαβ'
                ],
                monthNames:[
                    'Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μαϊος','Ιούνιος','Ιούλιος','Άυγουστος','Σεπτέμβριος',
                    'Οκτώβριος','Νοέμβριος','Δεκέμβριος'
                ]
            },
            data:[

            ]
        };
    },
    methods:{
        update_view:function(){
            this.$refs['calendarObj'].update_view();
        },
        set_month:function(){
            this.$refs['calendarObj'].set_month(0);
        },
        previous_month:function(params){
            //delete params['instance'];
            this.event_log += 'previous month clicked'+JSON.stringify(params)+'\n';
        },
        previous_year:function(params){
            //delete params['instance'];
            this.event_log += 'previous year clicked'+JSON.stringify(params)+'\n';
        },
        next_year:function(params){
            //delete params['instance'];
            this.event_log += 'next year clicked'+JSON.stringify(params)+'\n';
        },
        next_month:function(params){
            //delete params['instance'];
            this.event_log += 'next month clicked'+JSON.stringify(params)+'\n';
        },
        day_clicked:function(params){
            //delete params['instance'];
            this.event_log += 'day clicked:'+JSON.stringify(params)+'\n';
        },
        range_selected:function(params){
           // delete params['instance'];
            this.event_log += 'range selected:'+JSON.stringify(params)+'\n';
        },
        date_changed:function(params){
            //console.log(JSON.stringify(params));
            this.event_log += 'date changed'+JSON.stringify(params)+'\n';
        },
        loader_started:function(){
            this.event_log += 'loader started\n'
        },
        loader_ended:function(){
            this.event_log += 'loader ended\n'
        },
        month_changed:function(params){
            this.event_log += 'month changed:'+params.month+'\n'
        },
        year_changed:function(params){
            this.event_log += 'year changed:'+params.year+'\n';
        },
        selection_reset:function(params){
            this.event_log += 'selection reset'+JSON.stringify(params)+'\n';
        },
        renderDateData:function(day){
            //console.log(day);
            
            return '['+day+']';
        },
        toggleLoader:function(){
            this.calendar.loading = !this.calendar.loading;
        },
        clearSelection:function(){
            this.$refs['calendarObj'].clearSelection()
        },
        toggleOtherMonths:function(){
            this.calendar.showOtherMonthDays = !this.calendar.showOtherMonthDays;
        },
        toggleNavYears:function(){
            this.calendar.navYearVisible = !this.calendar.navYearVisible;
        },
        toggleNavMonths:function(){
            this.calendar.navMonthVisible = !this.calendar.navMonthVisible;
        },
        loadData:function(){
            alert('false')
        }
    }
}
</script>
<style scoped>
body{
    margin:0;
    padding:0;
}
</style>