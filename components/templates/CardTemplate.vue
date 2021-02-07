<template>
    <div>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-subtitle>{{ release_date }}</v-card-subtitle>
        <v-card-text>{{ overview.substr( 0, 50 ) }}...</v-card-text>
    </div>
</template>

<script>
export default {
    props: ['title', 'release_date', 'overview'],

}
</script>