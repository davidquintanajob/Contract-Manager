<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  url: { type: String, default: '' },
  canonical: { type: String, default: '' },
  jsonld: { type: String, default: '' },
  twitterCard: { type: String, default: 'summary_large_image' }
});

const siteUrl = useRuntimeConfig().public.siteUrl || 'http://localhost:3000';

useHead({
  title: props.title || 'Contract Manager',
  meta: [
    props.description ? { name: 'description', content: props.description } : null,
    props.image ? { property: 'og:image', content: (props.image.startsWith('http') ? props.image : siteUrl + props.image) } : null,
    props.url ? { property: 'og:url', content: props.url } : null,
    props.title ? { property: 'og:title', content: props.title } : null,
    props.description ? { property: 'og:description', content: props.description } : null,
    props.twitterCard ? { name: 'twitter:card', content: props.twitterCard } : null
  ].filter(Boolean),
  link: props.canonical ? [{ rel: 'canonical', href: props.canonical }] : [] ,
  script: props.jsonld ? [{ type: 'application/ld+json', children: props.jsonld }] : []
});
</script>

<template>
  <!-- Component purely for managing head; no visual output -->
  <div style="display:none" aria-hidden="true"></div>
</template>

<style scoped>
/* No styles needed */
</style>
