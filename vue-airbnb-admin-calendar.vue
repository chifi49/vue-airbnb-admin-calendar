<template>
    <div class="" style="position:relative;">
        <div class=" month-year" v-show="monthyear_header_visible">
            <div class="" @click="previous_month" :style="{'visibility':navprevious_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'left'}">
                <i class="fas fa-chevron-circle-left"></i>
            </div>
            <div class="" :style="{'visibility':monthyear_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':'80%','text-align':'center'}">
                {{monthNames[month]}} / {{year}}
            </div>
            <div class="" @click="next_month" :style="{'visibility':navnext_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'right'}">
                <i class="fas fa-chevron-circle-right"></i>
            </div>
        </div>
        <div class="daynames" >
            <div v-for="(dayname,index) in dayShortNames" v-bind:key="'dayname-'+index" :style="{'display':'inline-block','width':'14.28%','text-align':dayNameCellAlign,'border-style':'solid','border-width':'1px','border-color':dayNameCellBorderColor,'box-sizing':'border-box'}">
                {{dayname}}
            </div>
        </div>
        <div class=" days display-table" >
            <div :data-selected="isSelected(day)?1:0" @mouseover="cell_hover($event)" @mouseleave="cell_leave($event)" :style="{'background-color':isSelected(day)?selected_cell_bg:'','color':isSelected(day)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block'}" :class="{'display-table-cell':true}" v-bind:key="'dayday'+index" v-for="(day,index) in days" @click="cell_clicked($event)" :data-day="day">
                <template v-if="day>0?true:false">
                        <span class="daynumber" :style="{'text-align':daynumber_position,'width':'100%','position':'relative'}"><span>{{day}}</span></span>
                    
                        <div v-html="renderTemplate(day)"></div>
                        
                </template>
            </div>
        </div>
        <div class="ratesmonthlycalendar-loader" v-show="loading" style="position:absolute;top:0px;left:0px;width:100%;bottom:0px;vertical-align:middle;text-align:center;background-color:rgb(255,255,255,0.3);">
            <div class="loader" style="position:relative;top:45%;margin:0 auto;"></div>
        </div>
    </div>
</template>
<script>

export default{
    name:'vue-airbnb-admin-calendar',
    props:{
        renderTemplate:{
            required:false,
            type:Function,
            default:function(){
                return '';
            }
        },
        loading:{
            required:false,
            type:Boolean,
            default:false
        },
        loader_bg:{
            required:false,
            type:String,
            default:'#f1f1f1'
        },
        navprevious_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        navnext_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        monthyear_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        monthyear_header_visible:{
            required:false,
            type:Boolean,
            default: true
        },
        daynumber_position:{
            required:false,
            type:String,
            default:'right'
        },
        selection:{
            required:false,
            type:String,
            default:'range'
        },
        selected_cell_bg:{
            required:false,
            type:String,
            default: '#1e90ff'
        },
        selected_cell_fg:{
            required:false,
            type:String,
            default:'#ffffff'
        },
        hover_cell_bg:{
            required:false,
            type:String,
            default:'#f1f1f1'
        },
        hover_cell_fg:{
            required:false,
            type:String,
            default:''
        },
        dayNameCellAlign:{
            required:false,
            type:String,
            default:function(){
                return 'center';
            }
        },
        dayNameCellBorderColor:{
            required:false,
            type:String,
            default:function(){
                return 'transparent';
            }
        },
        dayCellBorderColor:{
            required:false,
            type:String,
            default:function(){
                return '#afafaf'
            }
        },
        dataContainer:{
            required:false,
            type:Array,
            default:function(){
                return [];
            }
        },
        monthNames:{
            required:false,
            type:Array,
            default:function(){
                return ["January","February","March","April","May","June","July","August","September","October","November","December"]
            }
        },
        monthShortNames:{
            required:false,
            type:Array,
            default:function(){
                return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            }
        },
        dayNames:{
            required:false,
            type:Array,
            default:function(){
                return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
            }
        },
        dayShortNames:{
            required:false,
            type:Array,
            default:function(){
               return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
            }
        },
        month:{
            required:true,
            type:Number,
            default:function(){
                var d = new Date();
                return d.getMonth();
            }
        },
        year:{
            required:true,
            type:Number,
            default:function(){
                var d = new Date();
                return d.getFullYear();
            }
        }
    },
    data:function(){
        return {
            cell_day_first_selected: -1,
            cell_day_last_selected: -1
        };
    },
    watch:{
        dataContainer:function(){
            
        },
        year:function(){
            
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        },
        month:function(){
            
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        }
    },
    computed:{
        totalDaysOfMonth:function(){
            return new Date(this.year, this.month+1, 0).getDate()
        },
        days_selected:function(){
            var selected_ar = [];
            var month_days = this.totalDaysOfMonth;
            for(var i=0;i<month_days;i++){
                var counter = i+1;
                var selected = 0;
                if(this.cell_day_last_selected>-1){
                    if(counter>=this.cell_day_first_selected && counter<=this.cell_day_last_selected){
                        selected_ar.push(selected);
                    }
                }else{
                    if(counter==this.cell_day_first_selected){
                        selected = 1;
                    }
                }
                selected_ar.push(selected);
            }
            
            return selected_ar;
        },
        days:function(){
            //fix the array here 
            //get the first day of the month what day it is
            var day = new Date(this.year, this.month, 1).getDay();
            
            var diff = day - 0;
            var days_ar = [];
            for(var ii=0;ii<diff;ii++){
                days_ar.push(0);
            }
            var month_days = this.totalDaysOfMonth;
            for(var i=0;i<month_days;i++){
                days_ar.push(i+1);
            }
            var last_day = new Date(this.year, this.month, month_days).getDay();
            
            var last_diff = 6 - last_day;
            for(var iii=0;iii<last_diff;iii++){
                days_ar.push(0);
            }
            return days_ar;
        }                    
    },
    
    methods:{
        previous_month:function(){

        },
        next_month:function(){

        },
        cell_hover:function(event){
            var t = event.currentTarget;
            if(parseInt(t.getAttribute('data-selected'))==0){
                t.style.backgroundColor = this.hover_cell_bg;
                t.style.color = this.hover_cell_fg;
            }
        },
        cell_leave:function(event){
            var t = event.currentTarget;
            if(parseInt(t.getAttribute('data-selected'))==0){
                t.style.backgroundColor = '';//this.hover_cell_bg;
                t.style.color = '';//this.hover_cell_fg;
            }
        },
        day_exists:function(day){
            if(typeof this.dataContainer[day]!=='undefined'){
                return true;
            }
            return false;
        },
        isSelected:function(day){
            if(day>0){
                if(this.cell_day_last_selected>-1){
                    if(day>=this.cell_day_first_selected && day<=this.cell_day_last_selected){
                        return true;
                    }
                }else{
                    if(day==this.cell_day_first_selected){
                        return true;
                    }
                }
            }
            return false;
        },
        cell_clicked:function(event){
            if(this.selection=='none'){
                return;
            }
            var t = event.currentTarget;
            var day = parseInt(t.getAttribute('data-day'));
            if(day>0){
                

                if((event.ctrlKey || event.metaKey) && day==this.cell_day_first_selected ){
                    this.cell_day_first_selected = -1;
                    this.cell_day_last_selected = -1;
                    return;
                }
                //if we have already selected the last date, then reset and start from the beginning
                if(this.cell_day_last_selected > -1){
                    //reset
                    this.cell_day_first_selected = -1;
                    this.cell_day_last_selected = -1;
                 
                }

                //if we have already selected one time then we move to the last date
                if(this.cell_day_first_selected > -1 && this.selection=='range'){
                    //but if the day is less than first day selected do not make range, select again first day selected
                    if(day<this.cell_day_first_selected){
                        
                        this.cell_day_first_selected = day;
                    }else{
                        
                        this.cell_day_last_selected = day;
                    }
                }else{
                    
                    this.cell_day_first_selected = day;
                }
                console.log(this.cell_day_first_selected, this.cell_day_last_selected)
                this.$emit('day-clicked',{
                    month: this.month,//zero based
                    year: this.year,
                    day: day
                })
                if(this.cell_day_first_selected>-1 && this.cell_day_last_selected>-1 && this.selection=='range'){
                    this.$emit('range-selected',{
                        month: this.month,
                        year: this.year,
                        from: this.cell_day_first_selected,
                        to: this.cell_day_last_selected
                    })
                }
            }
        },
        clearSelection:function(){
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        },
        getDaysOfPreviousMonth:function(){
            return new Date(this.year, this.month-1,0).getDate();
        }
    },
    mounted:function(){
        this.$emit('mounted')
    },
    created:function(){
        this.$emit('created')
    }
}
</script>
<style scoped>
.display-table{
        border: 1px solid #afafaf;
    border-width: 1px 0px 0px 1px;
}
.display-table-cell{
    border: 1px solid #afafaf;
    border-width: 0px 1px 1px 0px;
    padding: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
</style>