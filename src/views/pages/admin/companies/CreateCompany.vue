<script setup>
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { baseURL } from '@/service/ApiConstant';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const isLoadingDiv = ref(true);
const provinces = ref([]);
const toast = useToast();

function goBackUsingBack() {
    if (router) {
        router.back();
    }
}

const getProvinces = () => {
    axios
        .get(`${baseURL}/provinces`)
        .then((response) => {
            provinces.value = response.data.province;
            isLoadingDiv.value = false;
        })
        .catch((error) => {
            isLoadingDiv.value = false;
            toast.add({ severity: 'error', summary: `${error}`, detail: 'Message Detail', life: 3000 });
            goBackUsingBack();
        });
};
onMounted(() => {
    getProvinces();
    console.log('Hello');
});
</script>
<template>
    <div className="card" v-if="!isLoadingDiv">
        <div class="col-12">
            <div class="card-w-title">
                <Button label="Voltar" class="mr-2 mb-2" @click="goBackUsingBack"></Button>
                <h5>Criar Empresa</h5>
            </div>

            <p>Os campos marcados * sao considerados campos obrigatorios.</p>
            <div class="col-12 md:col-12">
                <div class="card p-fluid">
                    <h5>Vertical</h5>
                    <div class="field">
                        <label for="name">Nome</label>
                        <InputText id="name" type="text" />
                    </div>
                    <div class="field">
                        <label for="address">Endereço</label>
                        <InputText id="address" type="text" />
                    </div>
                    <div class="field">
                        <label for="age1">Cidade</label>
                        <InputText id="age1" type="text" />
                    </div>
                    <div class="field">
                        <label for="province_id">Provincia</label>
                        <InputText id="province_id" type="text" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        <p>Por Favor Aguarde...</p>
    </div>
</template>
