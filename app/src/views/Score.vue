<template>

    <div class="container-fluid">

        {{ props.totalScore }}

    </div>


</template>


<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";


const emits = defineEmits(["initHeader", "wsMsg"]);
const props = defineProps(["totalScore"]);

const router = useRouter();
const route = useRoute();
const sessionId = route.query.sessionId;


onMounted(() => {
    if (!(sessionId && sessionId.trim() !== "")) {
      route.push("/");
      return;
    }

    emits("initHeader", {
        pageTitle: "Scoreboard | SessionID : " + sessionId,
        breadcrumbs: [
            { label: "Home", url: "/" },
            { label: "Scoreboard", url: "" },
        ],
    });
});




</script>


<style scoped>
.container-fluid {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    background-color: #dcdcdc;
    color: black;
    font-family: Arial, sans-serif;
    flex-direction: column;
    font-size: 8.2rem;
}

</style>