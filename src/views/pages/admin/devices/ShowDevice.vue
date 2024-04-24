<script setup>
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { baseURL, storageURL } from '@/service/ApiConstant';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import moment from 'moment';


const router = useRouter();
const isLoadingDiv = ref(true);
const isLoadingButton = ref(false);
const retriviedData = ref();
const toast = useToast();

function goBackUsingBack() {
    if (router) {
        router.back();
    }
}
const schema = yup.object({
    name: yup.string().required().label('Name'),
    address: yup.string().required().label('Address'),
    city: yup.string().required().label('City'),
    province_id: yup.string().required().label('Province')
    // email: yup.string().required().email().label('Email address'),
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
const [address] = defineField('address');
const [city] = defineField('city');
const [province_id] = defineField('province_id');

const onSubmit = handleSubmit((values) => {
    console.log('Submitted with', values);
    isLoadingButton.value = true;
    axios
        .post(`${baseURL}/devices`, values)
        .then((response) => {
            resetForm();
            router.push({ path: '/devices' });
            toast.add({ severity: 'success', summary: `Successo`, detail: 'Registro criada com sucesso', life: 3000 });
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

const getData = () => {
    axios
        .get(`${baseURL}/devices/${router.currentRoute.value.params.id}`)
        .then((response) => {
            // toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
            retriviedData.value = response.data.device;
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
        <div class="col-12">
            <div class="card-w-title">
                <Button label="Voltar" class="mr-2 mb-2" @click="goBackUsingBack"><i class="pi pi-angle-left"></i> Voltar</Button>
                <h5>Dispositivo</h5>
            </div>

            <div class="grid">
                <div class="col-12 lg:col-6 xl:col-6">
                    <p>Detalhes da Dispositivo</p>
                    <p><strong>Nome:</strong> {{ retriviedData.name }}</p>
                    <p><strong>Marca:</strong> {{ retriviedData.make }}</p>
                    <p><strong>Modelo:</strong> {{ retriviedData.model }}</p>
                    <p><strong>Serial:</strong> {{ retriviedData.serial }}</p>
                    <p><strong>Tipo de Dispositivo:</strong> {{ retriviedData.typedevice.name }}</p>
                    <p>
                        <strong>Estado:</strong>
                        <Tag severity="danger" v-if="retriviedData.device_status_id == 2">{{ retriviedData.devicestatus.name }}</Tag>
                        <Tag severity="success" v-if="retriviedData.device_status_id == 1">{{ retriviedData.devicestatus.name }}</Tag>
                    </p>
                    <p>
                        <strong>Disponibilidade:</strong>
                        <Tag severity="danger" v-if="retriviedData.device_availability_id == 2">{{ retriviedData.deviceavailability.name }}</Tag>
                        <Tag severity="success" v-if="retriviedData.device_availability_id == 1">{{ retriviedData.deviceavailability.name }}</Tag>
                        <span v-if="retriviedData.device_availability_id == 2">({{ retriviedData.employeeholding.employee.name }})</span>
                    </p>
                    <p><strong>Criado em:</strong> {{ moment(retriviedData.created_at).format('DD-MM-YYYY H:mm') }}</p>
                </div>
                <div class="col-12 lg:col-6 xl:col-6">
                    <img :src="storageURL + retriviedData.image ?? 'default.jpg'" alt="" style="border-radius: 15px" />
                </div>
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        <p>Por Favor Aguarde...</p>
    </div>
</template>
