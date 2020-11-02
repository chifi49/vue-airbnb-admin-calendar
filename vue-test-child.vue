<template>
    <div>
        <slot name="header"></slot>
    </div>
</template>
<script>
export default{
    name:'vue-test-child',
    data:function(){
        return {
            msg:'hi there'
        }
    }
}
</script>