import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { Orders } from './features/orders/orders';
import { Categories } from './features/categories/categories';
import { Products } from './features/products/products';
import { Optionais } from './features/optionais/optionais';

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