<script setup>
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { baseURL } from '@/service/ApiConstant';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

const router = useRouter();
const isLoadingDiv = ref(true);
const isLoadingButton = ref(false);
const roles = ref([]);
const toast = useToast();

function goBackUsingBack() {
    if (router) {
        router.back();
    }
}
const schema = yup.object({
    name: yup.string().required().trim().label('Name'),
    email: yup.string().required().trim().label('Email'),
    mobile: yup.string().required().trim().label('Telefone'),
    password: yup.string().required().trim().min(6).label('Password'),
    role_id: yup.string().required().trim().label('Nivel')
    // email: yup.string().required().email().label('Email email'),
    // fullName: yup.string().required().label('Full name'),
    // password: yup.string().required().min(6).label('Password'),
    // passwordConfirm: yup
    //     .string()
    //     .oneOf([yup.ref('password')], 'Passwords must match')
    //     .required()
    //     .label('Password confirmation'),
    // terms: yup.boolean().required().isTrue('You must agree to terms and conditions').label('terms agreement'),
    // type: yup.string().required().label('Account type')
});

const { defineField, handleSubmit, resetForm, errors, setErrors } = useForm({
    validationSchema: schema
});

const [name] = defineField('name');
const [email] = defineField('email');
const [mobile] = defineField('mobile');
const [role_id] = defineField('role_id');
const [password] = defineField('password');


const onSubmit = handleSubmit((values) => {
    isLoadingButton.value = true;
    axios
        .post(`${baseURL}/users`, values)
        .then((response) => {
            resetForm();
            router.push({ path: '/users' });
            toast.add({ severity: 'success', summary: `Successo`, detail: 'Registro criado com sucesso', life: 3000 });
        })
        .catch((error) => {
            isLoadingButton.value = false;
            toast.add({ severity: 'error', summary: `${error.response.data.message}`, detail: 'Detalhe da Mensagem', life: 3000 });
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        })
        .finally(() => {
            isLoadingButton.value = false;
        });
});

const getRoles = () => {
    axios
        .get(`${baseURL}/roles`)
        .then((response) => {
            // toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
            roles.value = response.data.role.data;
            isLoadingDiv.value = false;
        })
        .catch((error) => {
            isLoadingDiv.value = false;
            toast.add({ severity: 'error', summary: `${error}`, detail: 'Message Detail', life: 3000 });
            goBackUsingBack();
        });
};
onMounted(() => {
    getRoles();
});
</script>
<template>
    <div className="card" v-if="!isLoadingDiv">
        <div class="col-12">
            <div class="card-w-title">
                <Button label="Voltar" class="mr-2 mb-2" @click="goBackUsingBack"><i class="pi pi-angle-left"></i> Voltar</Button>
                <h5>Criar Usuário</h5>
            </div>

            <small class="p-error">Os campos marcados * sao considerados campos obrigatorios.</small>
            <form @submit="onSubmit">
                <div class="col-12 md:col-12">
                    <div class="card p-fluid">
                        <h5>Formulário Criação de Usuários</h5>

                        <div class="field">
                            <label for="name">Nome</label>
                            <InputText v-model="name" id="name" type="text" :class="{ 'p-invalid': errors.name }" />
                            <small id="name-help" class="p-error">{{ errors.name }}</small>
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <InputText v-model="email" id="email" type="text" :class="{ 'p-invalid': errors.email }" />
                            <small id="email-help" class="p-error">{{ errors.email }}</small>
                        </div>
                        <div class="field">
                            <label for="mobile">Telefone</label>
                            <InputText v-model="mobile" id="mobile" type="text" :class="{ 'p-invalid': errors.mobile }" />
                            <small id="mobile-help" class="p-error">{{ errors.mobile }}</small>
                        </div>
                        <div class="field">
                            <label for="role_id">Nivel</label>
                            <Dropdown v-model="role_id" :options="roles" optionLabel="name" optionValue="id" placeholder="Selecionar" :class="{ 'p-invalid': errors.role_id }" />
                            <small id="role_id-help" class="p-error">{{ errors.role_id }}</small>
                        </div>
                        <div class="field">
                            <label for="password">Palavra passe</label>
                            <InputText v-model="password" id="password" type="text" :class="{ 'p-invalid': errors.password }" />
                            <small id="password-help" class="p-error">{{ errors.password }}</small>
                        </div>
                    </div>
                    <Button label="Submeter" class="mr-2 mb-2" @click="onSubmit" :disabled="isLoadingButton"></Button
                    ><ProgressSpinner style="width: 35px; height: 35px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="isLoadingButton" />
                </div>
            </form>
        </div>
    </div>
    <div class="text-center" v-else>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        <p>Por Favor Aguarde...</p>
    </div>
</template>
