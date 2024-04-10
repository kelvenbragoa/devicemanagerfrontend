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
const typedevices = ref([]);
const devicestatus = ref([]);
const deviceavailability = ref([]);
const toast = useToast();

function goBackUsingBack() {
    if (router) {
        router.back();
    }
}
const schema = yup.object({
    name: yup.string().required().trim().label('Name'),
    make: yup.string().required().trim().label('make'),
    model: yup.string().required().trim().label('model'),
    serial: yup.string().required().trim().label('serial'),
    type_device_id: yup.string().required().trim().label('Dispositivo'),
    device_status_id: yup.string().required().trim().label('Estado'),
    device_availability_id: yup.string().required().trim().label('Disponibilidade')
    // email: yup.string().required().email().label('Email make'),
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
const [make] = defineField('make');
const [model] = defineField('model');
const [serial] = defineField('serial');
const [type_device_id] = defineField('type_device_id');
const [device_status_id] = defineField('device_status_id');
const [device_availability_id] = defineField('device_availability_id');
const image = ref();
const onSubmit = handleSubmit((values) => {
    if (image.value != null) {
        values.image = image.value;
    }
    
    // console.log(values);
    isLoadingButton.value = true;
    axios
        .post(`${baseURL}/devices`, values,{
            headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
            resetForm();
            router.push({ path: '/devices' });
            toast.add({ severity: 'success', summary: `Successo`, detail: 'Dispositivo criada com sucesso', life: 3000 });
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

const getTypeDeviceAndStatusCreateDevice = () => {
    axios
        .get(`${baseURL}/devices/create`)
        .then((response) => {
            // toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
            typedevices.value = response.data.typedevice;
            deviceavailability.value = response.data.deviceavailability;
            devicestatus.value = response.data.devicestatus;
            isLoadingDiv.value = false;
        })
        .catch((error) => {
            isLoadingDiv.value = false;
            toast.add({ severity: 'error', summary: `${error}`, detail: 'Message Detail', life: 3000 });
            goBackUsingBack();
        });
};

const onFileUpload = (event) => {
    image.value = event.files[0];
    console.log(image.value);
};
onMounted(() => {
    getTypeDeviceAndStatusCreateDevice();
});
</script>
<template>
    <div className="card" v-if="!isLoadingDiv">
        <div class="col-12">
            <div class="card-w-title">
                <Button label="Voltar" class="mr-2 mb-2" @click="goBackUsingBack"><i class="pi pi-angle-left"></i> Voltar</Button>
                <h5>Criar Dispositivo</h5>
            </div>

            <small class="p-error">Os campos marcados * sao considerados campos obrigatorios.</small>
            <form @submit="onSubmit">
                <div class="col-12 md:col-12">
                    <div class="card p-fluid">
                        <h5>Formulário Criação de Dispositivos</h5>

                        <div class="field">
                            <label for="name">Nome</label>
                            <InputText v-model="name" id="name" type="text" :class="{ 'p-invalid': errors.name }" />
                            <small id="name-help" class="p-error">{{ errors.name }}</small>
                        </div>
                        <div class="field">
                            <label for="make">Marca</label>
                            <InputText v-model="make" id="make" type="text" :class="{ 'p-invalid': errors.make }" />
                            <small id="make-help" class="p-error">{{ errors.make }}</small>
                        </div>
                        <div class="field">
                            <label for="model">Modelo</label>
                            <InputText v-model="model" id="model" type="text" :class="{ 'p-invalid': errors.model }" />
                            <small id="model-help" class="p-error">{{ errors.model }}</small>
                        </div>
                        <div class="field">
                            <label for="serial">Serial</label>
                            <InputText v-model="serial" id="serial" type="text" :class="{ 'p-invalid': errors.serial }" />
                            <small id="serial-help" class="p-error">{{ errors.serial }}</small>
                        </div>
                        <div class="field">
                            <label for="type_device_id">Tipo de Dispositivo</label>
                            <Dropdown v-model="type_device_id" :options="typedevices" optionLabel="name" optionValue="id" placeholder="Selecionar" :class="{ 'p-invalid': errors.type_device_id }" />
                            <small id="type_device_id-help" class="p-error">{{ errors.type_device_id }}</small>
                        </div>
                        <div class="field">
                            <label for="device_status_id">Estado do Dispositivo</label>
                            <Dropdown v-model="device_status_id" :options="devicestatus" optionLabel="name" optionValue="id" placeholder="Selecionar" :class="{ 'p-invalid': errors.device_status_id }" />
                            <small id="device_status_id-help" class="p-error">{{ errors.device_status_id }}</small>
                        </div>
                        <div class="field">
                            <label for="device_availability_id">Disponibilidade do Dispositivo</label>
                            <Dropdown v-model="device_availability_id" :options="deviceavailability" optionLabel="name" optionValue="id" placeholder="Selecionar" :class="{ 'p-invalid': errors.device_availability_id }" />
                            <small id="device_availability_id-help" class="p-error">{{ errors.device_availability_id }}</small>
                        </div>
                        <div class="field">
                            <label for="image">Imagem</label>
                            <FileUpload mode="basic" name="image[]" accept="image/*" auto :maxFileSize="1000000" customUpload @uploader="onFileUpload" />
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
