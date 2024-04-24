<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import router from '../../../router';
import { baseURL } from '@/service/ApiConstant';

const toast = useToast();
const email = ref('');
const password = ref('');
const checked = ref(false);
const submitted = ref(false);
const errorMessage = ref('');

const loginUser = () => {
    submitted.value = true;
    axios
        .post(`${baseURL}/login`, {
            email: email.value.toLowerCase(),
            password: password.value
        })
        .then((response) => {
            // console.log(response.data.access_token);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.add({ severity: 'success', summary: 'Successo', detail: 'Message Detail', life: 3000 });
            router.push({ path: '/dashboard' });
        })
        .catch((error) => {
            errorMessage.value = error.response.data.message;
            toast.add({ severity: 'error', summary: `${error.response.data.message}`, detail: 'Message Detail', life: 3000 });
        })
        .finally(() => {
            submitted.value = false;
        });
};

onBeforeMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // User is authenticated, proceed to the route
        router.replace('/dashboard');
    }
});
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <router-link to="/">
                            <img src="/demo/sys/logo.jpg" alt="Image" height="120" class="mb-3" />
                        </router-link>
                        <div class="text-900 text-3xl font-medium mb-3">Bem vindo de volta</div>
                        <span class="text-600 font-medium">Faça login para continuar</span>
                        <div v-if="errorMessage">
                            <Button :label="errorMessage" class="mr-2" severity="danger" />
                        </div>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Endereço Email" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" :feedback="false"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Lembrar de mim</label>
                            </div>
                            <!-- <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Esqueceu a password?</a> -->
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="loginUser" v-if="!submitted"></Button>
                        <div class="text-center mb-5" v-if="submitted">
                            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <AppConfig simple /> -->
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
