<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';

import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import axios from 'axios';
import { baseURL } from '@/service/ApiConstant';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');
const toast = useToast();
const router = useRouter();
const pieData = ref(null);
const polarData = ref(null);
const polarOptions = ref(null);
const pieOptions = ref(null);
const { isDarkTheme } = useLayout();
const searchQuery = ref(null);
const transactions = ref(null);
const deliverytwentyfourhours = ref(null);
const isLoadingDiv = ref(true);
const retriviedData = ref();
function goBackUsingBack() {
    if (router) {
        router.back();
    }
}

const barData = ref({
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    datasets: [
        {
            label: 'Entregas Diárias',
            backgroundColor: documentStyle.getPropertyValue('--primary-500'),
            borderColor: documentStyle.getPropertyValue('--primary-500'),
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
});

const barDataMonth = ref({
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
        {
            label: 'Entregas Mensais',
            backgroundColor: documentStyle.getPropertyValue('--primary-500'),
            borderColor: documentStyle.getPropertyValue('--primary-500'),
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
});

const barOptions = ref({
    plugins: {
        legend: {
            labels: {
                fontColor: textColor
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: textColorSecondary,
                font: {
                    weight: 500
                }
            },
            grid: {
                display: false,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        }
    }
});

const lineOptions = ref(null);

const getData = async (page = 1) => {
    axios
        .get(`${baseURL}/dashboard`, {
            params: {
                query: searchQuery.value
            }
        })
        .then((response) => {
            retriviedData.value = response.data;
            barData.value.datasets[0].data = response.data.dataDeliveryDay;
            barDataMonth.value.datasets[0].data = response.data.dataDeliveryMonth;
            transactions.value = response.data.transactions;
            pieData.value.datasets[0].data = response.data.pieData;
            pieData.value.labels = response.data.pieLabel;
            polarData.value.datasets[0].data = response.data.polarData;
            polarData.value.labels = response.data.polarLabel;
            deliverytwentyfourhours.value = response.data.deliverytwentyfourhours;
            isLoadingDiv.value = false;
        })
        .catch((error) => {
            isLoadingDiv.value = false;
            toast.add({ severity: 'error', summary: `${error}`, detail: 'Message Detail', life: 3000 });
            goBackUsingBack();
        });
};

pieData.value = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [0, 0, 0],
            backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--orange-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400')]
        }
    ]
};

pieOptions.value = {
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                color: textColor
            }
        }
    }
};
polarData.value = {
    datasets: [
        {
            data: [11, 16, 7, 3],
            backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--orange-500')],
            label: 'My dataset'
        }
    ],
    labels: ['Indigo', 'Purple', 'Teal', 'Orange']
};

polarOptions.value = {
    plugins: {
        legend: {
            labels: {
                color: textColor
            }
        }
    },
    scales: {
        r: {
            grid: {
                color: surfaceBorder
            }
        }
    }
};
onMounted(() => {
    getData();
});

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid" v-if="!isLoadingDiv">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Dispositivos</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.devices }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-tablet text-blue-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/devices"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Empresas</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.companies }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-building text-blue-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/companies"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Trabalhadores</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.employees }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-blue-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/employees"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Entregas</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.deliveries }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-bar text-blue-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/deliveries"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Em Bom Funcionamento</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.workingfine }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-tablet text-green-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/devices"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Danificados</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.damaged }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-tablet text-red-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/devices"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Em Utilização</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.busy }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-tablet text-red-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/devices"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Disponíveis</span>
                        <div class="text-900 font-medium text-xl">{{ retriviedData.free }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-tablet text-green-500 text-xl"></i>
                    </div>
                </div>
                <router-link to="/devices"><i class="pi pi-eye text-blue-500 text-xl"></i></router-link>
            </div>
        </div>

        

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Entregas Diárias</h5>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Entregas Mensais</h5>
                <Chart type="bar" :data="barDataMonth" :options="barOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Distribuição dos dispositivos pelos tipos</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Distribuição dos Trabalhadores pelas empresas</h5>
                <Chart type="polarArea" :data="polarData" :options="polarOptions"></Chart>
            </div>
        </div>

        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Trabalhadores com 24 horas de uso de dispositivo ({{ deliverytwentyfourhours.length }})</h5>
                </div>

                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border" v-for="items in deliverytwentyfourhours" :key="items.id" >
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-bell text-xl text-red-500"></i>
                        </div>
                        <span class="text-900 line-height-3">
                            {{ moment(items.created_at).format('DD-MM-YYYY H:mm') }} - {{ items.employee.name }} da Empresa {{ items.company.name }} esta com o dispositivo {{ items.device.name }} a mais de
                            <Tag severity="danger"> {{ moment().diff(items.created_at, 'hours') }} Horas ({{ moment().diff(items.created_at, 'minutes') }} Minutos)</Tag>.
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Atividades/Transações Recentes</h5>
                    <router-link to="/transactions"><small>Ver todas transações</small></router-link>
                    <!-- <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items"></Menu>
                    </div> -->
                </div>

                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border" v-for="items in transactions" :key="items.id">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-bars text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3"
                            ><Tag severity="success" v-if="items.operation_id == 1"> {{ items.operation.name }}</Tag> <Tag severity="danger" v-if="items.operation_id == 2"> {{ items.operation.name }}</Tag>
                            {{ moment(items.created_at).format('DD-MM-YYYY H:mm') }} - {{ items.user.name }}
                            <span class="text-700">
                                efetuou uma operacao de
                                <Tag severity="success" v-if="items.operation_id == 1"> {{ items.operation.name }}</Tag>
                                <Tag severity="danger" v-if="items.operation_id == 2"> {{ items.operation.name }}</Tag>
                                do dispositivo {{ items.device.name }} ({{ items.employee.name }} - {{ items.employee.company.name }})
                            </span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        <p>Por Favor Aguarde...</p>
    </div>
</template>

<style> 
      
        /* Define a CSS animation named "blink" */ 
        @keyframes blink { 
  
            0%, 
            100% { 
                background-color: #ff0000; 
                /* First color - red */ 
            } 
  
            50% { 
                background-color: black; 
                /* Second color - black */ 
            } 
        } 
  
        /* Apply the "blink" animation to  
        elements with class "blinking-effect" */ 
        .blinking-effect { 
            animation: blink 1s linear infinite; 
            /* The animation will run indefinitely */ 
        } 
    </style> 
