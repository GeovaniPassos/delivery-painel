import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Categories } from './components/categories/categories';
import { Orders } from './components/orders/orders';
import path from 'path/win32';
import { Products } from './components/products/products';
import { Optionais } from './components/optionais/optionais';

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
            { path: 'categorias', component: Categories },
            { path: 'produtos', component: Products },
            // { path: 'carrinho', component: Cart },
            // { path: 'login', component: Login },
            // { path: 'pizzas', component: PizzaModal },
            // { path: 'combos', component: ComboModal },
            { path: 'opcionais', component: Optionais },
        ]
    } 
    
];