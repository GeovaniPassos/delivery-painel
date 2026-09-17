import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';

export const routes: Routes = [
    
    {
        path: 'Layout',
        redirectTo: '',
        pathMatch: 'full'
    },

    // caso a url não existir, ir para uma página de erro, ou para a home
    // { 
    //     path: '**', component: PageNotFoundComponent 
    // },
    
    {
        path: '',
        component: Layout,

        children: [
            // { path: 'home', component: Home },
            // { path: 'produtos', component: ProductsGrid },
            // { path: 'carrinho', component: Cart },
            // { path: 'login', component: Login },
            // { path: 'pizzas', component: PizzaModal },
            // { path: 'combos', component: ComboModal },
            // { path: 'opcionais', component: DefaultModal },
        ]
    } 
    
];