<script setup>
import NodeService from '@/service/NodeService';
import { ref, onMounted, watch } from 'vue';
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { baseURL, storageURL } from '@/service/ApiConstant';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';
import { debounce } from 'lodash';
import { Bootstrap4Pagination, TailwindPagination } from 'laravel-vue-pagination';
import { dragscroll } from 'vue-dragscroll';

const router = useRouter();
const layout = ref('grid');
const isLoadingDiv = ref(true);
const isLoadingButton = ref(false);
const retriviedData = ref({ data: [] });
const toast = useToast();
const searchQuery = ref(null);
const typedevices = ref([]);
const companies = ref([]);
const displayConfirmation = ref(false);
const type_device_id = ref(null);
// const company_id = ref(null);
// const employee_id = ref(null);
const dataviewValue = ref(null);
const tempDataViewValue = ref(null);
const tempEmployeeValue = ref(null);
const employeeValue = ref(null);
const display = ref(false);
const displayReturn = ref(false);
const overlayLoading = ref(false);
const delivery_id = ref(null);
const observation_returning = ref(null);

function goBackUsingBack() {
    if (router) {
        router.back();
    }
}
const treeValue = ref(null);
const selectedTreeValue = ref(null);
const nodeService = new NodeService();

const getData = async (page = 1) => {
    axios
        .get(`${baseURL}/deliveries?page=${page}`, {
            params: {
                query: searchQuery.value
            }
        })
        .then((response) => {
            retriviedData.value = response.data.companies;
            companies.value = response.data.companies;
            typedevices.value = response.data.typedevices;
            type_device_id.value = typedevices.value.length == 0 ? 0 : typedevices.value[0].id;
            dataviewValue.value = typedevices.value.length == 0 ? 0 : typedevices.value[0].devices;
            isLoadingDiv.value = false;
            isLoadingButton.value = false;
            closeReturn();
        })
        .catch((error) => {
            isLoadingDiv.value = false;
            toast.add({ severity: 'error', summary: `${error}`, detail: 'Message Detail', life: 3000 });
            goBackUsingBack();
        });
};

const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;
    tempDataViewValue.value = typedevices.value.filter((data) => data.id == sortValue);
    dataviewValue.value = tempDataViewValue.value[0].devices;
};

const onSortCompanyChange = (event) => {
    const value2 = event.value.value;
    const sortValue2 = event.value;
    tempEmployeeValue.value = companies.value.filter((data) => data.id == sortValue2);
    employeeValue.value = tempEmployeeValue.value[0].employees;
};

const getStatus = (device) => {
    switch (device.device_status_id.toString()) {
        case '1':
            return 'success';

        case '2':
            return 'danger';

        default:
            return null;
    }
};

const open = (item) => {
    device_id.value = item.id;
    display.value = true;
};
const openReturn = (item) => {
    delivery_id.value = item.id;
    displayReturn.value = true;
};
const closeReturn = () => {
    displayReturn.value = false;
};
const close = () => {
    display.value = false;
};

const openOverLay = () => {
    overlayLoading.value = true;
};
const closeOverLay = () => {
    overlayLoading.value = false;
};

const getAvailability = (device) => {
    switch (device.device_availability_id.toString()) {
        case '1':
            return 'success';

        case '2':
            return 'danger';

        default:
            return null;
    }
};

const getButtonStatus = (device) => {
    const value = device.device_availability_id == 2 || device.device_status_id == 2;
    switch (value) {
        case true:
            return 'danger';

        case false:
            return 'success';

        default:
            return null;
    }
};

const schema = yup.object({
    company_id: yup.string().required().label('Empresa'),
    employee_id: yup.string().required().label('Trabalhador'),
    observation_delivery: yup.string().optional().label('Observacao')
});

const schema2 = yup.object({
    observation_returning: yup.string().optional().label('Observacao')
});

const { defineField, handleSubmit, resetForm, errors, setErrors } = useForm({
    validationSchema: schema
});

const [company_id] = defineField('company_id');
const [device_id] = defineField('device_id');
const [employee_id] = defineField('employee_id');
const [observation_delivery] = defineField('observation_delivery');

const onSubmit = handleSubmit((values) => {
    isLoadingButton.value = true;
    axios
        .post(`${baseURL}/deliveries`, values)
        .then((response) => {
            close();
            resetForm();
            router.push({ path: '/deliveries' });
            toast.add({ severity: 'success', summary: `Successo`, detail: 'Entrega feita com sucesso', life: 3000 });
            getData();
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

const fields = ref(null);

const onUpdate = () => {
    fields.value = { observation_returning: observation_returning.value };
    isLoadingButton.value = true;
    axios
        .put(`${baseURL}/deliveries/${delivery_id.value}`, fields.value)
        .then((response) => {
            router.push({ path: '/deliveries' });
            toast.add({ severity: 'success', summary: `Successo`, detail: 'Devolução feita com sucesso', life: 3000 });
            getData();
        })
        .catch((error) => {
            isLoadingButton.value = false;
            toast.add({ severity: 'error', summary: `${error.response.data.message}`, detail: 'Detalhe da Mensagem', life: 3000 });
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        })
        .finally(() => {
            // isLoadingButton.value = false;
        });
};

const startDrag = (event, item) => {
    // console.log(item);
    event.dataTransfer.setData('itemID', item.id);
    event.dataTransfer.setData('deviceavailability', item.device_availability_id);
    event.dataTransfer.setData('devicestatus', item.device_status_id);
};

const onDrop = (event, item) => {
    const itemId = event.dataTransfer.getData('itemID');
    const availability = event.dataTransfer.getData('deviceavailability');
    const status = event.dataTransfer.getData('devicestatus');

    if (!itemId) {
        return;
    }

    if (availability == 2) {
        toast.add({ severity: 'error', summary: 'Este dispositivo encontra-se em uso no momento, escolhe outro.', detail: 'Detalhe da Mensagem', life: 3000 });
        return;
    }
    if (status == 2) {
        toast.add({ severity: 'error', summary: 'Este dispositivo encontra-se danificado no momento, escolhe outro', detail: 'Detalhe da Mensagem', life: 3000 });
        return;
    }

    // console.log(itemId.id);
    // console.log(item);
    // console.log(item.id);
    // if(itemId.)
    openOverLay();

    const values = {
        device_id: itemId,
        company_id: item.company_id,
        employee_id: item.id
    };

    // console.log(values);

    axios
        .post(`${baseURL}/deliveriesdragdrop`, values)
        .then((response) => {
            closeOverLay();
            resetForm();
            router.push({ path: '/deliveries' });
            toast.add({ severity: 'success', summary: `Successo`, detail: 'Entrega feita com sucesso', life: 3000 });
            getData();
        })
        .catch((error) => {
            closeOverLay();
            toast.add({ severity: 'error', summary: `${error.response.data.message}`, detail: 'Detalhe da Mensagem', life: 3000 });
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        })
        .finally(() => {
            closeOverLay();
        });
};

onMounted(() => {
    getData();
});
</script>

<template>
    <div class="col-12">
        <div class="card" v-if="!isLoadingDiv">
            <h5>Gestão de Entregas</h5>

            <Splitter style="height: auto" class="mb-5">
                <SplitterPanel :size="25" :minSize="20">
                    <Accordion :activeIndex="0">
                        <AccordionTab :header="company.name + `(${company.employees.length})`" v-for="company in retriviedData" :key="company.id">
                            <div
                                class="flex align-items-center justify-content-start mb-4 ml-2 mt-4"
                                v-for="employee in company.employees"
                                :key="employee.id"
                                @drop="onDrop($event, employee)"
                                @dragenter.prevent
                                @dragover.prevent
                                :class="employee.deviceinhold == null ? 'bg-blue-200' : 'bg-red-200'"
                                style="border-radius: 10px"
                            >
                                <span class="mt-3 mb-3 ml-2"><i class="pi pi-users"></i> {{ employee.name }} {{ employee.deviceinhold == null ? '' : `(${employee.deviceinhold.device.name})` }}</span>
                            </div>
                        </AccordionTab>
                    </Accordion>
                </SplitterPanel>

                <SplitterPanel :size="75">
                    <Splitter layout="vertical">
                        <SplitterPanel>
                            <div class="grid">
                                <div class="col-12">
                                    <div class="card">
                                        <h5>Dispositivos</h5>
                                        <DataView :value="dataviewValue" :layout="layout" :paginator="true" :rows="20">
                                            <template #header>
                                                <div class="grid grid-nogutter">
                                                    <div class="col-6 text-left">
                                                        <Dropdown v-model="type_device_id" :options="typedevices" optionLabel="name" optionValue="id" placeholder="Tipo de Dispositivo" @change="onSortChange($event)" />
                                                    </div>
                                                    <div class="col-6 text-right">
                                                        <DataViewLayoutOptions v-model="layout" />
                                                    </div>
                                                </div>
                                            </template>
                                            <!-- TIPO DE VISUALIZACAO LISTA -->
                                            <template #list="slotProps">
                                                <div class="grid grid-nogutter">
                                                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-12" draggable="true" @dragstart="startDrag($event, item)">
                                                        <div class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3" :class="{ 'border-top-1 surface-border': index !== 0 }">
                                                            <div class="md:w-10rem relative">
                                                                <img class="block xl:block mx-auto border-round w-full" :src="storageURL + item.image ?? 'default.jpg'" :alt="item.name" />
                                                                <Tag :value="item.devicestatus.name" :severity="getStatus(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
                                                                <Tag :value="item.deviceavailability.name" :severity="getAvailability(item)" class="absolute" style="left: 4px; bottom: 4px"></Tag>
                                                            </div>
                                                            <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                                                                <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                                                                    <div>
                                                                        <span class="font-medium text-secondary text-sm">{{ item.typedevice.name }}</span>
                                                                        <div class="text-lg font-medium text-900 mt-2">{{ item.name }}</div>
                                                                        <div class="text-lg font-medium text-900 mt-2">{{ item.serial }}</div>
                                                                        <div class="text-lg font-medium text-900 mt-2" v-if="item.employeeholding != null">{{ item.employeeholding.employee.name }} ({{ item.employeeholding.company.name }})</div>
                                                                    </div>
                                                                </div>
                                                                <div class="flex flex-column md:align-items-end gap-5">
                                                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                                                        <Button
                                                                            icon="pi pi-ellipsis-v"
                                                                            label="Atribuir"
                                                                            :disabled="item.device_status_id == 2 || item.device_availability_id == 2"
                                                                            class="flex-auto md:flex-initial white-space-nowrap"
                                                                            :severity="getButtonStatus(item)"
                                                                            @click="open(item)"
                                                                        ></Button>
                                                                        <Button icon="pi pi-refresh" v-if="item.employeeholding != null" @click="openReturn(item.employeeholding)"> </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                            <!-- TIPO DE VISUALIZACAO GRELHA -->
                                            <template #grid="slotProps">
                                                <div class="grid grid-nogutter">
                                                    <div v-for="(item, index) in slotProps.items" :key="index" draggable="true" @dragstart="startDrag($event, item)" class="col-12 sm:col-6 md:col-3 p-2">
                                                        <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                                                            <div class="surface-50 flex justify-content-center border-round p-3">
                                                                <div class="relative mx-auto">
                                                                    <img class="border-round w-full" :src="storageURL + item.image ?? 'default.jpg'" :alt="item.name" style="max-width: 200px" />
                                                                    <Tag :value="item.devicestatus.name" :severity="getStatus(item)" class="absolute" style="left: 4px; top: 4px"></Tag>
                                                                    <Tag :value="item.deviceavailability.name" :severity="getAvailability(item)" class="absolute" style="left: 4px; bottom: 4px"></Tag>
                                                                </div>
                                                            </div>
                                                            <div class="pt-4">
                                                                <div class="flex flex-row justify-content-between align-items-start gap-2">
                                                                    <div>
                                                                        <span class="font-medium text-secondary text-sm">{{ item.typedevice.name }}</span>
                                                                        <div class="text-sm font-medium text-900 mt-1">{{ item.name }}</div>
                                                                        <div class="text-sm font-medium text-900 mt-1">{{ item.serial }}</div>
                                                                        <div class="text-sm font-medium text-900 mt-1" v-if="item.employeeholding != null">{{ item.employeeholding.employee.name }} ({{ item.employeeholding.company.name }})</div>
                                                                    </div>
                                                                </div>
                                                                <div class="flex flex-column gap-4 mt-4">
                                                                    <div class="flex gap-2">
                                                                        <Button
                                                                            icon="pi pi-ellipsis-v"
                                                                            label="Atribuir"
                                                                            :disabled="item.device_status_id == 2 || item.device_availability_id == 2"
                                                                            class="flex-auto white-space-nowrap"
                                                                            :severity="getButtonStatus(item)"
                                                                            @click="open(item)"
                                                                        ></Button>
                                                                        <Button icon="pi pi-refresh" v-if="item.employeeholding != null" @click="openReturn(item.employeeholding)"> </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </DataView>
                                    </div>
                                </div>
                            </div>
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
            </Splitter>
        </div>
        <div class="text-center" v-else>
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            <p>Por Favor Aguarde...</p>
        </div>
    </div>
    <Dialog header="Atribuir Dispositivo" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
        <form @submit="onSubmit">
            <div class="col-12 md:col-12">
                <div class="card p-fluid">
                    <h5>Atribuição de Dispositivos</h5>
                    <div class="field">
                        <label for="company_id">Empresa({{ retriviedData.length }})</label>
                        <Dropdown v-model="company_id" :options="retriviedData" optionLabel="name" optionValue="id" placeholder="Empresa" @change="onSortCompanyChange($event)" />
                        <small id="company_id-help" class="p-error">{{ errors.company_id }}</small>
                    </div>
                    <div class="field">
                        <label for="employee_id">Trabalhadores ({{ employeeValue == null ? 0 : employeeValue.length }})</label>
                        <Dropdown v-model="employee_id" :options="employeeValue" optionLabel="name" optionValue="id" placeholder="Trabalhadores" />
                        <small id="employee_id-help" class="p-error">{{ errors.employee_id }}</small>
                    </div>
                    <div class="field">
                        <label for="observation_delivery">Observação ao entregar</label>
                        <InputText v-model="observation_delivery" id="observation_delivery" type="text" :class="{ 'p-invalid': errors.observation_delivery }" />
                    </div>
                    <InputText v-model="device_id" id="device_id" type="hidden" :class="{ 'p-invalid': errors.device_id }" />
                </div>
                <Button label="Submeter" class="mr-2 mb-2" @click="onSubmit" :disabled="isLoadingButton"></Button>
                <ProgressSpinner style="width: 35px; height: 35px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="isLoadingButton" />
            </div>
        </form>
        <template #footer> </template>
    </Dialog>

    <Dialog header="Devolução Dispositivo" v-model:visible="displayReturn" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
        <form @submit="onUpdate">
            <div class="col-12 md:col-12">
                <div class="card p-fluid">
                    <h5>Devolução de Dispositivos</h5>
                    <div class="field">
                        <label for="observation_returning">Observação ao devolver</label>
                        <InputText v-model="observation_returning" id="observation_returning" type="text" :class="{ 'p-invalid': errors.observation_returning }" />
                    </div>
                </div>
                <Button label="Submeter" class="mr-2 mb-2" @click="onUpdate" :disabled="isLoadingButton"></Button>
                <ProgressSpinner style="width: 35px; height: 35px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="isLoadingButton" />
            </div>
        </form>
        <template #footer> </template>
    </Dialog>

    <Dialog header="Atribuindo o dispositivo" v-model:visible="overlayLoading" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }" :modal="true">
        <div class="col-12 md:col-12">
            <div class="p-fluid text-center">
                <ProgressSpinner style="width: 35px; height: 35px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                <p>Por favor aguarde</p>
            </div>
        </div>
        <template #footer> </template>
    </Dialog>
</template>
