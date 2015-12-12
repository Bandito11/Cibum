//Esteban Morales
//email:esteban.a.morales.morales@gmail.com

angular.module('cibumApp', ['ionic', 'ui.router', 'cibumControllers', 'cibumServices', 'azure-mobile-service.module', 'ngResource'])

.config(Config)

.constant('AzureMobileServiceClient', {
    API_URL: 'https://cibum.azure-mobile.net/',
    API_KEY: 'nchFMjWKfTwpQpqFpQdMupKDeyrsJo31',
})

.run(Run)
;

///////////////////////////////
Config.$inject = ['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', '$resourceProvider'];
function Config($stateProvider, $urlRouterProvider, $sceDelegateProvider, $resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
     //Allow loading from our assets domain.  Notice the difference between * and **.
        'https://cibum.azure-mobile.net//**'
        ]);
    $stateProvider
    .state('ingredientes', {
        url:'/ingredientes',
        templateUrl: 'ingredientes.html',
        controller:'Ingredientes',
        controllerAs: 'ing'
    })
    .state('queryRecetas', {
        url: '/:lista',
        templateUrl:'listaRecetas.html',
        controller:'ListaRecetas',
        controllerAs: 'rec',
        params: {
            lista: { array: true }
        }
    })
    ;
    $urlRouterProvider.otherwise('/ingredientes');
}

function Run() { }

