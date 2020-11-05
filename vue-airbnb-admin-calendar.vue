<template>
    <div class="vaac-calendar"  style="position:relative;">
        <div class="vaac-month-year-header" style="display:flex" v-show="monthyear_header_visible" :style="{'border-style':'solid',borderColor:monthyear_header_border_color, backgroundColor:monthyear_header_background_color, 'padding':monthyear_header_padding+'px','border-width':'1px 1px 0px 1px'}">
            <div 
            v-if="nav_year_visible" 
            tabindex="1" 
            @keyup.enter="previous_year" 
            @click="previous_year" 
            :class="{'nav-disabled':!can_nav_previous_year,'vaac-previousyear':true}" 
            :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer','color':monthyear_header_color}">
                <slot name="previous_year"><span style="transform:rotate(180deg);display:inline-block;">&#9656;&#9656;</span></slot>
            </div>

            <div 
            tabindex="2" 
            v-show="nav_month_visible" 
            @keyup.enter="previous_month" 
            @click="previous_month" 
            :class="{'nav-disabled':!can_nav_previous_month,'vaac-previousmonth':true}" 
            :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer','color':monthyear_header_color}">
                <slot name="previous_month">&#9664;</slot>
            </div>

            <div class="" :style="{'visibility':monthyear_visible?'visible':'hidden','display':'inline-block','box-sizing':'border-box','width':month_year_width,'text-align':'center','color':monthyear_header_color}">
                <template v-if="month_dropdown" >
                    <select tabindex="3" v-on:change="monthDropdown_changed" class="vaac-month-dropdown">
                        <option :value="option.index" v-for="option in monthDropdown" v-bind:key="option.key" :selected="option.selected">
                            {{option.name}}
                        </option>
                    </select>
                </template>
                <template v-if="!month_dropdown">{{month_names[month_selected]}}</template>
                 / 
                 <template v-if="year_dropdown">
                     <select tabindex="4" v-on:change="yearDropdown_changed" class="vaac-year-dropdown">
                         <option :value="option.index" v-for="option in yearDropdown" v-bind:key="option.key" :selected="option.selected">
                             {{option.name}}
                            </option>
                        </select>
                </template>
                <template v-if="!year_dropdown">{{year_selected}}</template>
            </div>
            <div tabindex="5" 
            :class="{'nav-disabled':!can_nav_next_month,'vaac-nextmonth':true}" 
            @keyup.enter="next_month" @click="next_month" v-show="nav_month_visible" :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer','color':monthyear_header_color}">
                <slot name="next_month">&#9654;</slot>
            </div>
            <div tabindex="6" 
            :class="{'nav-disabled':!can_nav_next_year,'vaac-nextyear':true}" 
            @keyup.enter="next_year" @click="next_year" v-show="nav_year_visible" :style="{'display':'inline-block','box-sizing':'border-box','width':'10%','text-align':'center','cursor':'pointer','color':monthyear_header_color}">
                <slot name="next_year">&#9656;&#9656;</slot>
            </div>
        </div>
        <div class="vaac-dayname-header" :style="{borderStyle:'solid',borderWidth:'0px 0px 0px 1px',borderColor:day_name_cell_border_color}">
            <div v-for="(dayname,index) in day_short_names" 
            v-bind:key="'dayname-'+index" 
            :style="{'display':'inline-block','width':'14.28%','text-align':day_name_cell_align,'border-style':'solid','border-width':'1px 1px 0px 0px','border-color':day_name_cell_border_color,'box-sizing':'border-box','padding':day_name_cell_padding+'px', backgroundColor: day_name_background_color, color: day_name_color}"
            :class="{'vaac-dayname':true}">
                {{dayname}}
            </div>
        </div>
        <div class=" days display-table vaac-daynumber-container" 
        :style="{'display':'flex','flex-wrap':'wrap','border-style':'solid','border-color':day_number_cell_border_color,'border-width':'1px 0px 0px 1px'}" 
        v-bind:key="'daynumber-container-'+days_view_counter">
        <!-- to daynumber-container-'+days_view_counter we need when we need to re render the calendar because we have loaded data and the only way for callback renderTemplate to be called again is to update the v-bind:key -->

            <template v-if="show_other_month_days">

                <div v-for="(day,index) in previous_days"
                v-bind:key="'previousdaynumber-'+index" 
                :tabindex="tab_index+1"
                :data-selected="isSelected(day, previousMonth, previousYear)?1:0" 
                @click="cell_clicked($event,day,previousMonth,previousYear)"
                
                :style="{'background-color':isSelected(day,previousMonth,previousYear)?selected_cell_bg:'','color':isSelected(day,previousMonth,previousYear)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block','border-style':'solid','border-width':'0px 1px 1px 0px','border-color':day_number_cell_border_color, 'padding':day_number_cell_padding+'px'}" 
                :class="{'vaac-daynumber-cell':true,'vaac-daynumber-previous-cell':true}" 
                :data-day="day" :data-month="previousMonth" :data-year="previousYear"
                >
                    <span v-if="day_number_visible" class="daynumber" :style="{'text-align':day_number_position,'width':'100%','position':'relative','display':'inline-block'}">
                        <span :style="{backgroundColor:is_today(day,previousMonth,previousYear)?today_number_background_color:other_month_day_background_color,color:is_today(day,previousMonth,previousYear)?today_number_color:other_month_day_color,padding:day_number_padding,'border-radius':day_number_radius,'font-size':day_number_font_size,'display':'inline-block','width':day_number_size,'height':day_number_size,'text-align':'center','vertical-align':'middle','line-height':day_number_size}">{{day}}</span>
                    </span>
                    <div v-html="render_template({current_day: day, current_month: previousMonth, current_year: previousYear, selected_month: month_selected, selected_year:year_selected, selected: isSelected(day,previousMonth,previousYear)})"></div>
                </div>
            </template>

            <div 
            
            v-for="(day,index) in days" 
            v-bind:key="'dayday'+index" 
            :data-selected="isSelected(day, month_selected, year_selected)?1:0" 
            @mouseover="cell_hover($event,day, month_selected, year_selected)" 
            @mouseleave="cell_leave($event,day, month_selected, year_selected)"
            @click="cell_clicked($event,day, month_selected, year_selected)"

            :tabindex="tab_index+1"

            @keyup.enter="cell_clicked($event,day, month_selected, year_selected)"

            :style="{'background-color':isSelected(day,month_selected,year_selected)?selected_cell_bg:'','color':isSelected(day,month_selected,year_selected)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block','border-style':'solid','border-width':'0px 1px 1px 0px','border-color':day_number_cell_border_color,'padding':day_number_cell_padding+'px'}" 
            :class="{'vaac-daynumber-cell':true,'vaac-daynumber-current-cell':true}" 
            
             :data-day="day" :data-month="month_selected" :data-year="year_selected">

                <template v-if="day>0?true:false">
                    <span 
                    v-if="day_number_visible" 
                    class="daynumber" :style="{'text-align':day_number_position,'width':'100%','position':'relative','display':'inline-block'}">
                        <span :style="{backgroundColor:is_today(day,month_selected,year_selected)?today_number_background_color:day_number_background_color,color:is_today(day,month_selected,year_selected)?today_number_color:day_number_color,padding:day_number_padding,'border-radius':day_number_radius,'font-size':day_number_font_size,'display':'inline-block','width':day_number_size,'height':day_number_size,'text-align':'center','vertical-align':'middle','line-height':day_number_size}">{{day}}</span>
                    </span>
                    
                        <div v-html="render_template({current_day: day, current_month: month_selected, current_year: year_selected, selected_month: month_selected, selected_year:year_selected, selected: isSelected(day,month_selected,year_selected)})"></div>
                        
                </template>
                <template v-if="day==0?true:false">
                        <span v-if="day_number_visible" :style="{'text-align':day_number_position,'width':'100%','position':'relative','display':'inline-block','visibility':'hidden'}">
                            <span>{{day}}</span>
                        </span>
                </template>
            </div>

            <template v-if="show_other_month_days">
                <div v-for="(day,index) in next_days"
                v-bind:key="'nextday'+index"
                :data-selected="isSelected(day, nextMonth, nextYear)?1:0" 
                :tabindex="tab_index+1"

                @click="cell_clicked($event,day,nextMonth,nextYear)"

                :style="{'background-color':isSelected(day,nextMonth,nextYear)?selected_cell_bg:'','color':isSelected(day,nextMonth,nextYear)?selected_cell_fg:'', 'width':'14.28%','display':'inline-block','border-style':'solid','border-width':'0px 1px 1px 0px','border-color':day_number_cell_border_color,'padding':day_number_cell_padding+'px'}" 
            :class="{'vaac-daynumber-cell':true,'vaac-daynumber-next-cell':true}" 

                :data-day="day" :data-month="nextMonth" :data-year="nextYear"
                >
                    <span 
                    v-if="day_number_visible"
                    class="daynumber" :style="{'text-align':day_number_position,'width':'100%','position':'relative','display':'inline-block'}">
                        <span :style="{backgroundColor:is_today(day,nextMonth,nextYear)?today_number_background_color:other_month_day_background_color,color:is_today(day,nextMonth,nextYear)?today_number_color:other_month_day_color,padding:day_number_padding,'border-radius':day_number_radius,'font-size':day_number_font_size,'display':'inline-block','width':day_number_size,'height':day_number_size,'text-align':'center','vertical-align':'middle','line-height':day_number_size}">{{day}}</span>
                    </span>
                    <div v-html="render_template({current_day: day, current_month: nextMonth, current_year: nextYear, selected_month: month_selected, selected_year:year_selected, selected: isSelected(day,nextMonth,nextYear)})"></div>
                </div>
            </template>
        </div>
        <div  v-show="loading" style="position:absolute;top:0px;left:0px;width:100%;bottom:0px;vertical-align:middle;text-align:center;background-color:rgb(255,255,255,0.5);">
            <div style="position:relative;top:45%;margin:0 auto;font-size:32px;">
                
                <div slot="loader" ref="spinner" style="display:inline-block;"><slot name="loader">&#8635;</slot></div>
                
            </div>
        </div>
    </div>
</template>
<script>

export default{
    name:'vue-airbnb-admin-calendar',
    props:{
        render_template:{
            required:false,
            type:Function,
            default:function(){
                return '';
            }
        },
        min_date:{
            required:false,
            type:Date,
            default:function(){
                var d = new Date();
                d.setFullYear(d.getFullYear()-75,d.getMonth(),1)
                return d;
            }
        },
        max_date:{
            required:false,
            type:Date,
            default:function(){
                var d = new Date();
                d.setFullYear(d.getFullYear()+75,d.getMonth(),1)
                return d;
            }
        },
        show_other_month_days:{
            required:false,
            type:Boolean,
            default:false
        },
        loading_spin:{
            required:false,
            type:Boolean,
            default:true
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
        nav_year_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        
        nav_month_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        
        monthyear_header_background_color:{
            required:false,
            type:String,
            default:'#fff'
        },
        monthyear_header_color:{
            required:false,
            type:String,
            default:'#000'
        },
        monthyear_header_border_color:{
            required:false,
            type:String,
            default:'#afafaf'
        },
        monthyear_header_padding:{
            required:false,
            type:Number,
            default:5
        },
        monthyear_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        month_dropdown:{
            required:false,
            type:Boolean,
            default:true
        },
        year_dropdown:{
            required:false,
            type:Boolean,
            default:true
        },
        monthyear_header_visible:{
            required:false,
            type:Boolean,
            default: true
        },
        day_number_position:{
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
        day_name_background_color:{
            required:false,
            type:String,
            default:'#fff'
        },
        day_name_color:{
            required:false,
            type:String,
            default:'#000'
        },
        day_name_cell_align:{
            required:false,
            type:String,
            default:function(){
                return 'center';
            }
        },
        day_name_cell_border_color:{
            required:false,
            type:String,
            default:'#afafaf'
        },
        day_name_cell_padding:{
            required:false,
            type:Number,
            default:3
        },

        day_number_visible:{
            required:false,
            type:Boolean,
            default:true
        },
        day_number_cell_padding:{
            required:false,
            type:Number,
            default:5
        },
        day_number_cell_border_color:{
            required:false,
            type:String,
            default:'#afafaf'
        },
        other_month_day_background_color:{
            required:false,
            type:String,
            default:'#efefef'
        },
        other_month_day_color:{
            required:false,
            type:String,
            default:'#000'
        },
        today_number_background_color:{
            required:false,
            type:String,
            default:'#888'
        },
        today_number_color:{
            required:false,
            type:String,
            default:'#fff'
        },
        day_number_background_color:{
            required:false,
            type:String,
            default:'#000'
        },
        day_number_color:{
            required:false,
            type:String,
            default:'#fff'
        },
        day_number_radius:{
            required:false,
            type:String,
            default:'50%'
        },
        day_number_padding:{
            required:false,
            type:String,
            default:'5px 5px'
        },
        day_number_width:{
            required:false,
            type:String,
            default:'auto'
        },
        day_number_height:{
            required:false,
            type:String,
            default:'auto'
        },
        day_number_size:{
            required:false,
            type:String,
            default:'18px'
        },
        day_number_font_size:{
            required:false,
            type:String,
            default:'12px'
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
        month_names:{
            required:false,
            type:Array,
            default:function(){
                return ["January","February","March","April","May","June","July","August","September","October","November","December"]
            }
        },
        month_short_names:{
            required:false,
            type:Array,
            default:function(){
                return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            }
        },
        day_names:{
            required:false,
            type:Array,
            default:function(){
                return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
            }
        },
        day_short_names:{
            required:false,
            type:Array,
            default:function(){
               return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
            }
        },
        month:{
            required:false,
            type:Number,
            default:function(){
                var d = new Date();
                return d.getMonth();
            }
        },
        year:{
            required:false,
            type:Number,
            default:function(){
                var d = new Date();
                return d.getFullYear();
            }
        }
    },
    data:function(){
        return {
            days_view_counter:0,
            cell_day_first_selected: -1,
            cell_day_last_selected: -1,
            //the month is enought (we do not need year)
            cell_day_first_selected_month:-1,
            cell_day_last_selected_month:-1,
            cell_day_first_selected_year:-1,
            cell_day_last_selected_year:-1,

            loading_interval:0,
            month_selected: this.month,
            year_selected: this.year,
            tab_index:6
        };
    },
    watch:{
        dataContainer:function(){
            
        },
        year_selected:function(){
            
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        },
        month_selected:function(){
            
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
        },
        loading:function(newval){
            if(newval){
                //start spinning
                this.start_loader();
                //this.$emit('start_loader',{})
            }else{
                this.stop_loader();
                //this.$emit('',{})
            }
            //console.log(newval,oldval);
        }
    },
    computed:{
        /**
        showOtherMonthDays:function(){
            return this.show_other_month_days;
        },
        **/
        month_year_width:function(){
            var total = 0;
            if(this.nav_year_visible){total+=20;}
            if(this.nav_month_visible){total+=20;}
            
            return 100-total+'%';
        },
        yearDropdown: function(){
            var options = [];
            var currentYear = (new Date()).getFullYear();
            var start = currentYear - 100;
            var end = currentYear+50;
            for(var i=start;i<=end;i++){
                options.push({
                    key:'yeardropdown-name-'+i,
                    name: i,
                    index: i,
                    selected: i==this.year_selected?true:false
                })
            }
            return options;
        },
        monthDropdown:function(){
            var options = [];
            for(var i=0;i<=11;i++){
                options.push({
                    key: 'monthdropdown-name-'+i,
                    name: this.month_names[i],
                    index: i,
                    selected: i==this.month_selected?true:false
                })
            }
            return options;
        },
        totalDaysOfMonth:function(){
            return new Date(this.year_selected, this.month_selected+1, 0).getDate()
        },
        totalDaysOfPreviousMonth:function(){
            return new Date(this.year_selected, this.month_selected, 0).getDate();
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
        //the previous month days (if 1st day of current month does not start on sunday)
        previousMonth:function(){
            var now = new Date(this.year_selected,this.month_selected-1,1);
            return now.getMonth();
        },
        //the year of the previous month (because if current month is january than previous month december has another year)
        previousYear:function(){
            var now = new Date(this.year_selected,this.month_selected-1,1);
            return now.getFullYear();
        },
        previous_days:function(){
            var day = new Date(this.year_selected, this.month_selected, 1).getDay();
            var previousLastDay = this.totalDaysOfPreviousMonth;
            
            var diff = day - 0;
            var days_ar = [];
            //for(var ii=0;ii<diff;ii++){
            for(var ii=diff-1;ii>=0;ii--){
                days_ar.push(previousLastDay-ii);
            }
            return days_ar;
        },
        days:function(){
            //fix the array here 
            //get the first day of the month what day it is
            var day = new Date(this.year_selected, this.month_selected, 1).getDay();
            
            var diff = day - 0;
            var days_ar = [];
            if(!this.show_other_month_days){
                for(var ii=0;ii<diff;ii++){
                    days_ar.push(0);
                }
            }
            var month_days = this.totalDaysOfMonth;
            for(var i=0;i<month_days;i++){
                days_ar.push(i+1);
            }
            var last_day = new Date(this.year_selected, this.month_selected, month_days).getDay();
            
            if(!this.show_other_month_days){
                var last_diff = 6 - last_day;
                for(var iii=0;iii<last_diff;iii++){
                    days_ar.push(0);
                }
            }
            return days_ar;
        },
        next_days:function(){
            var month_days = this.totalDaysOfMonth;
            var last_day = new Date(this.year_selected, this.month_selected, month_days).getDay();
            
            var days_ar = [];
            var last_diff = 6 - last_day;
            for(var iii=0;iii<last_diff;iii++){
                days_ar.push(iii+1);
            }
            return days_ar;
        },
        nextMonth:function(){
            var now = new Date(this.year_selected,this.month_selected+1,1);
            return now.getMonth();
        },
        //the year of the month (because if the current month is december, than the january as next month will have another year)
        nextYear:function(){
            var now = new Date(this.year_selected,this.month_selected+1,1);
            return now.getFullYear();
        },
        
        can_nav_previous_month:function(){
            var minDate = this.min_date;
            minDate.setHours(0);minDate.setMinutes(0);minDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected,this.month_selected-1,1);
            //console.log(minDate, current);
            return current.getTime()>=minDate.getTime();
        },
        can_nav_previous_year:function(){
            var minDate = this.min_date;
            minDate.setHours(0);minDate.setMinutes(0);minDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected-1,this.month_selected,1);
            return current.getTime()>=minDate.getTime();
        },
        can_nav_next_month:function(){
            var maxDate = this.max_date;
            maxDate.setHours(0);maxDate.setMinutes(0);maxDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected,this.month_selected+1,1);
            return current.getTime()>=maxDate.getTime();
        },
        can_nav_next_year:function(){
            var maxDate = this.max_date;
            maxDate.setHours(0);maxDate.setMinutes(0);maxDate.setSeconds(0);
            var current = new Date();
            current.setFullYear(this.year_selected+1,this.month_selected,1);
            return current.getTime()>=maxDate.getTime();
        }
    },
    
    methods:{
        update_view:function(){
            this.days_view_counter++;
            this.$emit('view_updated',{name:'view_updated'});
        },
        start_loader:function(){
            if(!this.loading_spin){
                return;
            }
            var radius = 0;
            if(this.$refs['spinner']!=null){
                this.loading_interval = setInterval(()=>{
                    this.$refs['spinner'].style.transform = 'rotate('+radius+'deg)';
                    radius+=10;
                    if(radius>360){
                        radius= 0;
                    }
                },24)
                this.$emit('loader_started',{source:'start_loader'})
            }

        },
        stop_loader:function(){
            if(this.$refs['spinner']!=null){
                clearInterval(this.loading_interval);
                this.$refs['spinner'].style.transform = 'rotate(0deg)'
                this.$emit('loader_ended',{source:'stop_loader'});
            }
        },
        
        get_previous_month:function(){
            var date= new Date();
            date.setFullYear(this.year_selected, this.month_selected, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()-1,1);
            return {
                month: date.getMonth(),
                year: date.getFullYear()
            }
        },
        
        get_next_month:function(){
            var date= new Date();
            date.setFullYear(this.year_selected, this.month_selected, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()+1,1);
            return {
                month: date.getMonth(),
                year: date.getFullYear()
            }
        },
        
        get_month:function(){
            return this.month_selected;
        },
        set_month:function(month){
            if(month>=0 && month<=11){
                var pmonth = this.month_selected;
                this.month_selected = month;
                this.$emit('month_changed',{month:this.month_selected,pmonth: pmonth, year: this.year_selected, source:'set_month'});
                this.$emit('date_changed',{month:this.month_selected, pmonth: pmonth , year:this.year_selected, source:'set_month'});
            }
        },
        monthDropdown_changed:function(){
            var pmonth = this.month_selected;
            this.month_selected = event.currentTarget.value;
            this.$emit('month_changed',{month:this.month_selected,pmonth:pmonth, year: this.year_selected, source:'month_dropdown'})
            
            this.$emit('date_changed',{month:this.month_selected,year:this.year_selected,pmonth:pmonth,pyear:this.year_selected,source:'month_dropdown'})
        },
        get_year:function(){
            return this.year_selected;
        },
        set_year:function(year){
            var pyear = this.year_selected;
            this.year_selected = year;
            this.$emit('year_changed',{year:this.year_selected, pyear: pyear, month: this.month_selected,source:'set_year'});
            this.$emit('date_changed',{month:this.month_selected, pyear: pyear ,year:this.year_selected, source:'set_year'})
        },
        yearDropdown_changed:function(){
            var pyear = this.year_selected;
            this.year_selected = event.currentTarget.value;
            this.$emit('year_changed',{year:this.year_selected,pyear:pyear, month: this.month_selected, source:'year_dropdown'})
            
            this.$emit('date_changed',{year:this.year_selected,month:this.month_selected, pyear: pyear, pmonth: this.month_selected, source:'year_dropdown'});
        },
        previous_year:function(){
            var can_nav = this.can_nav_previous_year;
            if(!can_nav){
                alert('reached minimum date');
                return;
            }

            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear()-1,date.getMonth(),1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('previous_year',{ month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear, source:'previous_year'})
            this.$emit('date_changed',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear, source:'previous_year'})
        },
        previous_month:function(){
            var can_nav = this.can_nav_previous_month;
            if(!can_nav){
                alert('reached minimum date');
                return;
            }
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()-1,1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('previous_month',{ month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear, source:'previous_month'})
            this.$emit('date_changed',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear, source:'previous_month'})
        },
        next_month:function(){
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear(),date.getMonth()+1,1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('next_month',{ month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear, source:'next_month'});
            this.$emit('date_changed',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear, source:'next_month'});
            
        },
        next_year:function(){
            var cmonth = this.month_selected;
            var cyear = this.year_selected;
            var date= new Date();
            date.setFullYear(cyear, cmonth, 1);
            date.setFullYear(date.getFullYear()+1,date.getMonth(),1);
            this.month_selected = date.getMonth();
            this.year_selected = date.getFullYear();
            this.$emit('nextYear',{ month: this.month_selected, year: this.year_selected, pmonth: cmonth, pyear: cyear, source:'next_year'})
            this.$emit('dateChanged',{month:this.month_selected,year:this.year_selected,pmonth:cmonth,pyear:cyear, source:'next_year'})
        },
        cell_hover:function(event,day){
            if(day==0){
                return;
            }
            var t = event.currentTarget;
            if(parseInt(t.getAttribute('data-selected'))==0){
                t.style.backgroundColor = this.hover_cell_bg;
                t.style.color = this.hover_cell_fg;
            }
        },
        cell_leave:function(event,day){
            if(day==0){
                return;
            }
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
        is_today:function(day,month,year){
            var today = this.get_today();
            return day==today.date && month==today.month && year==today.year?true:false;
        },
        get_today:function(){
            var d = new Date();
            return {
                date: d.getDate(),
                month: d.getMonth(),
                year: d.getFullYear()
            };
        },
        isSelected:function(day,month,year){
            if(day>0){
                if(this.cell_day_last_selected>-1){
                    /**
                    if(day>=this.cell_day_first_selected && day<=this.cell_day_last_selected 
                    //&& month==this.month_selected && year==this.year_selected
                    && month==this.cell_day_first_selected_month && year==this.cell_day_first_selected_year
                    ){
                        return true;
                    }
                    **/
                   var firstday = this.cell_day_first_selected<10?'0'+this.cell_day_first_selected:this.cell_day_first_selected;
                   var firstmonth = this.cell_day_first_selected_month<10?'0'+this.cell_day_first_selected_month:this.cell_day_first_selected_month;

                   var firstselection = parseInt( this.cell_day_first_selected_year+''+firstmonth+''+firstday );

                   var lastday = this.cell_day_last_selected<10?'0'+this.cell_day_last_selected:this.cell_day_last_selected;
                   var lastmonth = this.cell_day_last_selected_month<10?'0'+this.cell_day_last_selected_month:this.cell_day_last_selected_month;

                   var lastselection = parseInt( this.cell_day_last_selected_year+''+lastmonth+''+lastday );
                
                    var current_selection = parseInt( year+''+(month<10?'0'+month:month)+''+(day<10?'0'+day:day) );
                    if(current_selection>=firstselection && current_selection<=lastselection){
                        //console.log(current_selection, firstselection, lastselection);
                        return true;
                    }
                }else{
                    if(day==this.cell_day_first_selected 
                    //&& month==this.month_selected && year==this.year_selected
                    && month==this.cell_day_first_selected_month && year==this.cell_day_first_selected_year
                    ){
                        return true;
                    }
                }
            }
            return false;
        },
        cell_clicked:function(event,dayindex,month,year){
            //console.log(dayindex,month,year);
            if(month>100 && year<0){
                return;
            }
            if(dayindex==0){
                return;
            }
            if(this.selection=='none'){
                return;
            }
            var t = event.currentTarget;
            var day = parseInt(t.getAttribute('data-day'));
            var mm = parseInt(t.getAttribute('data-month'));
            var yy = parseInt(t.getAttribute('data-year'));
            console.log(day, mm, yy);
            
            if(day>0){
                

                if((event.ctrlKey || event.metaKey) && day==this.cell_day_first_selected && mm==this.cell_day_first_selected_month ){
                    this.cell_day_first_selected = -1;
                    this.cell_day_last_selected = -1;

                    //new
                    this.cell_day_first_selected_month = -1;
                    this.cell_day_last_selected_month = -1;
                    this.cell_day_first_selected_year = -1;
                    this.cell_day_last_selected_year = -1;

                    console.log('return from cell_clicked');
                    return;
                }
                //if we have already selected the last date, then reset and start from the beginning
                if(this.cell_day_last_selected > -1){
                    //reset
                    this.cell_day_first_selected = -1;
                    this.cell_day_last_selected = -1;
                    
                    //new
                    this.cell_day_first_selected_month = -1;
                    this.cell_day_last_selected_month = -1;
                    this.cell_day_first_selected_year = -1;
                    this.cell_day_last_selected_year = -1;
                }

                //if we have already selected one time then we move to the last date
                if(this.cell_day_first_selected > -1 && this.selection=='range'){
                    //but if the day is less than first day selected do not make range, select again first day selected
                    //or if the month is less then the first selected then we go back
                    if((day<this.cell_day_first_selected && mm==this.cell_day_first_selected_month)  || ( mm<this.cell_day_first_selected_month && yy==this.cell_day_first_selected_year) || yy<this.cell_day_first_selected_year){
                        
                        this.cell_day_first_selected = day;

                        //new
                        this.cell_day_first_selected_month = mm;
                        this.cell_day_first_selected_year = yy;
                    }else{
                        
                        this.cell_day_last_selected = day;

                        //new
                        this.cell_day_last_selected_month = mm;
                        this.cell_day_last_selected_year = yy;
                    }
                }else{
                    
                    this.cell_day_first_selected = day;
                    this.cell_day_first_selected_month = mm;
                    this.cell_day_first_selected_year = yy;
                }
                //console.log(this.cell_day_first_selected, this.cell_day_last_selected)
                this.$emit('day_clicked',{
                    name:'day_clicked',
                    month: mm, //this.month,//zero based
                    year: yy, //this.year_selected,
                    day: day,
                    'source':'cell_clicked'
                })
                if(this.cell_day_first_selected>-1 && this.cell_day_last_selected>-1 && this.selection=='range'){
                    this.$emit('range_selected',{
                        name:'range_selected',
                        fmonth: this.cell_day_first_selected_month,//this.month_selected,
                        fyear: this.cell_day_first_selected_year,//this.year_selected,
                        fday: this.cell_day_first_selected,
                        tday: this.cell_day_last_selected,
                        tmonth: this.cell_day_last_selected_month,
                        tyear: this.cell_day_last_selected_year,
                        source:'cell_clicked'
                    })
                }
            }
        },
        clear_selection:function(){
            var first_selected = this.cell_day_first_selected;
            var last_selected = this.cell_day_last_selected;
            this.cell_day_first_selected = -1;
            this.cell_day_last_selected = -1;
            this.$emit('selection_reset',{from: first_selected, to: last_selected, month: this.month_selected, year: this.year_selected, source:'clear_selection'});
        },
        getDaysOfPreviousMonth:function(){
            return new Date(this.year_selected, this.month_selected-1,0).getDate();
        }
    },
    mounted:function(){
        this.$emit('mounted')
        /**
        this.$el.addEventListener('keyup',()=>{
            console.log(event.keyCode);
            console.log(event.srcElement);
        })
        **/
    },
    created:function(){
        this.$emit('created')
    }
}
</script>
<style scoped>

</style>