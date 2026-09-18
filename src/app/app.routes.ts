import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Categories } from './categories/categories';
import { Orders } from './orders/orders';
import path from 'path/win32';

export const routes: Routes = [
    
    {
        path: 'Login',
        redirectTo: '',
        pathMatch: 'full'
    },

    // // caso a url não existir, ir para uma página de erro, ou para a home
    // { 
    //     path: '**', component: PageNotFoundComponent 
    // },
    
    {
        path: '',
        component: Layout,

        children: [
            {   path: '',
                redirectTo: 'pedidos',
                pathMatch: 'full' },
            { path: 'pedidos', component: Orders },
            { path: 'categoria', component: Categories },
            // { path: 'produtos', component: ProductsGrid },
            // { path: 'carrinho', component: Cart },
            // { path: 'login', component: Login },
            // { path: 'pizzas', component: PizzaModal },
            // { path: 'combos', component: ComboModal },
            // { path: 'opcionais', component: DefaultModal },
        ]
    } 
    
];