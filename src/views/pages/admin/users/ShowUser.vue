<script setup>
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { baseURL } from '@/service/ApiConstant';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { Bootstrap4Pagination, TailwindPagination } from 'laravel-vue-pagination';
import Paginator from 'primevue/paginator';

const router = useRouter();
const isLoadingDiv = ref(true);
const isLoadingButton = ref(false);
const retriviedData = ref();
const auditData = ref();
const toast = useToast();
const displayMoreInfo = ref(false);
const actualActivity = ref([]);

function goBackUsingBack() {
    if (router) {
        router.back();
    }
}
const closeMoreInfo = () => {
    displayMoreInfo.value = false;
};
const showMoreData = (data) => {
    actualActivity.value = data;
    displayMoreInfo.value = true;
};
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
        .post(`${baseURL}/users`, values)
        .then((response) => {
            resetForm();
            router.push({ path: '/users' });
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

const getData = async (page = 1) => {
    axios
        .get(`${baseURL}/users/${router.currentRoute.value.params.id}?page=${page}`)
        .then((response) => {
            // toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
            retriviedData.value = response.data.user;
            auditData.value = response.data.audit;
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
                <h5>Usuario</h5>
            </div>

            <h5>Detalhes da Usuario</h5>
            <p><strong>Nome:</strong> {{ retriviedData.name }}</p>
            <p><strong>Email:</strong> {{ retriviedData.email }}</p>
            <p><strong>Telefone:</strong> {{ retriviedData.mobile }}</p>
            <p><strong>Nível:</strong> {{ retriviedData.role.name }}</p>
            <p><strong>Criado em:</strong> {{ moment(retriviedData.created_at).format('DD-MM-YYYY H:mm') }}</p>
            <hr>
            <h5>Auditoria de Registro do Usuario</h5>
            <DataTable :value="auditData.data" tableStyle="min-width: 50rem">
                <template #header>
                    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                        <span class="text-xl text-900 font-bold">Dispositivos</span>
                        <Button icon="pi pi-refresh" rounded raised @click="getData" />
                    </div>
                </template>
                <Column field="id" header="#">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="created_at" sortable header="Criado em">
                   
                    <template #body="slotProps">
                        {{ moment(slotProps.data.created_at).format('DD-MM-YYYY H:mm') }}
                </template>
                </Column>
                <Column field="created_at" sortable header="Criado em">
                    <template #body="slotProps">
                        {{ moment(slotProps.data.created_at).format('DD-MM-YYYY H:mm') }}
                    </template>
                </Column>
                <Column field="subject_type" sortable header="Nome do Recurso Afetado"></Column>
                <Column field="event" sortable header="Tipo">
                    <template #body="slotProps">
                        <Tag severity="success" v-if="slotProps.data.event === 'created'">{{ slotProps.data.event }}</Tag>
                        <Tag severity="warning" v-if="slotProps.data.event === 'updated'">{{ slotProps.data.event }}</Tag>
                        <Tag severity="danger" v-if="slotProps.data.event === 'deleted'">{{ slotProps.data.event }}</Tag>
                    </template>
                </Column>
                <Column field="causer.name" sortable header="Feito por"></Column>
                <!-- <Column field="properties.attributes" sortable header="Parametros Novos"></Column>
                <Column field="properties.old" sortable header="Parametros Antigos"></Column> -->
                <Column header="Ações">
                    <template #body="slotProps">
                        <a href="#" @click.prevent="showMoreData(slotProps.data)"><i class="pi pi-eye"></i></a>
                    </template>
                </Column>
                <template #footer> No total são {{ auditData.data ? auditData.total : 0 }} Transações. </template>
            </DataTable>
            <TailwindPagination :data="auditData" @pagination-change-page="getData" bg-whitebg-blue-50 style="width: 10px" />
            
        </div>
    </div>
    <div class="text-center" v-else>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        <p>Por Favor Aguarde...</p>
    </div>

    <Dialog header="Informacoes" v-model:visible="displayMoreInfo" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
        <div class="justify-content-left">
            
            <p><strong>ID:</strong>{{ actualActivity.id }}</p>
            <p><strong>Criado em:</strong>{{ moment(actualActivity.created_at).format('DD-MM-YYYY H:mm') }}</p>
            <p><strong>Feito Por:</strong>{{ actualActivity.causer == null ? '' : actualActivity.causer.name }}</p>
            <p>
                <strong>Tipo:</strong>
                <Tag severity="info" v-if="actualActivity.event === 'login'">{{ actualActivity.event }}</Tag>
                <Tag severity="success" v-if="actualActivity.event === 'created'">{{ actualActivity.event }}</Tag>
                <Tag severity="warning" v-if="actualActivity.event === 'updated'">{{ actualActivity.event }}</Tag>
                <Tag severity="danger" v-if="actualActivity.event === 'deleted'">{{ actualActivity.event }}</Tag>
            
            </p>
            <p><strong>Recurso Afetado:</strong>{{ actualActivity.subject_type }}</p>
            <div>
                <hr>
                <p><strong>Antigos Parametros</strong></p>
                <!-- <p>{{ actualActivity.properties.old }}</p> -->
                <table >
                    <thead v-if="actualActivity.properties.old">
                        <tr>
                            <th>Parâmetro</th>
                            <th>Antigo Valor</th>
                            <th>Novo Valor</th>
                        </tr>
                    </thead>
                    <thead v-else>
                        <tr>
                            <th>Parâmetro</th>
                            <th>Antigo Valor</th>
                            <th>Novo Valor</th>
                        </tr>
                    </thead>
                    <tbody v-if="actualActivity.properties.old">
                        <tr v-for="(value, key) in actualActivity.properties.old" :key="key">
                            <td>{{ key }}</td>
                            <td>{{ value }}</td>
                            <td>{{ actualActivity.properties.attributes[key] }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr v-for="(value, key) in actualActivity.properties.attributes" :key="key">
                            <td>{{ key }}</td>
                            <td>{{ value }}</td>
                            <!-- <td>{{ actualActivity.properties.attributes[key] }}</td> -->
                        </tr>
                    </tbody>

                </table>
            </div>
            <!-- <div v-if="actualActivity.properties.attributes">
                <hr>
                <p><strong>Novos Parametros</strong></p>
                <p>{{ actualActivity.properties.attributes }}</p>
            </div> -->
           
            
        </div>
        <template #footer>
            <Button label="OK" icon="pi pi-check" @click="closeMoreInfo" class="p-button-text"/>
        </template>
    </Dialog>

</template>
<style scoped>
th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>