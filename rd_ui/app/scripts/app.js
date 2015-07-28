angular.module('redash', [
    'redash.directives',
    'redash.admin_controllers',
    'redash.controllers',
    'redash.filters',
    'redash.services',
    'redash.renderers',
    'redash.visualization',
    'highchart',
    'ui.select2',
    'angular-growl',
    'angularMoment',
    'ui.bootstrap',
    'smartTable.table',
    'ngResource',
    'ngRoute',
    'ui.select',
    'naif.base64'
  ]).constant('REDASH_ROOT', featureFlags.staticRoot)
    .config(['$routeProvider', '$locationProvider', '$compileProvider', 'growlProvider', 'REDASH_ROOT',
    function ($routeProvider, $locationProvider, $compileProvider, growlProvider, REDASH_ROOT) {
      if (featureFlags.clientSideMetrics) {
        Bucky.setOptions({
          host: '/api/metrics'
        });

        Bucky.requests.monitor('ajax_requsts');
        Bucky.requests.transforms.enable('dashboards', /dashboard\/[\w-]+/ig, '/dashboard');
      }

      function getQuery(Query, $route) {
        var query = Query.get({'id': $route.current.params.queryId });
        return query.$promise;
      };

      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http|data):/);
      $locationProvider.html5Mode(true);
      growlProvider.globalTimeToLive(2000);

      $routeProvider.when('/dashboard/:dashboardSlug', {
        templateUrl: REDASH_ROOT + 'views/dashboard.html',
        controller: 'DashboardCtrl',
        reloadOnSearch: false
      });
      $routeProvider.when('/queries', {
        templateUrl: REDASH_ROOT + 'views/queries.html',
        controller: 'QueriesCtrl',
        reloadOnSearch: false
      });
      $routeProvider.when('/queries/new', {
        templateUrl: REDASH_ROOT + 'views/query.html',
        controller: 'QuerySourceCtrl',
        reloadOnSearch: false,
        resolve: {
          'query': ['Query', function newQuery(Query) {
            return Query.newQuery();
          }]
        }
      });
      $routeProvider.when('/queries/search', {
        templateUrl: REDASH_ROOT + 'views/queries_search_results.html',
        controller: 'QuerySearchCtrl',
        reloadOnSearch: true,
      });
      $routeProvider.when('/queries/:queryId', {
        templateUrl: REDASH_ROOT + 'views/query.html',
        controller: 'QueryViewCtrl',
        reloadOnSearch: false,
        resolve: {
          'query': ['Query', '$route', getQuery]
        }
      });
      $routeProvider.when('/queries/:queryId/source', {
        templateUrl: REDASH_ROOT + 'views/query.html',
        controller: 'QuerySourceCtrl',
        reloadOnSearch: false,
        resolve: {
          'query': ['Query', '$route', getQuery]
        }
      });
      $routeProvider.when('/admin/status', {
        templateUrl: REDASH_ROOT + 'views/admin_status.html',
        controller: 'AdminStatusCtrl'
      });

      $routeProvider.when('/alerts', {
        templateUrl: REDASH_ROOT + 'views/alerts/list.html',
        controller: 'AlertsCtrl'
      });
      $routeProvider.when('/alerts/:alertId', {
        templateUrl: REDASH_ROOT + 'views/alerts/edit.html',
        controller: 'AlertCtrl'
      });

      $routeProvider.when('/data_sources/:dataSourceId', {
        templateUrl: REDASH_ROOT + 'views/data_sources/edit.html',
        controller: 'DataSourceCtrl'
      });
      $routeProvider.when('/data_sources', {
        templateUrl: REDASH_ROOT + 'views/data_sources/list.html',
        controller: 'DataSourcesCtrl'
      });

      $routeProvider.when('/', {
        templateUrl: REDASH_ROOT + 'views/index.html',
        controller: 'IndexCtrl'
      });
      $routeProvider.when('/personal', {
        templateUrl: REDASH_ROOT + 'views/personal.html',
        controller: 'PersonalIndexCtrl'
      });
      $routeProvider.otherwise({
        redirectTo: REDASH_ROOT
      });


    }
  ]);
