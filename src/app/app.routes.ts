import { Routes } from '@angular/router';
import { validateTokenMatchGuard } from './core/guards/validate-token-match-guard';
import { checkRoleGuard } from './core/guards/check-role-guard';
import { userExistsGuard } from './core/guards/user-exists-guard';
import { missionDraftExistsGuard } from './core/guards/mission-draft-exists-guard';
import { agentDraftExistsGuard } from './core/guards/agent-draft-exists-guard';
import { resetPasswordGuard } from './core/guards/reset-password-guard';

export const routes: Routes = [
    // PUBLICAS
    {
        path: "",
        loadComponent: () => import('./features/auth/views/auth/auth'),
        children: [
            { path: "", loadComponent: () => import('./features/auth/views/login/login') },
            { path: "forgot-password", loadComponent: () => import('./features/auth/views/forgot-password/forgot-password') },
            { 
                canActivate: [resetPasswordGuard],
                path: "reset-password", 
                loadComponent: () => import('./features/auth/views/reset-password/reset-password') 
            }
        ]
    },
    
    // PRIVADAS
    {
        path: "",
        canMatch: [validateTokenMatchGuard],
        loadComponent: () => import('./features/private/views/private-layout/private'),
        data: { breadcrumb: "Home" },
        children: [
            // DASHBOARD
            { path: "dashboard", loadComponent: () => import('./features/private/views/dashboard/dashboard') },

            // MIS-MISIONES
            { 
                path: "mis-misiones", 
                data: { breadcrumb: "Mis Misiones" },
                children: [
                    {
                        path: "",
                        loadComponent: () => import('./features/private/views/missions/my-missions/my-missions'),
                    },
                    {
                        path: ":mission",
                        loadComponent: () => import('./features/private/views/missions/shared/mission-datail/mission-datail'),
                        data: { redirectTo: '/mis-misiones', breadcrumbFromParam: true },
                    },
                ],
            },

            // MISIONES (GENERAL)
            { 
                path: "misiones", 
                canMatch: [checkRoleGuard],
                data: { roles: ['admin', 'assistant'], breadcrumb: "Misiones" },
                children: [
                    {
                        path: "", 
                        loadComponent: () => import('./features/private/views/missions/missions/missions'),
                    },
                    { 
                        path: "nueva-mision",
                        data: { breadcrumb: "Nueva Misión" },
                        children: [
                            {
                                path: "", 
                                loadComponent: () => import('./features/private/views/missions/new-mission/new-mission/new-mission') ,
                            },
                            { 
                                path: "seleccionar-agentes",
                                canActivate: [missionDraftExistsGuard],
                                loadComponent: () => import('./features/private/views/missions/new-mission/select-agents/select-agents'),
                                data: { breadcrumb: "Seleccionar Agentes" },
                            },
                        ]
                    },
                    {
                        path: ":mission",
                        data: { redirectTo: '/misiones', breadcrumbFromParam: true },
                        children: [
                            {
                                path: "",
                                loadComponent: () => import('./features/private/views/missions/shared/mission-datail/mission-datail'),
                            },
                            {
                                path: "actualizar-mision",
                                loadComponent: () => import('./features/private/views/missions/update-mission/update-mission-details/update-mission-details'), 
                                data: { breadcrumb: "Actualizar Misión", breadcrumbFromParam: false },
                            },
                            {
                                path: "reasignar-agentes",
                                loadComponent: () => import('./features/private/views/missions/update-mission/update-mission-agents/update-mission-agents'), 
                                data: { breadcrumb: "Reasignar Agentes", breadcrumbFromParam: false },
                            },
                        ]
                    },
                ]
            },

            // ESTADISTICAS
            {
                path: "estadisticas",
                data: {breadcrumb: "Estadísticas"},
                loadComponent: () => import('./features/private/views/statistics/statistics/statistics'),
            },

            // MAPAS
            { 
                path: "mapas", 
                data: { breadcrumb: "Mapas" }, 
                children: [
                    {
                        path: "",
                        loadComponent: () => import('./features/private/views/maps/maps/maps'), 
                    },
                    {
                        path: "nuevo-mapa",
                        loadComponent: () => import('./features/private/views/maps/new-map/new-map'), 
                        canMatch: [checkRoleGuard],
                        data: { roles: ['admin'], breadcrumb: "Nuevo Mapa" },
                    },
                ]
            },

            // AGENTES
            { 
                path: "agentes", 
                data: { breadcrumb: "Agentes" },
                children: [
                    // PRINCIPAL
                    {
                        path: "", 
                        loadComponent: () => import('./features/private/views/agents/agents/agents'),
                    },
                    // NUEVO AGENTE
                    {
                        path: "nuevo-agente",
                        canMatch: [checkRoleGuard],
                        data: { roles: ['admin'], breadcrumb: "Nuevo Agente" },
                        children: [
                            {
                                path: "",
                                loadComponent: () => import('./features/private/views/agents/new-agent/new-agent/new-agent'),
                            },
                            {
                                path: "agregar-habilidades/:agente",
                                canActivate: [agentDraftExistsGuard],
                                loadComponent: () => import('./features/private/views/agents/new-agent/add-abilities/add-abilities'), 
                                data: { breadcrumb: "Agregar Habilidades" },
                            },
                        ]
                    },
                    // PERFIL DE AGENTE
                    { 
                        path: ":agente", 
                        data: { breadcrumb: "Perfil", breadcrumbFromParam: true },
                        children: [
                            {
                                path: "", 
                                loadComponent: () => import('./features/private/views/agents/agent/agent'),
                            },
                            { 
                                path: "editar-perfil", 
                                loadComponent: () => import('./features/private/views/agents/edit-agent/edit-agent'),
                                data: { breadcrumb: "Editar Perfil", breadcrumbFromParam: false },
                            },
                            { 
                                path: "estadisticas", 
                                loadComponent: () => import('./features/private/views/statistics/agent-statistics/agent-statistics'),
                                data: { breadcrumb: "Estadísticas", breadcrumbFromParam: false },
                            },
                        ]
                    },
                ],
            },

            //CONFIGURACIÓN
            {
                path: "settings",
                data: {breadcrumb: "Configuraciones"},
                loadComponent: () => import('./features/private/views/settings/settings'),
            },
            
            // PERFIL
            { 
                path: "perfil/:user", 
                canActivate: [userExistsGuard],
                data: { breadcrumb: "Perfil", breadcrumbFromParam: true },
                children: [
                    {
                        path: "",
                        loadComponent: () => import('./features/private/views/profile/profile/profile'),
                    },
                    {
                        path: "estadisticas",
                        loadComponent: () => import('./features/private/views/profile/my-statistics/my-statistics'),
                        data: { breadcrumb: "Estadísticas", breadcrumbFromParam: false },
                    },
                ]
            },
        ]
    },

    {
        path: "**",
        redirectTo: ""
    },
];
