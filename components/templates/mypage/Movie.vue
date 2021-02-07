<template>
    <div>
        <div class="pa-4" style="width: 100%;word-break: break-all">
            <h1>{{ title }}</h1>
            <h3><span v-for="(genre, i) in genres" :key="i">{{ genre.name }} </span></h3>
            <h3>{{release_date}}</h3>
            <h4>{{overview}}</h4>
            <a :href="homepage" target="_blank">{{ homepage }}</a>
        </div>
    </div>
</template>
<script>
export default {
    props: ['poster_path', 'title', 'genres', 'release_date', 'overview', 'homepage']
}
</script>