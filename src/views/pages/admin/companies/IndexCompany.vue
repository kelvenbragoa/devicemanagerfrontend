<script setup>
import { ref } from 'vue';
</script>

<template>
    <div className="card">
        <div class="col-12">
            <div class="card-w-title">
                <h5>Empresas</h5>
                <IconField iconPosition="left">
                    <InputIcon class="pi pi-search" />
                    <InputText type="text" placeholder="Procurar ..." />
                </IconField>
            </div>

            <h5>Registro das Empresas</h5>

            <router-link to="/companies/create"> <Button label="Criar Novo Registro" class="mr-2 mb-2"></Button> </router-link>

            <p>Esta tabela contem 0 Registros.</p>

            <DataTable :value="products" tableStyle="min-width: 50rem">
                <template #header>
                    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                        <span class="text-xl text-900 font-bold">Products</span>
                        <Button icon="pi pi-refresh" rounded raised />
                    </div>
                </template>
                <Column field="name" header="Name"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="w-6rem border-round" />
                    </template>
                </Column>
                <Column field="price" header="Price">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
                    </template>
                </Column>
                <Column field="category" header="Category"></Column>
                <Column field="rating" header="Reviews">
                    <template #body="slotProps">
                        <Rating :modelValue="slotProps.data.rating" readonly :cancel="false" />
                    </template>
                </Column>
                <Column header="Status">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
                    </template>
                </Column>
                <template #footer> In total there are {{ products ? products.length : 0 }} products. </template>
            </DataTable>
        </div>
    </div>
</template>
