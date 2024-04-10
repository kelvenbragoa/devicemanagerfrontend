<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { baseURL } from '@/service/ApiConstant';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

const router = useRouter();
const isLoadingDiv = ref(true);
const retriviedData = ref({ data: [] });
const toast = useToast();
function goBackUsingBack() {
    if (router) {
        router.back();
    }
}

const getData = async () => {
    axios
        .get(`${baseURL}/notifications`)
        .then((response) => {
            retriviedData.value = response.data.notifications;
            isLoadingDiv.value = false;
        })
        .catch((error) => {
            isLoadingDiv.value = false;
            toast.add({ severity: 'error', summary: `${error}`, detail: 'Message Detail', life: 3000 });
            goBackUsingBack();
        });
};

onMounted(() => {
    getData();
});
</script>
<template>
    <div className="card" v-if="!isLoadingDiv">
        <h5>Notificações</h5>
        <p>Notificações do sistema.</p>
        <br />
        <div class="col-12 md:col-12" v-for="notification in retriviedData" :key="notification.id">
            <div class="card p-fluid md:justify-content-between">
                <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                    <span>
                        <i class="pi pi-bell"></i>
                        <strong>{{ notification.data.data }}</strong>
                    </span>
                    <span>
                        {{ moment(notification.created_at).format('H:mm DD-MM-YYYY') }}
                    </span>
                </div>

                <!-- <Button label="Secondary" severity="info" rounded class="mb-2 mr-2">  </Button> -->
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        <p>Por Favor Aguarde...</p>
    </div>
</template>
