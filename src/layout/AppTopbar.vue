<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { logout } from '@/service/ApiConstant';
import { baseURL } from '@/service/ApiConstant';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const { layoutConfig, onMenuToggle } = useLayout();
const componentKey = ref(0);
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const notificationValue = ref([]);
const numberNotification = ref(0);
const toast = useToast();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    router.push('/profile');
};
const onNotificationClick = () => {
    router.push('/notifications');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const getData = async () => {
    axios
        .get(`${baseURL}/updatenotification`)
        .then((response) => {
            notificationValue.value = response.data.notifications;
            numberNotification.value = response.data.notifications.length;

            if (notificationValue.value != 0) {
                toast.add({ severity: 'success', summary: 'Nova notificação', detail: 'Você tem uma nova notificação não lida. Aceda as aba das notificações para visualizar.', life: 3000 });
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
};

const refreshData = () => {
    console.log('refresh');
    componentKey.value += 1;
    getData();
};

onMounted(() => {
    getData();
    // setInterval(refreshData, 1000000);
    setInterval(refreshData, 1000000);

});
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/dashboard" class="layout-topbar-logo">
            <img src="/demo/sys/logo.jpg" alt="logo" />
            <span>CdM</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button> -->
            <i class="pi pi-bell mr-4 p-text-secondary" @click="onNotificationClick()" style="font-size: 2rem; cursor: pointer" v-badge="numberNotification" :key="componentKey"></i>
            <i class="pi pi-cog mr-4 p-text-secondary" @click="onSettingsClick()" style="font-size: 2rem; cursor: pointer"></i>
            <!-- <button @click="onSettingsClick()" class="p-link layout-topbar-button">
                <i class="pi pi-bell mr-4 p-text-secondary" style="font-size: 2rem" v-badge="2"></i>
                <span>Notificações</span>
            </button> -->
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
