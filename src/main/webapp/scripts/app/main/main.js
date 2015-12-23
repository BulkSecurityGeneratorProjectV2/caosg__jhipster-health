'use strict';

angular.module('healthApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'site',
                url: '/',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/main/main.html',
                        controller: 'MainController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        $translatePartialLoader.addPart('weight');
                        $translatePartialLoader.addPart('points');
                        $translatePartialLoader.addPart('bloodPressure');
                        $translatePartialLoader.addPart('preferences');
                        $translatePartialLoader.addPart('units');
                        return $translate.refresh();
                    }],
                    points: function(Points) {
                        return Points.thisWeek().$promise;
                    },
                    preferences: function(Preferences) {
                        return Preferences.user().$promise;
                    },
                    bpReadings: function(BloodPressure) {
                        return BloodPressure.last30Days().$promise;
                    },
                    weights: function(Weight) {
                        return Weight.last30Days().$promise;
                    }
                }
            })
            .state('points.add', {
                parent: 'home',
                url: 'add/points',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/points/points-dialog.html',
                        controller: 'PointsDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    date: null,
                                    exercise: 0,
                                    meals: 0,
                                    alcohol: 0,
                                    notes: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('home', null, { reload: true });
                    }, function() {
                        $state.go('home');
                    })
                }]
            })
            .state('weight.add', {
                url: 'add/weight',
                parent: 'home',
                data: {
                    roles: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/weight/weight-dialog.html',
                        controller: 'WeightDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {timestamp: null, weight: null, id: null};
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('home', null, {reload: true});
                    }, function () {
                        $state.go('home');
                    })
                }]
            })
            .state('bloodPressure.add', {
                parent: 'home',
                url: 'add/bp',
                data: {
                    roles: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/bloodPressure/bloodPressure-dialog.html',
                        controller: 'BloodPressureDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {timestamp: null, systolic: null, diastolic: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('home', null, { reload: true });
                    }, function() {
                        $state.go('home');
                    })
                }]
            })
            .state('preferences.add', {
                parent: 'home',
                url: '/add/preferences',
                data: {
                    roles: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/preferences/preferences-dialog.html',
                        controller: 'PreferencesDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function (Preferences) {
                                return Preferences.user().$promise;
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('home', null, { reload: true });
                    }, function() {
                        $state.go('home');
                    })
                }]
            })
            .state('history', {
                parent: 'home',
                url: 'history',
                data: {
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/main/history.html',
                        controller: 'CalendarController'
                    }
                }
            })
            .state('history.points', {
                parent: 'history',
                url: '/points/{id}',
                data: {
                    roles: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/points/points-dialog.html',
                        controller: 'PointsDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Points', function(Points) {
                                return Points.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('history', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('history.bp', {
                parent: 'history',
                url: '/bp/{id}',
                data: {
                    roles: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/bloodPressure/bloodPressure-dialog.html',
                        controller: 'BloodPressureDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['BloodPressure', function(BloodPressure) {
                                return BloodPressure.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('history', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('history.weight', {
                parent: 'history',
                url: '/weight/{id}',
                data: {
                    roles: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/weight/weight-dialog.html',
                        controller: 'WeightDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Weight', function(Weight) {
                                return Weight.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('history', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
