<template>
    <div id="app">
        
        <vuecalendar 
        
        ref="calendarObj"

        :renderTemplate="renderDateData" 

        :dayShortNames="calendar.dayShortNames"
        :monthNames="calendar.monthNames"

        :month="calendar.month" 
        :year="calendar.year"
        :loading="calendar.loading"

        :todayNameNumberBackgroundColor="calendar.todayNameNumberBackgroundColor"

        @previousMonth="previous_month"
        @previousYear="previous_year"
        @nextYear="next_year"
        @nextMonth="next_month"

        @monthChanged="month_changed"
        @yearChanged="year_changed"

        @dayClicked="day_clicked"
        @rangeSelected="range_selected"

        @loaderStarted="loader_started"
        @loaderEnded="loader_ended"

        @selectionReset="selection_reset"

        >
        
        </vuecalendar>

        <br />
        <button @click="toggleLoader">Toggle Loader</button>&nbsp;
        <button @click="clearSelection">Clear Selection</button>
        &nbsp;
        <button @click="set_month">Set 1st month</button>
        <br />
        <button @click="update_view">Update View</button>
        <textarea :value="event_log" style="width:50%;min-width:200px;height:300px;"></textarea>
    </div>
</template>
<script>
import vuecalendar from './vue-airbnb-admin-calendar';

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
                todayNameNumberBackgroundColor:'#afafaf',
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
            delete params['instance'];
            this.event_log += 'previous month clicked'+JSON.stringify(params)+'\n';
        },
        previous_year:function(params){
            delete params['instance'];
            this.event_log += 'previous year clicked'+JSON.stringify(params)+'\n';
        },
        next_year:function(params){
            delete params['instance'];
            this.event_log += 'next year clicked'+JSON.stringify(params)+'\n';
        },
        next_month:function(params){
            delete params['instance'];
            this.event_log += 'next month clicked'+JSON.stringify(params)+'\n';
        },
        day_clicked:function(params){
            delete params['instance'];
            this.event_log += 'day clicked:'+JSON.stringify(params)+'\n';
        },
        range_selected:function(params){
            delete params['instance'];
            this.event_log += 'range selected:'+JSON.stringify(params)+'\n';
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
            console.log(day);
            
            return '';//'['+day+']';
        },
        toggleLoader:function(){
            this.calendar.loading = !this.calendar.loading;
        },
        clearSelection:function(){
            this.$refs['calendarObj'].clearSelection()
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