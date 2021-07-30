<template>
    <main class="spu-container">
        <CategorySelector />
    </main>
</template>

<script>
import CategorySelector from '@/components/CategorySelector';

export default {
    name: 'Spu',
    components: {
        CategorySelector,
    },
};
</script>

<style lang="scss" scoped>
// .spu-container {
//     padding: 20px;
// }
</style>
