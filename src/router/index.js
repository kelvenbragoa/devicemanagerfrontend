import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/dashboard/Dashboard.vue')
                },
                //companies route
                {
                    path: '/companies',
                    name: 'companies',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/companies/IndexCompany.vue')
                },
                {
                    path: '/companies/create',
                    name: 'companies.create',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/companies/CreateCompany.vue')
                },
                {
                    path: '/companies/:id',
                    name: 'companies.show',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/companies/ShowCompany.vue')
                },
                {
                    path: '/companies/:id/edit',
                    name: 'companies.edit',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/companies/EditCompany.vue')
                },
                //users route
                {
                    path: '/users',
                    name: 'users',
                    meta: {
                        requiresAuth: true
                    },
                    children:[
                        {
                            path: '/users',
                            name: 'users',
                            meta: {
                                requiresAuth: true
                            },
                            component: () => import('@/views/pages/admin/users/IndexUser.vue')
                        },
                        {
                            path: '/users/create',
                            name: 'users.create',
                            meta: {
                                requiresAuth: true
                            },
                            component: () => import('@/views/pages/admin/users/CreateUser.vue')
                        },
                        {
                            path: '/users/:id',
                            name: 'users.show',
                            meta: {
                                requiresAuth: true
                            },
                            component: () => import('@/views/pages/admin/users/ShowUser.vue')
                        },
                        {
                            path: '/users/:id/edit',
                            name: 'users.edit',
                            meta: {
                                requiresAuth: true
                            },
                            component: () => import('@/views/pages/admin/users/EditUser.vue')
                        },
        
                    ]
                },
                
                //employees route
                {
                    path: '/employees',
                    name: 'employees',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/employees/IndexEmployee.vue')
                },
                {
                    path: '/employees/create',
                    name: 'employees.create',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/employees/CreateEmployee.vue')
                },
                {
                    path: '/employees/:id',
                    name: 'employees.show',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/employees/ShowEmployee.vue')
                },
                {
                    path: '/employees/:id/edit',
                    name: 'employees.edit',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/employees/EditEmployee.vue')
                },

                //devices route
                {
                    path: '/devices',
                    name: 'devices',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/devices/IndexDevice.vue')
                },
                {
                    path: '/devices/create',
                    name: 'devices.create',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/devices/CreateDevice.vue')
                },
                {
                    path: '/devices/:id',
                    name: 'devices.show',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/devices/ShowDevice.vue')
                },
                {
                    path: '/devices/:id/edit',
                    name: 'devices.edit',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/devices/EditDevice.vue')
                },

                //typedevices route
                {
                    path: '/typedevices',
                    name: 'typedevices',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/typedevices/IndexTypeDevice.vue')
                },
                {
                    path: '/typedevices/create',
                    name: 'typedevices.create',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/typedevices/CreateTypeDevice.vue')
                },
                {
                    path: '/typedevices/:id',
                    name: 'typedevices.show',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/typedevices/ShowTypeDevice.vue')
                },
                {
                    path: '/typedevices/:id/edit',
                    name: 'typedevices.edit',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/typedevices/EditTypeDevice.vue')
                },

                //deliveries route
                {
                    path: '/deliveries',
                    name: 'deliveries',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/deliveries/IndexDelivery.vue')
                },
                {
                    path: '/transactions',
                    name: 'transactions',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/deliveries/IndexTransaction.vue')
                },
                {
                    path: '/notifications',
                    name: 'notifications',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/notifications/IndexNotification.vue')
                },
                {
                    path: '/audits',
                    name: 'audits',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/audits/IndexAuditLogs.vue')
                },
                {
                    path: '/deliveries/:id',
                    name: 'deliveries.show',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/deliveries/ShowDelivery.vue')
                },
                {
                    path: '/deliveries/:id/edit',
                    name: 'deliveries.edit',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/deliveries/EditDelivery.vue')
                },

                //profile route
                {
                    path: '/profile',
                    name: 'profile',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/profile/IndexProfile.vue')
                },
                {
                    path: '/profile/create',
                    name: 'profile.create',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/profile/CreateProfile.vue')
                },
                {
                    path: '/profile/:id',
                    name: 'profile.show',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/profile/ShowProfile.vue')
                },
                {
                    path: '/profile/:id/edit',
                    name: 'profile.edit',
                    meta: {
                        requiresAuth: true
                    },
                    component: () => import('@/views/pages/admin/profile/EditProfile.vue')
                }
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            // meta: {
            //     hideForAuth: true
            // },
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            // User is authenticated, proceed to the route
            next();
        } else {
            // User is not authenticated, redirect to login
            next('/auth/login');
        }
    } else {
        // Non-protected route, allow access
        next();
    }

    // if (to.meta.hideForAuth) {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         // User is authenticated, proceed to the route
    //         next('/dashboard');
    //     } else {
    //         // User is not authenticated, redirect to login
    //         next('/dashboard');
    //     }
    // } else {
    //     // Non-protected route, allow access
    //     next('/dashboard');
    // }
});

export default router;
